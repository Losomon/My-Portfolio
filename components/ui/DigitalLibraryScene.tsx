'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { libraryAudio } from '@/lib/ambientAudio';

export interface POI {
  id: 'overview' | 'book' | 'piano' | 'desk' | 'window';
  title: string;
  description: string;
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
}

const POIS: Record<string, POI> = {
  overview: {
    id: 'overview',
    title: 'The Great Reading Hall',
    description: 'Towering shelves of preserved wisdom, illuminated by candle flames and moonbeams.',
    cameraPos: [0, 2.7, 9.8],
    lookAt: [0, 2.2, -1.5],
  },
  book: {
    id: 'book',
    title: 'The Floating Codex',
    description: 'An ancient illuminated tome hovering in mid-air, radiating thoughts transformed into light.',
    cameraPos: [0.1, 2.7, 1.8],
    lookAt: [0.1, 2.8, -1.0],
  },
  piano: {
    id: 'piano',
    title: 'The Midnight Grand Piano',
    description: 'A polished concert grand echoing with forgotten nocturnes and resonance.',
    cameraPos: [2.6, 2.1, 2.2],
    lookAt: [4.2, 1.3, -0.2],
  },
  desk: {
    id: 'desk',
    title: "The Scholar's Desk",
    description: 'Carved mahogany, inkwells, brass instruments, and drafts of digital architecture.',
    cameraPos: [-0.9, 2.1, 2.4],
    lookAt: [0, 1.4, 0.4],
  },
  window: {
    id: 'window',
    title: 'The Gothic Moonlit Arch',
    description: 'Looking out past stone tracery into the misty midnight expanse and distant stars.',
    cameraPos: [0, 3.2, 3.8],
    lookAt: [0, 4.3, -8.2],
  },
};

interface DigitalLibrarySceneProps {
  onEnterPortfolio: () => void;
  activePoi: POI['id'];
  setActivePoi: (poi: POI['id']) => void;
}

export default function DigitalLibraryScene({
  onEnterPortfolio,
  activePoi,
  setActivePoi,
}: DigitalLibrarySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // References to keep GSAP targets accessible
  const sceneState = useRef<{
    camera: THREE.PerspectiveCamera | null;
    lookTarget: THREE.Vector3;
    bookGroup: THREE.Group | null;
    bookGlow: THREE.PointLight | null;
    candleLight: THREE.PointLight | null;
    windowMoonlight: THREE.SpotLight | null;
    pianoKeys: THREE.Mesh[];
    particlesGeometry: THREE.BufferGeometry | null;
    particleCount: number;
    timeline: gsap.core.Timeline | null;
    mouseNorm: { x: number; y: number };
  }>({
    camera: null,
    lookTarget: new THREE.Vector3(0, 2.2, -1.5),
    bookGroup: null,
    bookGlow: null,
    candleLight: null,
    windowMoonlight: null,
    pianoKeys: [],
    particlesGeometry: null,
    particleCount: 350,
    timeline: null,
    mouseNorm: { x: 0, y: 0 },
  });

  // Switch camera to designated Point of Interest with GSAP
  const navigateToPoi = useCallback(
    (poiId: POI['id']) => {
      setActivePoi(poiId);
      const targetPoi = POIS[poiId];
      if (!targetPoi || !sceneState.current.camera) return;

      const { camera, lookTarget, pianoKeys } = sceneState.current;

      // Play contextual interaction sounds
      if (poiId === 'piano') {
        libraryAudio.playPianoChord(Math.floor(Math.random() * 3));
        // Animate piano keys depression
        pianoKeys.forEach((key, idx) => {
          gsap.to(key.position, {
            y: key.position.y - 0.03,
            duration: 0.12,
            delay: idx * 0.04,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut',
          });
        });
      }

      gsap.to(camera.position, {
        x: targetPoi.cameraPos[0],
        y: targetPoi.cameraPos[1],
        z: targetPoi.cameraPos[2],
        duration: 2.2,
        ease: 'power3.inOut',
      });

      gsap.to(lookTarget, {
        x: targetPoi.lookAt[0],
        y: targetPoi.lookAt[1],
        z: targetPoi.lookAt[2],
        duration: 2.2,
        ease: 'power3.inOut',
      });
    },
    [setActivePoi]
  );

  // Cinematic GSAP dive into book when exiting to main portfolio
  const handleExitTransition = useCallback(() => {
    const { camera, lookTarget, bookGlow } = sceneState.current;
    if (!camera) {
      onEnterPortfolio();
      return;
    }

    const exitTl = gsap.timeline({
      onComplete: () => {
        onEnterPortfolio();
      },
    });

    // Zoom rapidly into the glowing book portal
    exitTl.to(camera.position, {
      x: 0.1,
      y: 2.8,
      z: -0.85,
      duration: 1.8,
      ease: 'power4.in',
    });

    exitTl.to(
      lookTarget,
      {
        x: 0.1,
        y: 2.8,
        z: -2.0,
        duration: 1.8,
        ease: 'power4.in',
      },
      0
    );

    if (bookGlow) {
      exitTl.to(
        bookGlow,
        {
          intensity: 650,
          duration: 1.6,
          ease: 'power2.in',
        },
        0.2
      );
    }
  }, [onEnterPortfolio]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0705');
    scene.fog = new THREE.FogExp2('#0c0806', 0.038);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      80
    );
    // Start camera far back at the entrance threshold
    camera.position.set(0, 3.2, 13.5);
    sceneState.current.camera = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL initialization failed', e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- MATERIALS (Dark Academia Palette) ---
    const darkWood = new THREE.MeshStandardMaterial({
      color: '#24140b',
      roughness: 0.65,
      metalness: 0.12,
    });
    const polishedWood = new THREE.MeshStandardMaterial({
      color: '#381e10',
      roughness: 0.28,
      metalness: 0.22,
    });
    const antiqueGold = new THREE.MeshStandardMaterial({
      color: '#d4af37',
      roughness: 0.32,
      metalness: 0.85,
    });
    const warmStone = new THREE.MeshStandardMaterial({
      color: '#1a1614',
      roughness: 0.92,
    });

    const helperBox = (
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

    // --- POLISHED WOOD FLOOR ---
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 28),
      new THREE.MeshStandardMaterial({
        color: '#28170c',
        roughness: 0.24,
        metalness: 0.25,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Parquet board grooves
    for (let z = -12; z <= 12; z += 0.8) {
      helperBox(scene, [0, 0.005, z], [24, 0.008, 0.02], darkWood);
    }

    // --- ROOM BOUNDARIES ---
    // Back wall
    helperBox(scene, [0, 5.5, -9.0], [22, 11, 0.4], warmStone);
    // Left & Right walls
    helperBox(scene, [-9.5, 5.5, 0], [0.4, 11, 24], warmStone);
    helperBox(scene, [9.5, 5.5, 0], [0.4, 11, 24], warmStone);
    // Ceiling beams
    for (let z = -8; z <= 10; z += 3.2) {
      helperBox(scene, [0, 9.8, z], [19.2, 0.6, 0.5], darkWood);
    }

    // --- TALL BOOKSHELVES ---
    const bookColors = ['#5a1818', '#1a3826', '#875d27', '#3d2516', '#141414', '#9e734a', '#22384a'];
    const createGrandBookshelf = (x: number, z: number, rotY: number, width: number, tiers: number) => {
      const shelfGroup = new THREE.Group();
      shelfGroup.position.set(x, 0, z);
      shelfGroup.rotation.y = rotY;
      scene.add(shelfGroup);

      const height = tiers * 1.35;
      // Back panel
      helperBox(shelfGroup, [0, height / 2, 0], [width, height, 0.2], darkWood);
      // Side pillars
      helperBox(shelfGroup, [-width / 2 + 0.1, height / 2, 0.22], [0.24, height, 0.44], polishedWood);
      helperBox(shelfGroup, [width / 2 - 0.1, height / 2, 0.22], [0.24, height, 0.44], polishedWood);
      // Ornate top pediment
      helperBox(shelfGroup, [0, height + 0.15, 0.26], [width + 0.3, 0.3, 0.52], polishedWood);

      // Shelves & Books
      for (let t = 0; t <= tiers; t++) {
        const shelfY = t * 1.35 + 0.1;
        helperBox(shelfGroup, [0, shelfY, 0.24], [width + 0.1, 0.1, 0.5], polishedWood);

        if (t === tiers) continue;

        let curX = -width / 2 + 0.26;
        while (curX < width / 2 - 0.35) {
          const bWidth = 0.12 + Math.random() * 0.12;
          const bHeight = 0.72 + Math.random() * 0.45;
          const bColor = bookColors[Math.floor(Math.random() * bookColors.length)];
          const bMat = new THREE.MeshStandardMaterial({ color: bColor, roughness: 0.75 });
          const bookMesh = helperBox(
            shelfGroup,
            [curX + bWidth / 2, shelfY + bHeight / 2 + 0.05, 0.32],
            [bWidth, bHeight, 0.32],
            bMat
          );
          bookMesh.rotation.z = (Math.random() - 0.5) * 0.08;

          // Gold spine ribbon on some books
          if (Math.random() > 0.6) {
            helperBox(shelfGroup, [curX + bWidth / 2, shelfY + bHeight * 0.6, 0.485], [bWidth * 0.85, 0.05, 0.02], antiqueGold);
          }

          curX += bWidth + 0.03;
        }
      }
    };

    // Construct library book walls
    createGrandBookshelf(-5.6, -8.5, 0, 5.5, 6);
    createGrandBookshelf(5.6, -8.5, 0, 5.5, 6);
    createGrandBookshelf(-9.0, -3.2, Math.PI / 2, 6.2, 6);
    createGrandBookshelf(-9.0, 3.8, Math.PI / 2, 6.2, 6);
    createGrandBookshelf(9.0, -3.2, -Math.PI / 2, 6.2, 6);
    createGrandBookshelf(9.0, 3.8, -Math.PI / 2, 6.2, 6);

    // --- GRAND SWEEPING STAIRCASE DISAPPEARING INTO DARKNESS ---
    const stairGroup = new THREE.Group();
    stairGroup.position.set(-6.8, 0, -4.2);
    scene.add(stairGroup);

    for (let step = 0; step < 16; step++) {
      const stepY = step * 0.26;
      const stepZ = -step * 0.35;
      const stepX = Math.sin(step * 0.12) * 0.6;
      helperBox(stairGroup, [stepX, stepY + 0.13, stepZ], [2.6, 0.26, 0.48], polishedWood);

      // Balusters
      const baluster = helperBox(stairGroup, [stepX + 1.2, stepY + 0.6, stepZ], [0.07, 0.8, 0.07], antiqueGold);
      baluster.rotation.z = 0.05;
    }
    // Upper dark mezzanine ledge
    helperBox(scene, [-6.8, 4.2, -8.0], [5.0, 0.3, 3.0], darkWood);

    // --- CENTRAL SCHOLAR'S DESK ---
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0, 0.6);
    scene.add(deskGroup);

    // Main tabletop & pedestals
    helperBox(deskGroup, [0, 1.4, 0], [4.4, 0.18, 2.2], polishedWood);
    // Green leather desktop inlay
    helperBox(deskGroup, [0, 1.495, 0], [3.8, 0.015, 1.7], new THREE.MeshStandardMaterial({
      color: '#1a3022',
      roughness: 0.5,
    }));
    // Pedestals with brass handles
    [-1.7, 1.7].forEach((px) => {
      helperBox(deskGroup, [px, 0.7, 0], [0.85, 1.25, 1.9], darkWood);
      for (let dy = 0.3; dy <= 1.0; dy += 0.35) {
        helperBox(deskGroup, [px, dy, 0.96], [0.24, 0.05, 0.05], antiqueGold);
      }
    });

    // Desk artifacts: Brass banker's desk lamp
    const lampBase = helperBox(deskGroup, [-1.2, 1.55, -0.4], [0.22, 0.08, 0.22], antiqueGold);
    helperBox(deskGroup, [-1.2, 1.85, -0.4], [0.06, 0.55, 0.06], antiqueGold);
    // Emerald green glass lamp shade
    const lampShade = helperBox(deskGroup, [-1.2, 2.15, -0.4], [0.46, 0.16, 0.26], new THREE.MeshStandardMaterial({
      color: '#0e4a2c',
      roughness: 0.2,
      emissive: '#13703c',
      emissiveIntensity: 0.4,
    }));
    lampBase.castShadow = true;
    lampShade.castShadow = true;

    // Banker's lamp light bulb
    const deskLampLight = new THREE.PointLight('#ffd685', 45, 6, 2);
    deskLampLight.position.set(-1.2, 2.05, -0.4);
    deskGroup.add(deskLampLight);

    // Antique Brass Candlestick with flame
    helperBox(deskGroup, [1.3, 1.54, 0.3], [0.18, 0.1, 0.18], antiqueGold);
    helperBox(deskGroup, [1.3, 1.8, 0.3], [0.07, 0.45, 0.07], new THREE.MeshStandardMaterial({ color: '#eee2cb' }));
    const candleFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.04, 0.15, 8),
      new THREE.MeshBasicMaterial({ color: '#ffb338' })
    );
    candleFlame.position.set(1.3, 2.1, 0.3);
    deskGroup.add(candleFlame);

    const candleLight = new THREE.PointLight('#ff9d26', 28, 4.5, 2);
    candleLight.position.set(1.3, 2.15, 0.3);
    candleLight.castShadow = true;
    deskGroup.add(candleLight);
    sceneState.current.candleLight = candleLight;

    // Inkwell, quill, and scrolls
    helperBox(deskGroup, [0.8, 1.52, -0.3], [0.12, 0.12, 0.12], new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.2 }));
    const scroll = helperBox(deskGroup, [-0.4, 1.52, 0.3], [1.1, 0.02, 0.8], new THREE.MeshStandardMaterial({
      color: '#f0e3cc',
      roughness: 0.8,
    }));
    scroll.rotation.y = 0.15;

    // Scholar Chair
    helperBox(deskGroup, [0, 0.65, 1.55], [0.85, 0.12, 0.85], polishedWood);
    helperBox(deskGroup, [0, 1.35, 1.95], [0.85, 1.3, 0.12], polishedWood);
    [-0.35, 0.35].forEach((cx) => {
      helperBox(deskGroup, [cx, 0.32, 1.25], [0.08, 0.64, 0.08], darkWood);
      helperBox(deskGroup, [cx, 0.32, 1.85], [0.08, 0.64, 0.08], darkWood);
    });

    // --- GRAND CONCERT PIANO (Positioned on the Right Wing) ---
    const pianoGroup = new THREE.Group();
    pianoGroup.position.set(4.4, 0, 0.4);
    pianoGroup.rotation.y = -0.35;
    scene.add(pianoGroup);

    const pianoBlack = new THREE.MeshStandardMaterial({
      color: '#0d0c0b',
      roughness: 0.15,
      metalness: 0.25,
    });

    // Piano main body
    helperBox(pianoGroup, [0, 1.1, 0], [2.8, 0.35, 1.6], pianoBlack);
    helperBox(pianoGroup, [0.3, 1.38, -0.2], [2.3, 0.22, 1.25], pianoBlack);
    // Gold cast-iron harp plate inside
    helperBox(pianoGroup, [0.35, 1.48, -0.2], [2.1, 0.03, 1.15], antiqueGold);

    // Open Propped Piano Lid
    const pianoLid = helperBox(pianoGroup, [0.2, 2.05, -0.25], [2.2, 0.05, 1.25], pianoBlack);
    pianoLid.rotation.z = -0.42;
    // Prop stick
    const propStick = helperBox(pianoGroup, [-0.65, 1.75, 0.2], [0.04, 0.8, 0.04], antiqueGold);
    propStick.rotation.z = 0.25;

    // Piano legs & golden lyre pedals
    [-1.1, 0.9].forEach((lx) => {
      helperBox(pianoGroup, [lx, 0.48, -0.5], [0.12, 0.96, 0.12], pianoBlack);
    });
    helperBox(pianoGroup, [-1.1, 0.48, 0.6], [0.12, 0.96, 0.12], pianoBlack);
    helperBox(pianoGroup, [-0.1, 0.25, 0.3], [0.28, 0.45, 0.1], antiqueGold);

    // Keyboard (Ivory white keys and ebony sharps)
    const whiteKeyMat = new THREE.MeshStandardMaterial({ color: '#f5efe3', roughness: 0.3 });
    const blackKeyMat = new THREE.MeshStandardMaterial({ color: '#151311', roughness: 0.2 });
    const createdKeys: THREE.Mesh[] = [];

    for (let k = 0; k < 21; k++) {
      const kx = -1.18 + k * 0.11;
      const whiteKey = helperBox(pianoGroup, [kx, 1.0, 0.72], [0.098, 0.08, 0.45], whiteKeyMat);
      createdKeys.push(whiteKey);

      if (![2, 6, 9, 13, 16, 20].includes(k)) {
        helperBox(pianoGroup, [kx + 0.05, 1.06, 0.6], [0.055, 0.08, 0.24], blackKeyMat);
      }
    }
    sceneState.current.pianoKeys = createdKeys;

    // Music stand with antique sheet music
    const musicStand = helperBox(pianoGroup, [-0.15, 1.45, 0.42], [0.95, 0.35, 0.04], pianoBlack);
    musicStand.rotation.x = -0.3;
    helperBox(pianoGroup, [-0.15, 1.48, 0.45], [0.75, 0.28, 0.02], new THREE.MeshStandardMaterial({ color: '#ece0cb' }));

    // --- ENORMOUS FLOATING OPEN BOOK GLOWING WITH GOLDEN LIGHT ---
    const bookGroup = new THREE.Group();
    bookGroup.position.set(0.1, 2.75, -1.0);
    scene.add(bookGroup);
    sceneState.current.bookGroup = bookGroup;

    const bookPageMat = new THREE.MeshStandardMaterial({
      color: '#fff0d0',
      emissive: '#d69738',
      emissiveIntensity: 0.55,
      roughness: 0.75,
      side: THREE.DoubleSide,
    });
    const leatherCoverMat = new THREE.MeshStandardMaterial({
      color: '#4a2512',
      roughness: 0.5,
    });

    // Curved open pages
    for (const side of [-1, 1]) {
      const pageGeo = new THREE.PlaneGeometry(1.4, 1.9, 8, 8);
      // Curve vertices to simulate open curved book pages
      const posAttr = pageGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const px = posAttr.getX(i);
        posAttr.setZ(i, Math.sin((px + 0.7) * 2.2) * 0.16);
      }
      pageGeo.computeVertexNormals();

      const leaf = new THREE.Mesh(pageGeo, bookPageMat);
      leaf.position.x = side * 0.75;
      leaf.rotation.y = side * -0.22;
      bookGroup.add(leaf);

      // Book cover backing
      const backCover = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.95), leatherCoverMat);
      backCover.position.set(side * 0.76, 0, -0.02);
      backCover.rotation.y = side * -0.22;
      bookGroup.add(backCover);

      // Ancient script rules/lines on the pages
      for (let line = 0; line < 9; line++) {
        const lineMesh = helperBox(
          bookGroup,
          [side * 0.75, 0.65 - line * 0.15, 0.02],
          [0.85 - (line % 3) * 0.08, 0.012, 0.008],
          new THREE.MeshBasicMaterial({ color: '#855629', transparent: true, opacity: 0.75 })
        );
        lineMesh.rotation.y = side * -0.22;
      }
    }
    // Spine
    helperBox(bookGroup, [0, 0, -0.06], [0.18, 1.98, 0.18], leatherCoverMat);

    // Warm golden radiant light pouring from within the book
    const bookGlow = new THREE.PointLight('#ffbb4d', 0, 8.5, 1.7);
    bookGlow.position.set(0, 0.4, 0.8);
    bookGroup.add(bookGlow);
    sceneState.current.bookGlow = bookGlow;

    // Glowing halo ring around the book
    const haloGeo = new THREE.RingGeometry(1.3, 1.34, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: '#f5c871',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2.3;
    bookGroup.add(halo);

    // Floating Golden Arcane Orbiters around the book
    const orbiterGroup = new THREE.Group();
    bookGroup.add(orbiterGroup);
    for (let o = 0; o < 8; o++) {
      const orb = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.045, 0),
        new THREE.MeshBasicMaterial({ color: '#ffda73' })
      );
      const angle = (o / 8) * Math.PI * 2;
      orb.position.set(Math.cos(angle) * 1.5, Math.sin(angle * 2) * 0.35, Math.sin(angle) * 1.5);
      orbiterGroup.add(orb);
    }

    // --- TALL GOTHIC ARCH WINDOWS WITH NIGHT SKY & MOON ---
    const makeGothicWindow = (wx: number) => {
      const windowGroup = new THREE.Group();
      windowGroup.position.set(wx, 5.0, -8.7);
      scene.add(windowGroup);

      // Night sky backing with soft stars
      const windowGlass = new THREE.Mesh(
        new THREE.PlaneGeometry(2.8, 6.2),
        new THREE.MeshBasicMaterial({
          color: '#152438',
          transparent: true,
          opacity: 0.88,
        })
      );
      windowGroup.add(windowGlass);

      // Arch tracery lines
      helperBox(windowGroup, [-1.4, 0, 0.05], [0.18, 6.2, 0.18], darkWood);
      helperBox(windowGroup, [1.4, 0, 0.05], [0.18, 6.2, 0.18], darkWood);
      helperBox(windowGroup, [0, 0, 0.05], [0.08, 6.2, 0.14], darkWood);
      helperBox(windowGroup, [0, 0.8, 0.05], [2.8, 0.08, 0.14], darkWood);
      helperBox(windowGroup, [0, -1.2, 0.05], [2.8, 0.08, 0.14], darkWood);

      // Crescent moon behind right window
      if (wx > 0) {
        const moon = new THREE.Mesh(
          new THREE.CircleGeometry(0.48, 32),
          new THREE.MeshBasicMaterial({ color: '#eaf4fc' })
        );
        moon.position.set(0.65, 1.8, -0.05);
        windowGroup.add(moon);
      }
    };

    makeGothicWindow(-3.2);
    makeGothicWindow(3.2);

    // Cool blue nighttime moonlight streaming in through the arched windows
    const windowMoonlight = new THREE.SpotLight('#6b8ea8', 45, 26, Math.PI / 4, 0.6, 1.4);
    windowMoonlight.position.set(0, 7.5, -8.5);
    windowMoonlight.target.position.set(0, 1.0, 1.0);
    scene.add(windowMoonlight);
    scene.add(windowMoonlight.target);
    sceneState.current.windowMoonlight = windowMoonlight;

    // --- VOLUMETRIC LIGHT BEAMS (GOD RAYS) ---
    const beamMat = new THREE.MeshBasicMaterial({
      color: '#ffc875',
      transparent: true,
      opacity: 0.038,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    // Shaft from above pointing at the book
    const centerBeam = new THREE.Mesh(new THREE.ConeGeometry(2.4, 9, 32, 1, true), beamMat);
    centerBeam.position.set(0.1, 5.8, -1.0);
    centerBeam.rotation.x = Math.PI;
    scene.add(centerBeam);

    // Diagonal moonbeam from window
    const moonBeamMat = new THREE.MeshBasicMaterial({
      color: '#769bb8',
      transparent: true,
      opacity: 0.024,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const moonBeam = new THREE.Mesh(new THREE.ConeGeometry(3.5, 14, 32, 1, true), moonBeamMat);
    moonBeam.position.set(2.8, 6.2, -4.5);
    moonBeam.rotation.x = Math.PI / 2.8;
    scene.add(moonBeam);

    // --- FLOATING DUST MOTES & GOLDEN EMBER PARTICLES ---
    const particleCount = 380;
    sceneState.current.particleCount = particleCount;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = Math.random() * 8 + 0.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      particleSpeeds[i] = 0.0015 + Math.random() * 0.003;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    sceneState.current.particlesGeometry = particlesGeo;

    const particlesMat = new THREE.PointsMaterial({
      color: '#fed894',
      size: 0.038,
      transparent: true,
      opacity: 0.82,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Ambient fill & ceiling chandelier light
    const chandelier = new THREE.PointLight('#ffa84d', 85, 18, 1.8);
    chandelier.position.set(0, 7.8, 2.5);
    chandelier.castShadow = true;
    scene.add(chandelier);

    const ambientLight = new THREE.HemisphereLight('#687d94', '#22140a', 0.65);
    scene.add(ambientLight);

    // --- GSAP CINEMATIC SEQUENCE ---
    const introTl = gsap.timeline({
      delay: 0.35,
      onComplete: () => {
        setIsLoaded(true);
      },
    });
    sceneState.current.timeline = introTl;

    // Stage 1: Camera glides smoothly forward from the threshold into the hall
    introTl.to(camera.position, {
      x: POIS.overview.cameraPos[0],
      y: POIS.overview.cameraPos[1],
      z: POIS.overview.cameraPos[2],
      duration: 4.8,
      ease: 'power3.out',
    });

    introTl.to(
      sceneState.current.lookTarget,
      {
        x: POIS.overview.lookAt[0],
        y: POIS.overview.lookAt[1],
        z: POIS.overview.lookAt[2],
        duration: 4.8,
        ease: 'power3.out',
      },
      0
    );

    // Stage 2: Floating book ignites with golden warmth
    introTl.to(
      bookGlow,
      {
        intensity: 195,
        duration: 3.2,
        ease: 'power2.out',
      },
      1.2
    );

    // Stage 3: Chandelier and candle warmth blooming
    introTl.to(
      chandelier,
      {
        intensity: 140,
        duration: 3.0,
        ease: 'sine.inOut',
      },
      1.5
    );

    // Stage 4: Gentle levitation floating loop for the book
    gsap.to(bookGroup.position, {
      y: 2.95,
      duration: 3.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
    gsap.to(bookGroup.rotation, {
      y: 0.08,
      duration: 5.5,
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

    // --- MOUSE PARALLAX TRACKING ---
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      sceneState.current.mouseNorm.x = (e.clientX / innerWidth - 0.5) * 2;
      sceneState.current.mouseNorm.y = (e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // --- RENDER LOOP ---
    let reqId = 0;
    let clockTime = 0;

    const animate = () => {
      clockTime += 0.016;

      // Subtle mouse parallax damping
      const mx = sceneState.current.mouseNorm.x * 0.45;
      const my = sceneState.current.mouseNorm.y * 0.3;

      const dynamicLook = new THREE.Vector3(
        sceneState.current.lookTarget.x + mx * 0.3,
        sceneState.current.lookTarget.y - my * 0.25,
        sceneState.current.lookTarget.z
      );
      camera.lookAt(dynamicLook);

      // Rotate book arcane orbiters
      orbiterGroup.rotation.y = clockTime * 0.6;
      halo.rotation.z = clockTime * 0.3;

      // Drift floating dust particles upwards
      if (sceneState.current.particlesGeometry) {
        const pos = sceneState.current.particlesGeometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          const yIdx = i * 3 + 1;
          const xIdx = i * 3;
          pos.array[yIdx] += particleSpeeds[i];
          pos.array[xIdx] += Math.sin(clockTime + i) * 0.0008;

          if (pos.array[yIdx] > 8.0) {
            pos.array[yIdx] = 0.2;
          }
        }
        pos.needsUpdate = true;
      }

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    reqId = requestAnimationFrame(animate);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(reqId);
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
    const playing = libraryAudio.toggleAtmosphere();
    setIsPlayingAudio(playing);
  };

  return (
    <div className="digital-library-entrance-wrapper">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="digital-library-canvas" />

      {/* Cinematic HUD Header */}
      <header className="entrance-hud-header">
        <div className="entrance-logo-mark">
          <span className="library-crest">🏛️</span>
          <div>
            <strong>THE DIGITAL LIBRARY</strong>
            <small>SOLOMON · 2026 ARCHIVES</small>
          </div>
        </div>

        <div className="entrance-header-actions">
          <button
            type="button"
            onClick={toggleSound}
            className={`entrance-sound-toggle ${isPlayingAudio ? 'is-active' : ''}`}
            aria-label="Toggle Dark Academia Study Ambience"
          >
            <span className="sound-wave-icon" aria-hidden="true">
              <i /><i /><i /><i />
            </span>
            <span>{isPlayingAudio ? 'Rain & Fireplace : ON' : 'Atmosphere : Muted'}</span>
          </button>

          <button
            type="button"
            onClick={handleExitTransition}
            className="entrance-skip-button"
          >
            Skip to Portfolio <span>→</span>
          </button>
        </div>
      </header>

      {/* Interactive Exploration Waypoints / POIs */}
      <nav className="entrance-poi-nav" aria-label="Library Landmarks">
        <span className="poi-nav-label">Explore Room :</span>
        {(['overview', 'book', 'piano', 'desk', 'window'] as const).map((key) => {
          const item = POIS[key];
          const isActive = activePoi === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => navigateToPoi(key)}
              className={`poi-pill ${isActive ? 'is-active' : ''}`}
            >
              {key === 'book' && '✨ '}
              {key === 'piano' && '🎹 '}
              {key === 'desk' && '🕯️ '}
              {key === 'window' && '🌙 '}
              {key === 'overview' && '🏛️ '}
              {item.title}
            </button>
          );
        })}
      </nav>

      {/* Center POI Information Card / Quote */}
      <section className="entrance-poi-card" aria-live="polite">
        <p className="poi-badge">01 / The Midnight Sanctuary</p>
        <h1 className="poi-title">{POIS[activePoi]?.title}</h1>
        <p className="poi-desc">{POIS[activePoi]?.description}</p>

        {activePoi === 'book' && (
          <blockquote className="poi-quote">
            “A grand library at night is never truly silent — it breathes with every word ever written, waiting for someone curious enough to turn the page.”
          </blockquote>
        )}

        {activePoi === 'piano' && (
          <div className="piano-action-prompt">
            <button
              type="button"
              className="button button-library-outline"
              onClick={() => {
                libraryAudio.playPianoChord(Math.floor(Math.random() * 3));
              }}
            >
              Play Nocturne Chord ♫
            </button>
          </div>
        )}

        <div className="poi-cta-row">
          <button
            type="button"
            onClick={handleExitTransition}
            className="button button-library button-dive"
          >
            Enter Experience <span aria-hidden="true">↘</span>
          </button>
          <span className="poi-hint">Drag mouse to gaze · Click landmarks to wander</span>
        </div>
      </section>

      {/* Bottom Status Ticker */}
      <footer className="entrance-hud-footer">
        <span>Curiosity · Craft · Human-Centered Systems</span>
        <span className="entrance-scroll-prompt">
          Curtains open <span aria-hidden="true">↓</span>
        </span>
        <span>Three.js + GSAP Cinematic Choreography</span>
      </footer>
    </div>
  );
}
