'use client';

import { useEffect, useRef } from 'react'

interface SoffitProps {
  className?: string
  active?: boolean
}

const CONFIG = {
  bgColor: '#3a1206',
  colorA: '#c4451a',
  colorB: '#ff8a2b',
  colorC: '#f5c842',
  colorD: '#fff6e2',
  scale: 0.2,
  speed: 0.33,
  tilt: 2.96,
  rock: 0.3,
  horizon: 0.15,
  breathe: 0.12,
  spread: -2.03,
  curve: 3.14,
  direct: 0.6,
  bounce: 0.64,
  bounceCurve: 2.2,
  spillCentre: 0.12,
  spillWidth: 1.91,
  spillFloor: 0.66,
  amount: 0.47,
  warp: 2.83,
  warpScale: 1.2,
  flow: 0.2,
  roughness: 0.53,
  lacunarity: 2.23,
  motes: 0.074,
  moteScale: 18,
  ambient: 0.16,
  contrast: 2.98,
  midpoint: 0.78,
  sink: 0.1,
  glow: 0.29,
  grain: 0,
  grainAnim: 0,
  dither: 1.11,
  vignette: 0.07,
  steer: -0.24,
  lift: 0.09,
  sweep: 0.32,
  cursor: 1,
  parallax: 0.01,
  maxDpr: 1,
}

function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  iResolution;
uniform float iTime;
uniform vec2  iMouse;
uniform float uScale;
uniform vec3  uBg, uColorA, uColorB, uColorC, uColorD;
uniform float uSpeed, uTilt, uRock, uHorizon, uBreathe, uSpread, uCurve, uDirect;
uniform float uBounce, uBounceCurve;
uniform float uSpillCentre, uSpillWidth, uSpillFloor;
uniform float uAmount, uWarp, uWarpScale, uFlow, uRoughness, uLacunarity, uMotes, uMoteScale;
uniform float uAmbient, uContrast, uMidpoint, uSink, uGlow;
uniform float uGrain, uDither, uVignette;
uniform float uSteer, uLift, uSweep, uParallax;
uniform float uGrainAnim;

#define OCTAVES 3

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float snoise(vec2 p) {
  const float K1 = 0.366025404, K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
  return dot(n, vec3(70.0));
}

float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += amp * snoise(p);
    p *= uLacunarity;
    amp *= uRoughness;
  }
  return v;
}

vec3 ramp4(float t) {
  vec3 c = mix(uColorA, uColorB, smoothstep(0.00, 0.36, t));
  c = mix(c, uColorC, smoothstep(0.32, 0.70, t));
  c = mix(c, uColorD, smoothstep(0.66, 1.00, t));
  return c;
}

float triDither(vec2 fc) {
  float a = fract(sin(dot(fc, vec2(12.9898, 78.233))) * 43758.5453);
  float b = fract(sin(dot(fc + 17.0, vec2(12.9898, 78.233))) * 43758.5453);
  return (a + b - 1.0) / 255.0;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
  uv *= uScale;
  vec2 iM = iMouse * uScale;
  float t = iTime * uSpeed;

  vec2 p = uv - iM * uParallax;

  float tilt = uTilt + sin(t * 0.13) * uRock + iM.x * uSteer;
  vec2 dir = vec2(cos(tilt), sin(tilt));
  float axis = dot(p, dir);
  float across = dot(p, vec2(-dir.y, dir.x));

  vec2 q = vec2(fbm(p * uWarpScale + vec2(0.0, t * uFlow)),
                fbm(p * uWarpScale + vec2(5.2, 1.3) - t * uFlow * 0.7));
  float air = fbm(p + uWarp * q + vec2(t * 0.12, -t * 0.09)) * 0.5 + 0.5;

  float horizon = uHorizon + sin(t * 0.09 + 2.1) * uBreathe - iM.y * uLift;
  float alt = clamp(0.5 + (axis - horizon) * uSpread + (air - 0.5) * uAmount, 0.0, 1.0);

  float ac = (across - uSpillCentre - iM.x * uSweep) / max(0.05, uSpillWidth);
  float spill = mix(uSpillFloor, 1.0, exp(-ac * ac));

  float direct = pow(alt, max(0.05, uCurve)) * uDirect * spill;
  float bounce = uBounce * pow(1.0 - alt, max(0.05, uBounceCurve));

  float f = uAmbient + direct + bounce;
  f = clamp((f - uMidpoint) * uContrast + 0.5, 0.0, 1.0);

  vec3 col = ramp4(f);
  col += uColorD * uGlow * pow(f, 4.0);
  col = mix(uBg, col, smoothstep(0.0, max(0.01, uSink), f) * 0.90 + 0.10);
  col *= 1.0 - uVignette * dot(uv, uv);
  col += triDither(gl_FragCoord.xy) * uDither;

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`

export default function Soffit({ className, active = true }: SoffitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!active) return undefined
    const canvasEl = canvasRef.current
    if (!canvasEl) return undefined

    const glCtx = canvasEl.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!glCtx) {
      console.warn('WebGL2 is not available in this browser.')
      return undefined
    }

    const gl = glCtx!
    const canvas = canvasEl!

    function compile(type: number, src: string) {
      const sh = gl.createShader(type)!
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(sh)!)
      }
      return sh
    }

    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program)!)
    }
    gl.useProgram(program)
    gl.bindVertexArray(gl.createVertexArray()!)

    const LOC: Record<string, WebGLUniformLocation | null> = {}
    const loc = (n: string) => (n in LOC ? LOC[n] : (LOC[n] = gl.getUniformLocation(program, n)))
    const u1f = (n: string, v: number) => gl.uniform1f(loc(n)!, v)
    const u2f = (n: string, x: number, y: number) => gl.uniform2f(loc(n)!, x, y)
    const u3c = (n: string, hex: string) => {
      const c = hexToVec3(hex)
      gl.uniform3f(loc(n)!, c[0], c[1], c[2])
    }

    function applyConfig() {
      gl.useProgram(program)
      u3c('uBg', CONFIG.bgColor)
      u3c('uColorA', CONFIG.colorA)
      u3c('uColorB', CONFIG.colorB)
      u3c('uColorC', CONFIG.colorC)
      u3c('uColorD', CONFIG.colorD)
      u1f('uScale', CONFIG.scale)
      u1f('uSpeed', CONFIG.speed)
      u1f('uTilt', CONFIG.tilt)
      u1f('uRock', CONFIG.rock)
      u1f('uHorizon', CONFIG.horizon)
      u1f('uBreathe', CONFIG.breathe)
      u1f('uSpread', CONFIG.spread)
      u1f('uCurve', CONFIG.curve)
      u1f('uDirect', CONFIG.direct)
      u1f('uBounce', CONFIG.bounce)
      u1f('uBounceCurve', CONFIG.bounceCurve)
      u1f('uSpillCentre', CONFIG.spillCentre)
      u1f('uSpillWidth', CONFIG.spillWidth)
      u1f('uSpillFloor', CONFIG.spillFloor)
      u1f('uAmount', CONFIG.amount)
      u1f('uWarp', CONFIG.warp)
      u1f('uWarpScale', CONFIG.warpScale)
      u1f('uFlow', CONFIG.flow)
      u1f('uRoughness', CONFIG.roughness)
      u1f('uLacunarity', CONFIG.lacunarity)
      u1f('uMotes', 0.0)
      u1f('uMoteScale', CONFIG.moteScale)
      u1f('uAmbient', CONFIG.ambient)
      u1f('uContrast', CONFIG.contrast)
      u1f('uMidpoint', CONFIG.midpoint)
      u1f('uSink', CONFIG.sink)
      u1f('uGlow', CONFIG.glow)
      u1f('uGrain', CONFIG.grain)
      u1f('uGrainAnim', CONFIG.grainAnim)
      u1f('uDither', CONFIG.dither)
      u1f('uVignette', CONFIG.vignette)
      u1f('uSteer', CONFIG.steer)
      u1f('uLift', CONFIG.lift)
      u1f('uSweep', CONFIG.sweep)
      u1f('uParallax', CONFIG.parallax)
      resize()
    }

    let dpr = 1
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 0.75)
      const w = Math.max(1, Math.round(innerWidth * dpr))
      const h = Math.max(1, Math.round(innerHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
      gl.useProgram(program)
      u2f('iResolution', w, h)
    }

    let resizeQueued = false
    const onResize = () => {
      if (resizeQueued) return
      resizeQueued = true
      requestAnimationFrame(() => {
        resizeQueued = false
        resize()
      })
    }
    window.addEventListener('resize', onResize, { passive: true })

    let visible = true
    const observer = new IntersectionObserver(
      (es) => {
        visible = es[0].isIntersecting
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    const t0 = performance.now()
    let lastDraw = 0
    const clockStart = 0.0

    function frame(now: number) {
      rafRef.current = requestAnimationFrame(frame)
      if (!visible || document.hidden) return
      if (now - lastDraw < 66) return
      lastDraw = now

      const clock = clockStart + (now - t0) * 0.001
      u1f('iTime', clock)
      u2f('iMouse', 0.0, 0.0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    applyConfig()
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    const rafTimer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(frame)
    }, 100)

    return () => {
      clearTimeout(rafTimer)
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      gl.useProgram(null)
      gl.deleteProgram(program)
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
      }}
    />
  )
}