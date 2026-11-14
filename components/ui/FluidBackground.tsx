'use client';

import { useEffect, useRef, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  WebGL Fluid Simulation – blue ink cloud / water effect             */
/*  Implements a simplified Navier-Stokes solver on the GPU using      */
/*  ping-pong framebuffers for velocity, pressure, and dye fields.     */
/* ------------------------------------------------------------------ */

interface FluidBackgroundProps {
  className?: string;
}

/* ---- helpers ---- */

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    console.error('Shader compile error:', error);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vs);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fs);
  if (!vert || !frag) return null;

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(prog);
    console.error('Program link error:', error);
    return null;
  }
  return prog;
}

/* ---- shaders ---- */

const BASE_VS = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;

  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const SPLAT_FS = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;

  void main () {
    vec2 p = vUv - point;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const ADVECTION_FS = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;

  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec3 result = dissipation * texture2D(uSource, coord).xyz;
    gl_FragColor = vec4(result, 1.0);
  }
`;

const DIVERGENCE_FS = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const PRESSURE_FS = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;

  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const GRADIENT_SUBTRACT_FS = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const DISPLAY_FS = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;

  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;
    float intensity = max(c.r, max(c.g, c.b));
    float alpha = smoothstep(0.01, 0.15, intensity) * 0.8;
    vec3 base = vec3(0.01, 0.02, 0.06);
    gl_FragColor = vec4(base + c, alpha);
  }
`;

const CURL_FS = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

const VORTICITY_FS = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;

  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * dt;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const CLEAR_FS = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;

  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

/* ---- types ---- */

interface DoubleFBO {
  read: WebGLFramebuffer;
  write: WebGLFramebuffer;
  readTex: WebGLTexture;
  writeTex: WebGLTexture;
  width: number;
  height: number;
  swap: () => void;
}

interface SingleFBO {
  fbo: WebGLFramebuffer;
  tex: WebGLTexture;
  width: number;
  height: number;
}

/* ---- component ---- */

export default function FluidBackground({ className }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const pointerRef = useRef({ x: 0.5, y: 0.5, dx: 0, dy: 0, moved: false, firstMove: true });
  const lastTimeRef = useRef(0);
  const splatStackRef = useRef<number>(0);

  /* Splat a random burst of colour for ambient motion */
  const randomSplats = useCallback((count: number) => {
    splatStackRef.current += count;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
      premultipliedAlpha: false,
    });
    if (!gl) {
      console.warn('WebGL not supported, falling back to static image');
      return;
    }

    /* ---- extensions ---- */
    const halfFloatExt = gl.getExtension('OES_texture_half_float');
    const linearExt = gl.getExtension('OES_texture_half_float_linear');
    
    if (!halfFloatExt) {
      console.warn('Half-float textures not supported, falling back to static image');
      return;
    }
    
    const floatType = halfFloatExt.HALF_FLOAT_OES;
    void linearExt; // just need to activate it

    /* ---- config ---- */
    const SIM_RES = 128;
    const DYE_RES = 512;
    const PRESSURE_ITERATIONS = 20;
    const CURL_STRENGTH = 30;
    const SPLAT_RADIUS = 0.35;
    const VELOCITY_DISSIPATION = 0.99;
    const DYE_DISSIPATION = 0.985;
    const PRESSURE_DISSIPATION = 0.8;
    const SPLAT_FORCE = 6000;

    /* ---- programs ---- */
    const splatProg = createProgram(gl, BASE_VS, SPLAT_FS);
    const advectionProg = createProgram(gl, BASE_VS, ADVECTION_FS);
    const divergenceProg = createProgram(gl, BASE_VS, DIVERGENCE_FS);
    const pressureProg = createProgram(gl, BASE_VS, PRESSURE_FS);
    const gradientProg = createProgram(gl, BASE_VS, GRADIENT_SUBTRACT_FS);
    const displayProg = createProgram(gl, BASE_VS, DISPLAY_FS);
    const curlProg = createProgram(gl, BASE_VS, CURL_FS);
    const vorticityProg = createProgram(gl, BASE_VS, VORTICITY_FS);
    const clearProg = createProgram(gl, BASE_VS, CLEAR_FS);

    if (!splatProg || !advectionProg || !divergenceProg || !pressureProg || !gradientProg || !displayProg || !curlProg || !vorticityProg || !clearProg) {
      console.warn('One or more shader programs failed to compile, falling back to static image');
      return;
    }

    /* ---- quad buffer ---- */
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const quadIndices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIndices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    /* ---- FBO helpers ---- */
    function createFBO(w: number, h: number): { fbo: WebGLFramebuffer; tex: WebGLTexture; width: number; height: number } | null {
      try {
        const tex = gl!.createTexture()!;
        gl!.bindTexture(gl!.TEXTURE_2D, tex);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, w, h, 0, gl!.RGBA, floatType, null);

        const fbo = gl!.createFramebuffer()!;
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
        gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
        
        if (gl!.checkFramebufferStatus(gl!.FRAMEBUFFER) !== gl!.FRAMEBUFFER_COMPLETE) {
          console.warn('Framebuffer incomplete');
          return null;
        }
        
        gl!.viewport(0, 0, w, h);
        gl!.clear(gl!.COLOR_BUFFER_BIT);

        return { fbo, tex, width: w, height: h };
      } catch (e) {
        console.error('Failed to create FBO:', e);
        return null;
      }
    }

    function createDoubleFBO(w: number, h: number): DoubleFBO | null {
      const fbo1 = createFBO(w, h);
      const fbo2 = createFBO(w, h);
      if (!fbo1 || !fbo2) return null;
      let a = fbo1, b = fbo2;
      return {
        get read() { return a.fbo; },
        get write() { return b.fbo; },
        get readTex() { return a.tex; },
        get writeTex() { return b.tex; },
        width: w,
        height: h,
        swap() { const t = a; a = b; b = t; },
      };
    }

    /* ---- blit ---- */
    function blit(target: WebGLFramebuffer | null, w?: number, h?: number) {
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, target);
      if (w && h) gl!.viewport(0, 0, w, h);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuffer);
      gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, quadIndices);
      gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0);
      gl!.enableVertexAttribArray(0);
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
    }

    /* ---- initialise FBOs ---- */
    let simW = 0, simH = 0, dyeW = 0, dyeH = 0;
    let velocity: DoubleFBO | null = null;
    let dye: DoubleFBO | null = null;
    let pressure: DoubleFBO | null = null;
    let divergence: SingleFBO | null = null;
    let curl: SingleFBO | null = null;

    function initFBOs() {
      const ratio = canvas!.width / canvas!.height;
      simW = ratio >= 1 ? SIM_RES : Math.round(SIM_RES * ratio);
      simH = ratio >= 1 ? Math.round(SIM_RES / ratio) : SIM_RES;
      dyeW = ratio >= 1 ? DYE_RES : Math.round(DYE_RES * ratio);
      dyeH = ratio >= 1 ? Math.round(DYE_RES / ratio) : DYE_RES;

      velocity = createDoubleFBO(simW, simH);
      dye = createDoubleFBO(dyeW, dyeH);
      pressure = createDoubleFBO(simW, simH);
      divergence = createFBO(simW, simH);
      curl = createFBO(simW, simH);

      if (!velocity || !dye || !pressure || !divergence || !curl) {
        console.warn('Failed to create FBOs, falling back to static image');
        return false;
      }
      return true;
    }

    /* ---- resize ---- */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const w = Math.round(canvas!.clientWidth * dpr);
      const h = Math.round(canvas!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        if (!initFBOs()) return false;
      }
      return true;
    }

    if (!resize()) return;

    /* ---- uniform setters ---- */
    function bindProgram(prog: WebGLProgram) { gl!.useProgram(prog); }
    function uniform1i(prog: WebGLProgram, name: string, v: number) { gl!.uniform1i(gl!.getUniformLocation(prog, name), v); }
    function uniform1f(prog: WebGLProgram, name: string, v: number) { gl!.uniform1f(gl!.getUniformLocation(prog, name), v); }
    function uniform2f(prog: WebGLProgram, name: string, x: number, y: number) { gl!.uniform2f(gl!.getUniformLocation(prog, name), x, y); }
    function uniform3f(prog: WebGLProgram, name: string, x: number, y: number, z: number) { gl!.uniform3f(gl!.getUniformLocation(prog, name), x, y, z); }

    function bindTexture(unit: number, tex: WebGLTexture) {
      gl!.activeTexture(gl!.TEXTURE0 + unit);
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
    }

    // TypeScript assertions after null checks
    const sp = splatProg!;
    const adv = advectionProg!;
    const div = divergenceProg!;
    const prs = pressureProg!;
    const grad = gradientProg!;
    const disp = displayProg!;
    const crl = curlProg!;
    const vort = vorticityProg!;
    const clr = clearProg!;

    /* ---- splat ---- */
    function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
      if (!velocity || !dye) return;
      // Velocity splat
      bindProgram(sp);
      uniform1i(sp, 'uTarget', 0);
      uniform1f(sp, 'aspectRatio', canvas!.width / canvas!.height);
      uniform2f(sp, 'point', x, y);
      uniform3f(sp, 'color', dx, dy, 0);
      uniform1f(sp, 'radius', SPLAT_RADIUS / 100);
      bindTexture(0, velocity.readTex);
      blit(velocity.write, simW, simH);
      velocity.swap();

      // Dye splat
      uniform1i(sp, 'uTarget', 0);
      uniform3f(sp, 'color', color[0], color[1], color[2]);
      bindTexture(0, dye.readTex);
      blit(dye.write, dyeW, dyeH);
      dye.swap();
    }

    /* ---- colour palette (deep ocean / ink blues) ---- */
    function randomBlueColor(): [number, number, number] {
      const palettes: [number, number, number][] = [
        [0.02, 0.12, 0.45],   // deep blue
        [0.04, 0.20, 0.65],   // medium blue
        [0.01, 0.08, 0.35],   // dark navy
        [0.06, 0.25, 0.70],   // bright blue
        [0.03, 0.15, 0.55],   // ocean blue
        [0.08, 0.30, 0.75],   // lighter blue
        [0.01, 0.05, 0.25],   // very deep navy
        [0.05, 0.18, 0.60],   // cerulean
        [0.02, 0.10, 0.40],   // midnight blue
        [0.00, 0.06, 0.30],   // abyssal blue
      ];
      const c = palettes[Math.floor(Math.random() * palettes.length)];
      const intensity = 0.5 + Math.random() * 0.7;
      return [c[0] * intensity, c[1] * intensity, c[2] * intensity];
    }

    /* ---- do a splat burst ---- */
    function splatBurst(count: number) {
      if (!velocity || !dye) return;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 150 + Math.random() * 300;
        const x = Math.random();
        const y = Math.random();
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        splat(x, y, dx, dy, randomBlueColor());
      }
    }

    /* ---- initial splats to fill the canvas ---- */
    if (velocity && dye) {
      splatBurst(Math.floor(Math.random() * 8) + 10);
    }

    /* ---- ambient timer – keeps the fluid alive ---- */
    let ambientTimer = 0;

    /* ---- step ---- */
    function step(dt: number) {
      if (!velocity || !dye || !pressure || !divergence || !curl) return;
      
      /* Ambient motion – inject gentle splats periodically */
      ambientTimer += dt;
      if (ambientTimer > 2.5 + Math.random() * 3) {
        ambientTimer = 0;
        const cx = Math.random();
        const cy = Math.random();
        const angle = Math.random() * Math.PI * 2;
        const speed = 80 + Math.random() * 200;
        splat(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed, randomBlueColor());
      }

      /* Process queued user splat-bursts */
      if (splatStackRef.current > 0) {
        splatBurst(splatStackRef.current);
        splatStackRef.current = 0;
      }

      /* ---- Curl ---- */
      bindProgram(crl);
      uniform2f(crl, 'texelSize', 1.0 / simW, 1.0 / simH);
      uniform1i(crl, 'uVelocity', 0);
      bindTexture(0, velocity.readTex);
      blit(curl.fbo, simW, simH);

      /* ---- Vorticity confinement ---- */
      bindProgram(vort);
      uniform2f(vort, 'texelSize', 1.0 / simW, 1.0 / simH);
      uniform1i(vort, 'uVelocity', 0);
      uniform1i(vort, 'uCurl', 1);
      uniform1f(vort, 'curl', CURL_STRENGTH);
      uniform1f(vort, 'dt', dt);
      bindTexture(0, velocity.readTex);
      bindTexture(1, curl.tex);
      blit(velocity.write, simW, simH);
      velocity.swap();

      /* ---- Divergence ---- */
      bindProgram(div);
      uniform2f(div, 'texelSize', 1.0 / simW, 1.0 / simH);
      uniform1i(div, 'uVelocity', 0);
      bindTexture(0, velocity.readTex);
      blit(divergence.fbo, simW, simH);

      /* ---- Pressure clear ---- */
      bindProgram(clr);
      uniform1i(clr, 'uTexture', 0);
      uniform1f(clr, 'value', PRESSURE_DISSIPATION);
      bindTexture(0, pressure.readTex);
      blit(pressure.write, simW, simH);
      pressure.swap();

      /* ---- Pressure solve (Jacobi iterations) ---- */
      bindProgram(prs);
      uniform2f(prs, 'texelSize', 1.0 / simW, 1.0 / simH);
      uniform1i(prs, 'uDivergence', 1);
      bindTexture(1, divergence.tex);
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        uniform1i(prs, 'uPressure', 0);
        bindTexture(0, pressure.readTex);
        blit(pressure.write, simW, simH);
        pressure.swap();
      }

      /* ---- Gradient subtraction ---- */
      bindProgram(grad);
      uniform2f(grad, 'texelSize', 1.0 / simW, 1.0 / simH);
      uniform1i(grad, 'uPressure', 0);
      uniform1i(grad, 'uVelocity', 1);
      bindTexture(0, pressure.readTex);
      bindTexture(1, velocity.readTex);
      blit(velocity.write, simW, simH);
      velocity.swap();

      /* ---- Advect velocity ---- */
      bindProgram(adv);
      uniform2f(adv, 'texelSize', 1.0 / simW, 1.0 / simH);
      uniform1i(adv, 'uVelocity', 0);
      uniform1i(adv, 'uSource', 0);
      uniform1f(adv, 'dt', dt);
      uniform1f(adv, 'dissipation', VELOCITY_DISSIPATION);
      bindTexture(0, velocity.readTex);
      blit(velocity.write, simW, simH);
      velocity.swap();

      /* ---- Advect dye ---- */
      uniform2f(adv, 'texelSize', 1.0 / dyeW, 1.0 / dyeH);
      uniform1i(adv, 'uVelocity', 0);
      uniform1i(adv, 'uSource', 1);
      uniform1f(adv, 'dissipation', DYE_DISSIPATION);
      bindTexture(0, velocity.readTex);
      bindTexture(1, dye.readTex);
      blit(dye.write, dyeW, dyeH);
      dye.swap();
    }

    /* ---- render loop ---- */
    function frame(t: number) {
      const dt = Math.min((t - lastTimeRef.current) / 1000, 0.033);
      lastTimeRef.current = t;

      if (!resize()) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      /* ---- pointer splat ---- */
      const ptr = pointerRef.current;
      if (ptr.moved && velocity && dye) {
        ptr.moved = false;
        splat(ptr.x, ptr.y, ptr.dx * SPLAT_FORCE, ptr.dy * SPLAT_FORCE, randomBlueColor());
      }

      step(dt);

      /* ---- display ---- */
      if (dye) {
        gl!.viewport(0, 0, canvas!.width, canvas!.height);
        bindProgram(disp);
        uniform1i(disp, 'uTexture', 0);
        bindTexture(0, dye.readTex);
        blit(null);
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    /* ---- pointer events ---- */
    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      const ptr = pointerRef.current;
      if (ptr.firstMove) {
        ptr.firstMove = false;
        ptr.x = x;
        ptr.y = y;
        return;
      }
      ptr.dx = x - ptr.x;
      ptr.dy = y - ptr.y;
      ptr.x = x;
      ptr.y = y;
      ptr.moved = true;
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas!.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = 1.0 - (touch.clientY - rect.top) / rect.height;
      const ptr = pointerRef.current;
      if (ptr.firstMove) {
        ptr.firstMove = false;
        ptr.x = x;
        ptr.y = y;
        return;
      }
      ptr.dx = x - ptr.x;
      ptr.dy = y - ptr.y;
      ptr.x = x;
      ptr.y = y;
      ptr.moved = true;
    }

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Trigger ambient splats on click for extra interactivity
  const handleClick = useCallback(() => {
    randomSplats(Math.floor(Math.random() * 3) + 3);
  }, [randomSplats]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        position: 'absolute',
        inset: 0,
      }}
    />
  );
}
