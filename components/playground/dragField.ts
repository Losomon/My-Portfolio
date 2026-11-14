import {
  Frustum,
  Group,
  MathUtils,
  Matrix4,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

const VERTEX_SHADER = `
uniform vec2 uSpeed;

varying vec2 vUv;
varying vec3 vWorldPos;

void main() {
  vUv = uv;

  vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;

  float dist = pow(length(worldPos.xy), 1.5);
  worldPos.xy -= dist * uSpeed.xy * 0.03;
  worldPos.z += dist * length(uSpeed) * 0.04;

  gl_Position = projectionMatrix * worldPos;
}
`;

const FRAGMENT_SHADER = `
uniform sampler2D tImage;
uniform vec2 uContain;
uniform vec3 uBg;
uniform float uReady;

varying vec2 vUv;
varying vec3 vWorldPos;

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

void main() {
  vec2 inner = (vUv - 0.05) / 0.9;
  vec2 uv = (inner - 0.5) / uContain + 0.5;

  vec3 color = uBg;
  if (uReady > 0.0 && uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
    vec4 tex = texture2D(tImage, uv);
    color = mix(uBg, tex.rgb, tex.a * uReady);
  }

  float fade = smoothstep(1.0, 2.5, length(vWorldPos.xy));
  color = mix(color, vec3(luma(color)), fade);

  gl_FragColor = vec4(color, 1.0);
}
`;

const FADE_EASE = 0.12;

type CardData = { src: string; bg: [number, number, number] };

type DragFieldOptions = {
  onFail?: () => void;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const value = parseInt(hex.replace('#', ''), 16);
  if (Number.isNaN(value)) return [1, 1, 1];
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const loadImage = (image: HTMLImageElement) =>
  new Promise<void>((resolve) => {
    if (image.complete && image.naturalWidth > 0) {
      resolve();
      return;
    }

    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener('error', () => resolve(), { once: true });
  });

const containScale = (image: HTMLImageElement, cardAspect: number) => {
  const sourceAspect = image.naturalWidth / image.naturalHeight || cardAspect;
  return sourceAspect > cardAspect
    ? new Vector2(1, cardAspect / sourceAspect)
    : new Vector2(sourceAspect / cardAspect, 1);
};

export class DragField {
  private root: HTMLElement;

  private container: HTMLElement;

  private options: DragFieldOptions;

  private params = { width: 1.3, height: (447 / 537) * 1.3, row: 3, col: 6, gap: 0.1 };

  private renderer: WebGLRenderer | null = null;

  private canvas: HTMLCanvasElement | null = null;

  private scene = new Scene();

  private camera = new PerspectiveCamera(50, 1, 0.01, 100);

  private cards = new Group();

  private geometry: PlaneGeometry | null = null;

  private textures: Texture[] = [];

  private materials: ShaderMaterial[][] = [];

  private fading = new Set<ShaderMaterial>();

  private speed = { value: new Vector2() };

  private target = { x: 0, y: 0 };

  private frustum = new Frustum();

  private projView = new Matrix4();

  private center = new Vector3();

  private edge = new Vector3();

  private data: CardData[] = [];

  private images: HTMLImageElement[] = [];

  private nearObserver: IntersectionObserver | null = null;

  private io: IntersectionObserver | null = null;

  private resizeObserver: ResizeObserver | null = null;

  private pending: Promise<void> | null = null;

  private failed = false;

  private destroyed = false;

  private live = false;

  private visible = true;

  private running = false;

  private needsRender = true;

  private dragging = false;

  private pointer = { x: 0, y: 0 };

  constructor(root: HTMLElement, options: DragFieldOptions = {}) {
    this.root = root;
    this.options = options;
    this.container = root.querySelector('[data-playground-drag-canvas]') as HTMLElement;
    this.data = Array.from(root.ownerDocument.querySelectorAll<HTMLElement>('[data-playground-card]'))
      .map((card) => ({
        src: card.querySelector('img')?.getAttribute('src') ?? '',
        bg: hexToRgb(card.style.getPropertyValue('--card-bg').trim() || '#ffffff'),
      }))
      .filter((card) => card.src);
  }

  warm() {
    if (this.destroyed) return Promise.resolve();
    this.observeNear();
    if (!this.root.getClientRects().length) return Promise.resolve();
    return this.setup();
  }

  nudge(delta: number) {
    if (!this.live) return;
    this.target.y += delta * 0.003;
  }

  dispose() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.nearObserver?.disconnect();
    this.nearObserver = null;
    this.live = false;
    this.running = false;
    this.dragging = false;
    this.renderer?.setAnimationLoop(null);
    this.teardown();
    this.images.forEach((image) => {
      image.src = '';
    });
  }

  private observeNear() {
    if (this.nearObserver) return;

    this.nearObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) this.setup();
      },
      { rootMargin: '100% 0px' },
    );

    this.nearObserver.observe(this.root);
  }

  private setup() {
    if (this.renderer || this.destroyed || this.failed) return Promise.resolve();

    this.pending ??= this.runSetup().finally(() => {
      this.pending = null;
    });

    return this.pending;
  }

  private async runSetup() {
    try {
      await nextFrame();
      if (this.destroyed || this.renderer) return;

      if (!this.data.length) {
        this.fail();
        return;
      }

      this.createImages();
      this.createGL();
      this.createCards();
      await nextFrame();

      const renderer = this.renderer as WebGLRenderer | null;
      if (this.destroyed || !renderer) return;

      renderer.compile(this.scene, this.camera);
      await nextFrame();
      if (this.destroyed || !this.renderer) return;

      this.ready();
      this.streamTextures();
    } catch (error) {
      console.warn('[playground-drag] setup failed:', error);
      this.fail();
    }
  }

  private createImages() {
    this.images = this.data.map(({ src }) => {
      const image = new Image();
      image.decoding = 'async';
      image.fetchPriority = 'auto';
      image.src = src;
      return image;
    });
  }

  private createGL() {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.canvas = this.renderer.domElement;
    this.canvas.addEventListener('webglcontextlost', this.onContextLost);
    this.container.appendChild(this.canvas);

    const { height, gap, row } = this.params;
    this.camera.position.z = height * 2 + gap * (row + 1);

    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(this.container);
    this.resize();
  }

  private createCards() {
    const { width, height, row, col, gap } = this.params;

    this.geometry = new PlaneGeometry(width, height, 50, 50);
    this.textures = this.images.map(() => new Texture());
    this.materials = this.images.map(() => []);

    const offsetTop = ((width + gap) * (col - 1)) / 2;
    const offsetLeft = ((height + gap) * (row - 1)) / 2;
    const rowShift = (height + gap) / 2;
    let index = 0;

    for (let column = 0; column < col; column += 1) {
      for (let line = 0; line < row; line += 1) {
        const dataIndex = index % this.data.length;
        const material = new ShaderMaterial({
          uniforms: {
            tImage: { value: this.textures[dataIndex] },
            uContain: { value: new Vector2(1, 1) },
            uBg: { value: new Vector3(...this.data[dataIndex].bg) },
            uReady: { value: 0 },
            uSpeed: this.speed,
          },
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
        });

        this.materials[dataIndex].push(material);

        const mesh = new Mesh(this.geometry, material);
        mesh.position.set(
          (width + gap) * column - offsetTop,
          (height + gap) * line - offsetLeft + (column % 2 === 0 ? rowShift : 0),
          0,
        );

        this.cards.add(mesh);
        index += 1;
      }
    }

    this.scene.add(this.cards);
  }

  private streamTextures() {
    const cardAspect = this.params.width / this.params.height;

    this.images.forEach((image, index) => {
      loadImage(image)
        .then(() => image.decode?.().catch(() => {}))
        .then(() => {
          const renderer = this.renderer as WebGLRenderer | null;
          if (this.destroyed || !renderer) return;

          const texture = this.textures[index];
          texture.image = image;
          texture.needsUpdate = true;
          renderer.initTexture(texture);

          const contain = containScale(image, cardAspect);
          this.materials[index].forEach((material) => {
            material.uniforms.uContain.value.copy(contain);
            this.fading.add(material);
          });

          this.needsRender = true;
        })
        .catch(() => {});
    });
  }

  private ready() {
    this.live = true;
    this.needsRender = true;

    this.root.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('pointercancel', this.onUp);
    window.addEventListener('blur', this.onUp);
    document.addEventListener('visibilitychange', this.toggle);

    this.io = new IntersectionObserver((entries) => {
      this.visible = entries[0]?.isIntersecting ?? false;
      this.toggle();
    });
    this.io.observe(this.root);

    this.root.classList.add('is-ready');
  }

  private fail() {
    this.failed = true;
    this.teardown();
    this.options.onFail?.();
  }

  private teardown() {
    this.live = false;
    this.running = false;
    this.root.classList.remove('is-ready');

    this.root.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointercancel', this.onUp);
    window.removeEventListener('blur', this.onUp);
    document.removeEventListener('visibilitychange', this.toggle);

    this.io?.disconnect();
    this.io = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    this.fading.clear();
    this.cards.children.forEach((child) => {
      const mesh = child as Mesh;
      (mesh.material as ShaderMaterial).dispose();
    });
    this.scene.remove(this.cards);
    this.cards = new Group();

    this.geometry?.dispose();
    this.geometry = null;
    this.textures.forEach((texture) => texture.dispose());
    this.textures = [];
    this.materials = [];

    const renderer = this.renderer as WebGLRenderer | null;
    if (renderer) {
      renderer.setAnimationLoop(null);
      this.canvas?.removeEventListener('webglcontextlost', this.onContextLost);
      renderer.dispose();
      renderer.forceContextLoss();
      this.canvas?.remove();
    }

    this.renderer = null;
    this.canvas = null;
  }

  private updateFades() {
    if (!this.fading.size) return;

    this.fading.forEach((material) => {
      const uniform = material.uniforms.uReady;
      uniform.value += (1 - uniform.value) * FADE_EASE;
      if (uniform.value > 0.995) {
        uniform.value = 1;
        this.fading.delete(material);
      }
    });

    this.needsRender = true;
  }

  private wrapCards() {
    this.camera.updateMatrixWorld();
    this.projView.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.projView);

    const { width, height, row, col, gap } = this.params;
    const spanY = (height + gap) * row;
    const spanX = (width + gap) * col;

    this.cards.children.forEach((child) => {
      child.getWorldPosition(this.center);

      const goingDown = this.center.y < 0;
      this.edge.copy(this.center);
      this.edge.y += goingDown ? height / 2 + gap : -(height / 2 + gap);
      this.edge.x = 0;
      if (!this.frustum.containsPoint(this.edge)) child.position.y += goingDown ? spanY : -spanY;

      const goingRight = this.center.x < 0;
      this.edge.copy(this.center);
      this.edge.x += goingRight ? width / 2 + gap : -(width / 2 + gap);
      this.edge.y = 0;
      if (!this.frustum.containsPoint(this.edge)) child.position.x += goingRight ? spanX : -spanX;
    });
  }

  private tick = () => {
    const renderer = this.renderer as WebGLRenderer | null;
    if (!renderer) return;

    const position = this.cards.position;
    position.x = MathUtils.lerp(position.x, this.target.x, 0.1);
    position.y = MathUtils.lerp(position.y, this.target.y, 0.1);

    const speed = this.speed.value;
    speed.x = MathUtils.lerp(speed.x, this.target.x - position.x, 0.1);
    speed.y = MathUtils.lerp(speed.y, this.target.y - position.y, 0.1);

    this.updateFades();

    const settled =
      Math.abs(speed.x) + Math.abs(speed.y) < 1e-5 &&
      Math.abs(this.target.x - position.x) + Math.abs(this.target.y - position.y) < 1e-5;

    if (settled && !this.needsRender) return;

    this.wrapCards();
    renderer.render(this.scene, this.camera);
    this.needsRender = false;
  };

  private toggle = () => {
    const shouldRun = this.live && this.visible && !document.hidden;
    if (shouldRun === this.running) return;

    this.running = shouldRun;
    this.needsRender = true;
    (this.renderer as WebGLRenderer | null)?.setAnimationLoop(shouldRun ? this.tick : null);
  };

  private resize = () => {
    const renderer = this.renderer as WebGLRenderer | null;
    if (!renderer || !this.container) return;

    const { clientWidth, clientHeight } = this.container;
    if (!clientWidth || !clientHeight) return;

    const aspect = clientWidth / clientHeight;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
    this.scene.scale.setScalar(MathUtils.smoothstep(aspect, 1.969, 3) * 0.5 + 1);
    this.needsRender = true;
  };

  private onDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    this.dragging = true;
    this.pointer = { x: event.clientX, y: event.clientY };
  };

  private onMove = (event: PointerEvent) => {
    if (!this.dragging) return;
    this.target.x += (event.clientX - this.pointer.x) * 0.004;
    this.target.y -= (event.clientY - this.pointer.y) * 0.004;
    this.pointer = { x: event.clientX, y: event.clientY };
  };

  private onUp = () => {
    this.dragging = false;
  };

  private onContextLost = (event: Event) => {
    event.preventDefault();
    this.fail();
  };
}