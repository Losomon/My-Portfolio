'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { libraryAudio } from '@/lib/ambientAudio';

interface DigitalLibrarySceneProps {
  onEnterPortfolio: () => void;
  onSkipImmediately: () => void;
}

interface FlyingBook {
  group: THREE.Group;
  leftPage: THREE.Mesh;
  rightPage: THREE.Mesh;
  baseY: number;
  bobSpeed: number;
  bobOffset: number;
  rotSpeed: number;
}

export default function DigitalLibraryScene({
  onEnterPortfolio,
  onSkipImmediately,
}: DigitalLibrarySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const darkShroudRef = useRef<HTMLDivElement>(null);
  const topLeftRef = useRef<HTMLDivElement>(null);
  const centerPortalRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // References for render loop & GSAP tweens
  const sceneState = useRef<{
    camera: THREE.PerspectiveCamera | null;
    lookTarget: THREE.Vector3;
    baseCameraZ: number;
    bookGroup: THREE.Group | null;
    leftWing: THREE.Group | null;
    rightWing: THREE.Group | null;
    flutterLeaves: THREE.Mesh[];
    bookGlow: THREE.PointLight | null;
    chandelier: THREE.PointLight | null;
    deskLamp: THREE.PointLight | null;
    candleLight: THREE.PointLight | null;
    ambientLight: THREE.HemisphereLight | null;
    haloMesh: THREE.Mesh | null;
    particlesMat: THREE.PointsMaterial | null;
    particlesGeo: THREE.BufferGeometry | null;
    flyingBooks: FlyingBook[];
    particleCount: number;
    particlePositions: Float32Array | null;
    particleSpeeds: Float32Array | null;
    isHovered: boolean;
    isEntering: boolean;
    mouseNorm: { x: number; y: number };
  }>({
    camera: null,
    lookTarget: new THREE.Vector3(0.1, 2.7, -1.0),
    baseCameraZ: 9.8,
    bookGroup: null,
    leftWing: null,
    rightWing: null,
    flutterLeaves: [],
    bookGlow: null,
    chandelier: null,
    deskLamp: null,
    candleLight: null,
    ambientLight: null,
    haloMesh: null,
    particlesMat: null,
    particlesGeo: null,
    flyingBooks: [],
    particleCount: 420,
    particlePositions: null,
    particleSpeeds: null,
    isHovered: false,
    isEntering: false,
    mouseNorm: { x: 0, y: 0 },
  });

  useEffect(() => {
    sceneState.current.isHovered = isHovered;
  }, [isHovered]);

  // --- HOVER ANIMATION (Section C) ---
  const handleHoverChange = useCallback((hovered: boolean) => {
    if (sceneState.current.isEntering) return;
    setIsHovered(hovered);
    const { camera, leftWing, rightWing, flutterLeaves, bookGlow, haloMesh } = sceneState.current;
    if (!camera || !leftWing || !rightWing || !bookGlow) return;

    if (hovered) {
      // 1. Camera slowly moves closer
      gsap.to(camera.position, {
        z: 8.35,
        duration: 1.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // 2. Book's pages begin moving gently (fluttering)
      gsap.to(leftWing.rotation, {
        y: -0.38,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        overwrite: 'auto',
      });
      gsap.to(rightWing.rotation, {
        y: 0.38,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        overwrite: 'auto',
      });

      flutterLeaves.forEach((leaf, idx) => {
        gsap.to(leaf.rotation, {
          y: (idx % 2 === 0 ? -1 : 1) * (0.2 + idx * 0.08),
          duration: 0.35 + idx * 0.09,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          overwrite: 'auto',
        });
      });

      // 3. Golden light swells & halo intensifies
      gsap.to(bookGlow, {
        intensity: 290,
        distance: 11,
        duration: 0.9,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      if (haloMesh) {
        gsap.to((haloMesh.material as THREE.MeshBasicMaterial), {
          opacity: 0.85,
          duration: 0.8,
          overwrite: 'auto',
        });
      }
    } else {
      // Reset back to baseline overview
      gsap.to(camera.position, {
        z: sceneState.current.baseCameraZ,
        duration: 1.6,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });

      gsap.to(leftWing.rotation, {
        y: -0.22,
        duration: 1.0,
        repeat: 0,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(rightWing.rotation, {
        y: 0.22,
        duration: 1.0,
        repeat: 0,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      flutterLeaves.forEach((leaf) => {
        gsap.to(leaf.rotation, {
          y: 0,
          duration: 0.8,
          repeat: 0,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });

      gsap.to(bookGlow, {
        intensity: 195,
        distance: 8.5,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      if (haloMesh) {
        gsap.to((haloMesh.material as THREE.MeshBasicMaterial), {
          opacity: 0.45,
          duration: 1.0,
          overwrite: 'auto',
        });
      }
    }
  }, []);

  // --- CLICK ENTER INTERACTION (Section C & E - 2.4s Sequence) ---
  const handleEnterClick = useCallback(() => {
    if (sceneState.current.isEntering) return;
    setIsEntering(true);
    sceneState.current.isEntering = true;

    // Soft classical chord activation
    libraryAudio.playPianoChord(1);

    const { camera, lookTarget, leftWing, rightWing, flutterLeaves, bookGlow } = sceneState.current;
    if (!camera || !leftWing || !rightWing || !bookGlow) {
      onEnterPortfolio();
      return;
    }

    const enterTl = gsap.timeline({
      onComplete: () => {
        onEnterPortfolio();
      },
    });

    // 1. The book opens completely flat
    enterTl.to(
      leftWing.rotation,
      {
        y: -1.52,
        duration: 1.8,
        ease: 'power3.inOut',
      },
      0
    );
    enterTl.to(
      rightWing.rotation,
      {
        y: 1.52,
        duration: 1.8,
        ease: 'power3.inOut',
      },
      0
    );

    flutterLeaves.forEach((leaf, idx) => {
      enterTl.to(
        leaf.rotation,
        {
          y: (idx % 2 === 0 ? -1.35 : 1.35),
          duration: 1.6 + idx * 0.1,
          ease: 'power2.inOut',
        },
        0
      );
    });

    // 2. Golden light expands across the entire screen
    enterTl.to(
      bookGlow,
      {
        intensity: 950,
        distance: 28,
        duration: 2.2,
        ease: 'power2.in',
      },
      0
    );

    // 3. Camera moves towards the glowing book into the light
    enterTl.to(
      camera.position,
      {
        x: 0.1,
        y: 2.75,
        z: -0.85,
        duration: 2.4,
        ease: 'power4.in',
      },
      0
    );

    enterTl.to(
      lookTarget,
      {
        x: 0.1,
        y: 2.75,
        z: -2.5,
        duration: 2.4,
        ease: 'power4.in',
      },
      0
    );
  }, [onEnterPortfolio]);

  // --- THREE.JS INITIALIZATION & TIMELINE E ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0705');
    scene.fog = new THREE.FogExp2('#0c0806', 0.038);

    const getViewportSize = () => {
      const w = container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1280);
      const h = container.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);
      return { width: Math.max(w, 320), height: Math.max(h, 400) };
    };

    const initialSize = getViewportSize();

    const camera = new THREE.PerspectiveCamera(
      45,
      initialSize.width / initialSize.height,
      0.1,
      80
    );
    // Start at entryway threshold in darkness
    camera.position.set(0, 3.1, reducedMotion ? 9.8 : 13.0);
    sceneState.current.camera = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL init failed', e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(initialSize.width, initialSize.height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const box = (
      parent: THREE.Object3D,
      pos: [number, number, number],
      size: [number, number, number],
      mat: THREE.Material
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
      mesh.position.set(...pos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    // Materials
    const darkWood = new THREE.MeshStandardMaterial({ color: '#24140b', roughness: 0.65, metalness: 0.12 });
    const polishedWood = new THREE.MeshStandardMaterial({ color: '#381e10', roughness: 0.28, metalness: 0.22 });
    const antiqueGold = new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.32, metalness: 0.85 });
    const warmStone = new THREE.MeshStandardMaterial({ color: '#1a1614', roughness: 0.92 });

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 28),
      new THREE.MeshStandardMaterial({ color: '#28170c', roughness: 0.24, metalness: 0.25 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    for (let z = -12; z <= 12; z += 0.8) {
      box(scene, [0, 0.005, z], [24, 0.008, 0.02], darkWood);
    }

    // Walls & Beams
    box(scene, [0, 5.5, -9.0], [22, 11, 0.4], warmStone);
    box(scene, [-9.5, 5.5, 0], [0.4, 11, 24], warmStone);
    box(scene, [9.5, 5.5, 0], [0.4, 11, 24], warmStone);
    for (let z = -8; z <= 10; z += 3.2) {
      box(scene, [0, 9.8, z], [19.2, 0.6, 0.5], darkWood);
    }

    // Bookshelves
    const bookColors = ['#5a1818', '#1a3826', '#875d27', '#3d2516', '#141414', '#9e734a', '#22384a'];
    const buildShelf = (x: number, z: number, rotY: number, width: number, tiers: number) => {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.rotation.y = rotY;
      scene.add(g);
      const h = tiers * 1.35;
      box(g, [0, h / 2, 0], [width, h, 0.2], darkWood);
      box(g, [-width / 2 + 0.1, h / 2, 0.22], [0.24, h, 0.44], polishedWood);
      box(g, [width / 2 - 0.1, h / 2, 0.22], [0.24, h, 0.44], polishedWood);
      box(g, [0, h + 0.15, 0.26], [width + 0.3, 0.3, 0.52], polishedWood);

      for (let t = 0; t <= tiers; t++) {
        const sy = t * 1.35 + 0.1;
        box(g, [0, sy, 0.24], [width + 0.1, 0.1, 0.5], polishedWood);
        if (t === tiers) continue;

        let curX = -width / 2 + 0.26;
        while (curX < width / 2 - 0.35) {
          const bw = 0.12 + Math.random() * 0.12;
          const bh = 0.72 + Math.random() * 0.45;
          const bm = new THREE.MeshStandardMaterial({
            color: bookColors[Math.floor(Math.random() * bookColors.length)],
            roughness: 0.75,
          });
          const bk = box(g, [curX + bw / 2, sy + bh / 2 + 0.05, 0.32], [bw, bh, 0.32], bm);
          bk.rotation.z = (Math.random() - 0.5) * 0.08;
          curX += bw + 0.03;
        }
      }
    };

    buildShelf(-5.6, -8.5, 0, 5.5, 6);
    buildShelf(5.6, -8.5, 0, 5.5, 6);
    buildShelf(-9.0, -3.2, Math.PI / 2, 6.2, 6);
    buildShelf(-9.0, 3.8, Math.PI / 2, 6.2, 6);
    buildShelf(9.0, -3.2, -Math.PI / 2, 6.2, 6);
    buildShelf(9.0, 3.8, -Math.PI / 2, 6.2, 6);

    // Grand Staircase
    const stair = new THREE.Group();
    stair.position.set(-6.8, 0, -4.2);
    scene.add(stair);
    for (let step = 0; step < 16; step++) {
      const sy = step * 0.26;
      const sz = -step * 0.35;
      const sx = Math.sin(step * 0.12) * 0.6;
      box(stair, [sx, sy + 0.13, sz], [2.6, 0.26, 0.48], polishedWood);
      box(stair, [sx + 1.2, sy + 0.6, sz], [0.07, 0.8, 0.07], antiqueGold);
    }
    box(scene, [-6.8, 4.2, -8.0], [5.0, 0.3, 3.0], darkWood);

    // Central Desk
    const desk = new THREE.Group();
    desk.position.set(0, 0, 0.6);
    scene.add(desk);
    box(desk, [0, 1.4, 0], [4.4, 0.18, 2.2], polishedWood);
    box(desk, [0, 1.495, 0], [3.8, 0.015, 1.7], new THREE.MeshStandardMaterial({ color: '#1a3022', roughness: 0.5 }));
    [-1.7, 1.7].forEach((px) => {
      box(desk, [px, 0.7, 0], [0.85, 1.25, 1.9], darkWood);
    });

    // Banker's lamp (initially off for 0-1s, fades up at 1-3s)
    box(desk, [-1.2, 1.55, -0.4], [0.22, 0.08, 0.22], antiqueGold);
    box(desk, [-1.2, 1.85, -0.4], [0.06, 0.55, 0.06], antiqueGold);
    box(desk, [-1.2, 2.15, -0.4], [0.46, 0.16, 0.26], new THREE.MeshStandardMaterial({
      color: '#0e4a2c',
      roughness: 0.2,
      emissive: '#13703c',
      emissiveIntensity: 0.4,
    }));
    const deskLamp = new THREE.PointLight('#ffd685', reducedMotion ? 45 : 0, 6, 2);
    deskLamp.position.set(-1.2, 2.05, -0.4);
    desk.add(deskLamp);
    sceneState.current.deskLamp = deskLamp;

    // Candle (initially off for 0-1s, fades up at 1-3s)
    box(desk, [1.3, 1.54, 0.3], [0.18, 0.1, 0.18], antiqueGold);
    box(desk, [1.3, 1.8, 0.3], [0.07, 0.45, 0.07], new THREE.MeshStandardMaterial({ color: '#eee2cb' }));
    const candleFlame = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.15, 8), new THREE.MeshBasicMaterial({ color: '#ffb338' }));
    candleFlame.position.set(1.3, 2.1, 0.3);
    desk.add(candleFlame);
    const candleLight = new THREE.PointLight('#ff9d26', reducedMotion ? 28 : 0, 4.5, 2);
    candleLight.position.set(1.3, 2.15, 0.3);
    desk.add(candleLight);
    sceneState.current.candleLight = candleLight;

    // Piano
    const piano = new THREE.Group();
    piano.position.set(4.4, 0, 0.4);
    piano.rotation.y = -0.35;
    scene.add(piano);
    const pianoBlack = new THREE.MeshStandardMaterial({ color: '#0d0c0b', roughness: 0.15, metalness: 0.25 });
    box(piano, [0, 1.1, 0], [2.8, 0.35, 1.6], pianoBlack);
    box(piano, [0.3, 1.38, -0.2], [2.3, 0.22, 1.25], pianoBlack);
    box(piano, [0.35, 1.48, -0.2], [2.1, 0.03, 1.15], antiqueGold);
    const lid = box(piano, [0.2, 2.05, -0.25], [2.2, 0.05, 1.25], pianoBlack);
    lid.rotation.z = -0.42;

    // --- CENTRAL FLOATING BOOK ---
    const bookGroup = new THREE.Group();
    bookGroup.position.set(0.1, 2.75, -1.0);
    scene.add(bookGroup);
    sceneState.current.bookGroup = bookGroup;

    const pageMat = new THREE.MeshStandardMaterial({
      color: '#fff2d6',
      emissive: '#d69738',
      emissiveIntensity: 0.52,
      roughness: 0.72,
      side: THREE.DoubleSide,
    });
    const leatherMat = new THREE.MeshStandardMaterial({ color: '#45200f', roughness: 0.5 });

    const leftWing = new THREE.Group();
    leftWing.position.set(-0.06, 0, 0);
    leftWing.rotation.y = -0.22;
    bookGroup.add(leftWing);
    sceneState.current.leftWing = leftWing;

    const leftLeaf = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.9, 6, 6), pageMat);
    leftLeaf.position.x = -0.7;
    leftWing.add(leftLeaf);
    const leftCover = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.95), leatherMat);
    leftCover.position.set(-0.725, 0, -0.015);
    leftWing.add(leftCover);

    const rightWing = new THREE.Group();
    rightWing.position.set(0.06, 0, 0);
    rightWing.rotation.y = 0.22;
    bookGroup.add(rightWing);
    sceneState.current.rightWing = rightWing;

    const rightLeaf = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.9, 6, 6), pageMat);
    rightLeaf.position.x = 0.7;
    rightWing.add(rightLeaf);
    const rightCover = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.95), leatherMat);
    rightCover.position.set(0.725, 0, -0.015);
    rightWing.add(rightCover);

    for (let l = 0; l < 8; l++) {
      const textLineMat = new THREE.MeshBasicMaterial({ color: '#7a4f25', transparent: true, opacity: 0.75 });
      const lineLeft = box(leftWing, [-0.7, 0.6 - l * 0.16, 0.01], [0.85 - (l % 3) * 0.08, 0.012, 0.005], textLineMat);
      const lineRight = box(rightWing, [0.7, 0.6 - l * 0.16, 0.01], [0.85 - (l % 3) * 0.08, 0.012, 0.005], textLineMat);
      lineLeft.castShadow = false;
      lineRight.castShadow = false;
    }

    const flutterLeaves: THREE.Mesh[] = [];
    const interiorPageMat = new THREE.MeshStandardMaterial({
      color: '#fffaed',
      emissive: '#d69738',
      emissiveIntensity: 0.38,
      roughness: 0.68,
      side: THREE.DoubleSide,
    });
    for (let f = 0; f < 3; f++) {
      const flutterLeaf = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 1.86), interiorPageMat);
      flutterLeaf.position.set(0, 0, 0.01 + f * 0.008);
      bookGroup.add(flutterLeaf);
      flutterLeaves.push(flutterLeaf);
    }
    sceneState.current.flutterLeaves = flutterLeaves;
    box(bookGroup, [0, 0, -0.05], [0.16, 1.96, 0.16], leatherMat);

    // Internal golden book light (ignites at 3-4s)
    const bookGlow = new THREE.PointLight('#ffbb4d', reducedMotion ? 195 : 0, 8.5, 1.7);
    bookGlow.position.set(0, 0.35, 0.85);
    bookGroup.add(bookGlow);
    sceneState.current.bookGlow = bookGlow;

    // Glowing halo ring
    const haloGeo = new THREE.RingGeometry(1.35, 1.39, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: '#f5c871',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: reducedMotion ? 0.45 : 0,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2.3;
    bookGroup.add(haloMesh);
    sceneState.current.haloMesh = haloMesh;

    // Satellite flying books
    const flyingBooks: FlyingBook[] = [];
    const flyingSpreads = [
      { pos: [-2.8, 4.8, -2.5], scale: 0.48, rot: 0.35 },
      { pos: [3.2, 5.2, -3.2], scale: 0.52, rot: -0.25 },
      { pos: [-3.8, 3.4, 1.8], scale: 0.44, rot: 0.45 },
      { pos: [2.9, 3.6, 2.2], scale: 0.46, rot: -0.5 },
      { pos: [-1.4, 6.2, -4.8], scale: 0.38, rot: 0.15 },
      { pos: [1.8, 6.5, -5.2], scale: 0.42, rot: -0.3 },
    ];

    flyingSpreads.forEach((item, idx) => {
      const fbGroup = new THREE.Group();
      fbGroup.position.set(item.pos[0], item.pos[1], item.pos[2]);
      fbGroup.scale.setScalar(item.scale);
      fbGroup.rotation.y = item.rot;
      fbGroup.rotation.z = (Math.random() - 0.5) * 0.2;
      scene.add(fbGroup);

      const fMat = new THREE.MeshStandardMaterial({
        color: '#fdf6e2',
        emissive: '#d69738',
        emissiveIntensity: 0.35,
        roughness: 0.8,
        side: THREE.DoubleSide,
      });

      const lp = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.5), fMat);
      lp.position.x = -0.55;
      lp.rotation.y = -0.25;
      fbGroup.add(lp);

      const rp = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.5), fMat);
      rp.position.x = 0.55;
      rp.rotation.y = 0.25;
      fbGroup.add(rp);

      flyingBooks.push({
        group: fbGroup,
        leftPage: lp,
        rightPage: rp,
        baseY: item.pos[1],
        bobSpeed: 1.2 + idx * 0.25,
        bobOffset: idx * 1.1,
        rotSpeed: 0.15 + idx * 0.08,
      });
    });
    sceneState.current.flyingBooks = flyingBooks;

    // Gothic windows
    const makeWindow = (wx: number) => {
      const wg = new THREE.Group();
      wg.position.set(wx, 5.0, -8.7);
      scene.add(wg);
      const glass = new THREE.Mesh(
        new THREE.PlaneGeometry(2.8, 6.2),
        new THREE.MeshBasicMaterial({ color: '#152438', transparent: true, opacity: 0.88 })
      );
      wg.add(glass);
      box(wg, [-1.4, 0, 0.05], [0.18, 6.2, 0.18], darkWood);
      box(wg, [1.4, 0, 0.05], [0.18, 6.2, 0.18], darkWood);
      box(wg, [0, 0, 0.05], [0.08, 6.2, 0.14], darkWood);
      box(wg, [0, 0.8, 0.05], [2.8, 0.08, 0.14], darkWood);
      if (wx > 0) {
        const moon = new THREE.Mesh(new THREE.CircleGeometry(0.48, 32), new THREE.MeshBasicMaterial({ color: '#eaf4fc' }));
        moon.position.set(0.65, 1.8, -0.05);
        wg.add(moon);
      }
    };
    makeWindow(-3.2);
    makeWindow(3.2);

    // Volumetric Beam
    const beamMat = new THREE.MeshBasicMaterial({
      color: '#ffc875',
      transparent: true,
      opacity: 0.038,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const centerBeam = new THREE.Mesh(new THREE.ConeGeometry(2.4, 9, 32, 1, true), beamMat);
    centerBeam.position.set(0.1, 5.8, -1.0);
    centerBeam.rotation.x = Math.PI;
    scene.add(centerBeam);

    // Floating Dust Particles & Golden Embers (appear at 3-4s)
    const particleCount = 420;
    sceneState.current.particleCount = particleCount;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = Math.random() * 8 + 0.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      particleSpeeds[i] = 0.0018 + Math.random() * 0.003;
    }
    sceneState.current.particlePositions = particlePositions;
    sceneState.current.particleSpeeds = particleSpeeds;

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    sceneState.current.particlesGeo = particlesGeo;

    const particlesMat = new THREE.PointsMaterial({
      color: '#fed894',
      size: 0.04,
      transparent: true,
      opacity: reducedMotion ? 0.85 : 0,
      sizeAttenuation: true,
    });
    sceneState.current.particlesMat = particlesMat;
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Ambient Lights & Chandelier
    const chandelier = new THREE.PointLight('#ffa84d', reducedMotion ? 90 : 0, 18, 1.8);
    chandelier.position.set(0, 7.8, 2.5);
    chandelier.castShadow = true;
    scene.add(chandelier);
    sceneState.current.chandelier = chandelier;

    const ambientLight = new THREE.HemisphereLight('#687d94', '#22140a', reducedMotion ? 0.65 : 0.08);
    scene.add(ambientLight);
    sceneState.current.ambientLight = ambientLight;

    // =========================================================================
    // SECTION E: THE ENTRANCE ANIMATION TIMELINE (0 to 5 seconds)
    // =========================================================================
    const introTl = gsap.timeline();

    if (!reducedMotion) {
      // 0–1 sec: Dark screen fades in
      if (darkShroudRef.current) {
        introTl.to(
          darkShroudRef.current,
          {
            opacity: 0,
            duration: 1.0,
            ease: 'power2.inOut',
          },
          0
        );
      }

      // 1–3 sec: Library lighting gradually appears
      introTl.to(
        chandelier,
        {
          intensity: 95,
          duration: 2.0,
          ease: 'power2.out',
        },
        1.0
      );
      introTl.to(
        deskLamp,
        {
          intensity: 45,
          duration: 1.8,
          ease: 'power2.out',
        },
        1.2
      );
      introTl.to(
        candleLight,
        {
          intensity: 28,
          duration: 1.6,
          ease: 'power2.out',
        },
        1.4
      );
      introTl.to(
        ambientLight,
        {
          intensity: 0.65,
          duration: 2.0,
          ease: 'power2.out',
        },
        1.0
      );
      introTl.to(
        camera.position,
        {
          z: 9.8,
          duration: 3.8,
          ease: 'power3.out',
        },
        1.0
      );

      // 3–4 sec: Floating particles and glowing book appear
      introTl.to(
        particlesMat,
        {
          opacity: 0.85,
          duration: 1.0,
          ease: 'sine.inOut',
        },
        3.0
      );
      introTl.to(
        bookGlow,
        {
          intensity: 195,
          duration: 1.0,
          ease: 'power2.out',
        },
        3.0
      );
      introTl.to(
        haloMat,
        {
          opacity: 0.45,
          duration: 1.0,
          ease: 'sine.inOut',
        },
        3.0
      );

      // 4–5 sec: Your name and Enter button reveal
      if (topLeftRef.current) {
        introTl.fromTo(
          topLeftRef.current,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
          4.0
        );
      }
      if (centerPortalRef.current) {
        introTl.fromTo(
          centerPortalRef.current,
          { opacity: 0, y: 24, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out' },
          4.1
        );
      }
    } else {
      // Immediate presentation for prefers-reduced-motion
      if (darkShroudRef.current) darkShroudRef.current.style.opacity = '0';
      if (topLeftRef.current) topLeftRef.current.style.opacity = '1';
      if (centerPortalRef.current) centerPortalRef.current.style.opacity = '1';
    }

    // Gentle continuous levitation
    gsap.to(bookGroup.position, {
      y: 2.92,
      duration: 3.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
    gsap.to(bookGroup.rotation, {
      y: 0.065,
      duration: 5.0,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    // Candle flame organic flicker
    gsap.to(candleLight, {
      intensity: 38,
      duration: 0.18,
      repeat: -1,
      yoyo: true,
      ease: 'rough({template: none.out, strength: 1, points: 20, taper: none, randomize: true})',
    });

    // Mouse parallax tracking
    const handleMouseMove = (e: MouseEvent) => {
      sceneState.current.mouseNorm.x = (e.clientX / window.innerWidth - 0.5) * 2;
      sceneState.current.mouseNorm.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const size = getViewportSize();
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height);
    };
    window.addEventListener('resize', handleResize);
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // --- ANIMATION / RENDER LOOP ---
    let reqId = 0;
    let clock = 0;

    const animate = () => {
      clock += 0.016;

      const mx = sceneState.current.mouseNorm.x * 0.4;
      const my = sceneState.current.mouseNorm.y * 0.25;
      camera.lookAt(
        sceneState.current.lookTarget.x + mx * 0.25,
        sceneState.current.lookTarget.y - my * 0.2,
        sceneState.current.lookTarget.z
      );

      if (haloMesh) haloMesh.rotation.z = clock * 0.35;

      // Animate flying books
      flyingBooks.forEach((fb) => {
        fb.group.position.y = fb.baseY + Math.sin(clock * fb.bobSpeed + fb.bobOffset) * 0.22;
        fb.group.rotation.y += 0.0012;
        const flap = Math.sin(clock * 4.2 + fb.bobOffset) * 0.18;
        fb.leftPage.rotation.y = -0.25 - flap;
        fb.rightPage.rotation.y = 0.25 + flap;
      });

      // Particle physics & golden particle attraction (On Hover)
      if (particlesGeo && particlePositions && particleSpeeds) {
        const pos = particlesGeo.attributes.position as THREE.BufferAttribute;
        const hovered = sceneState.current.isHovered;
        const targetX = 0.1;
        const targetY = 2.75;
        const targetZ = -1.0;

        for (let i = 0; i < particleCount; i++) {
          const xi = i * 3;
          const yi = i * 3 + 1;
          const zi = i * 3 + 2;

          if (hovered) {
            const dx = targetX - pos.array[xi];
            const dy = targetY - pos.array[yi];
            const dz = targetZ - pos.array[zi];
            pos.array[xi] += dx * 0.035 + Math.sin(clock * 4 + i) * 0.012;
            pos.array[yi] += dy * 0.035;
            pos.array[zi] += dz * 0.035 + Math.cos(clock * 4 + i) * 0.012;
          } else {
            pos.array[yi] += particleSpeeds[i];
            pos.array[xi] += Math.sin(clock + i) * 0.0007;
            if (pos.array[yi] > 8.0) {
              pos.array[yi] = 0.2;
              pos.array[xi] = (Math.random() - 0.5) * 16;
              pos.array[zi] = (Math.random() - 0.5) * 18;
            }
          }
        }
        pos.needsUpdate = true;
      }

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      ro.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      introTl.kill();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  const toggleSound = () => {
    const active = libraryAudio.toggleAtmosphere();
    setIsPlayingAudio(active);
  };

  return (
    <div className={`digital-library-entrance-wrapper ${isEntering ? 'is-entering-mode' : ''}`}>
      {/* 3D Canvas */}
      <div ref={containerRef} className="digital-library-canvas" />

      {/* 0–1 sec: Dark screen shroud that fades in */}
      <div ref={darkShroudRef} className="entrance-dark-shroud" aria-hidden="true" />

      {/* Fullscreen Golden Bloom Veil (expands when clicked) */}
      <div className={`golden-light-veil ${isEntering ? 'is-flaring' : ''}`} aria-hidden="true" />

      {/* =========================================================================
          SECTION B & E: THREE VISUAL AREAS & TIMELINE REVEALS
          ========================================================================= */}

      {/* 1. TOP LEFT: Personal Identity (reveals at 4–5s) */}
      <div ref={topLeftRef} className="entrance-top-left entrance-reveal-init">
        <h2 className="identity-name">SOLOMON MWANGI</h2>
        <p className="identity-title">SOFTWARE ENGINEER · CREATIVE DEVELOPER</p>
      </div>

      {/* Unobtrusive Ambient Study Audio in Top Right */}
      <div className="entrance-top-right">
        <button
          type="button"
          onClick={toggleSound}
          className={`ambient-audio-pill ${isPlayingAudio ? 'is-active' : ''}`}
          aria-label="Toggle study rain and fireplace sound"
        >
          <span className="sound-pulse" aria-hidden="true">
            <i /><i /><i />
          </span>
          <span>{isPlayingAudio ? 'Rain & Hearth : ON' : 'Study Ambience ♫'}</span>
        </button>
      </div>

      {/* 2. CENTRE OF THE SCENE: Enter The Archive & Glowing Control (reveals at 4–5s) */}
      <div ref={centerPortalRef} className="entrance-center-portal entrance-reveal-init">
        <h1 className="archive-headline">ENTER THE ARCHIVE</h1>
        <p className="archive-subline">A collection of ideas, engineering and creativity.</p>

        {/* Glowing Golden Entrance Control */}
        <button
          type="button"
          className={`glowing-portal-control ${isHovered ? 'is-hovered' : ''} ${isEntering ? 'is-entering' : ''}`}
          onMouseEnter={() => handleHoverChange(true)}
          onMouseLeave={() => handleHoverChange(false)}
          onClick={handleEnterClick}
          disabled={isEntering}
          aria-label="Enter the digital library and explore portfolio"
        >
          <span className="portal-aura" aria-hidden="true" />
          <span className="portal-frame" aria-hidden="true" />
          <span className="portal-label">
            {isEntering ? 'ENTERING THE ARCHIVE...' : isHovered ? 'OPENING THE ARCHIVE...' : 'ENTER LIBRARY ↗'}
          </span>
        </button>
      </div>

      {/* =========================================================================
          SECTION D: THE SKIP INTRO BUTTON (Immediately visible, never hidden)
          ========================================================================= */}
      <div className="entrance-bottom-right">
        <button
          type="button"
          onClick={onSkipImmediately}
          className="skip-intro-text-btn"
          aria-label="Skip introduction and proceed immediately to portfolio"
        >
          <span>Skip Intro</span>
          <span className="skip-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
