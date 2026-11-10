'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const bookColors = ['#713e2e', '#9c6945', '#34493e', '#8a5737', '#4b3b32', '#b18758', '#343b35'];

function box(
  parent: THREE.Group | THREE.Scene,
  position: [number, number, number],
  size: [number, number, number],
  material: THREE.Material
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeBookshelf(scene: THREE.Scene, x: number, z: number, width: number, rows: number) {
  const shelf = new THREE.Group();
  shelf.position.set(x, 0, z);
  scene.add(shelf);

  const wood = new THREE.MeshStandardMaterial({ color: '#302017', roughness: 0.72 });
  const trim = new THREE.MeshStandardMaterial({ color: '#66452c', roughness: 0.56 });
  box(shelf, [0, rows * 1.18 / 2, 0], [width, rows * 1.18, 0.22], wood);
  box(shelf, [-width / 2 + 0.08, rows * 1.18 / 2, 0.18], [0.16, rows * 1.18, 0.22], trim);
  box(shelf, [width / 2 - 0.08, rows * 1.18 / 2, 0.18], [0.16, rows * 1.18, 0.22], trim);

  for (let row = 0; row <= rows; row += 1) {
    const y = row * 1.18 + 0.08;
    box(shelf, [0, y, 0.24], [width + 0.12, 0.12, 0.62], trim);
    if (row === rows) continue;

    let cursor = -width / 2 + 0.18;
    while (cursor < width / 2 - 0.3) {
      const bookWidth = 0.14 + Math.random() * 0.13;
      const bookHeight = 0.6 + Math.random() * 0.42;
      const material = new THREE.MeshStandardMaterial({
        color: bookColors[Math.floor(Math.random() * bookColors.length)],
        roughness: 0.82,
      });
      const book = box(
        shelf,
        [cursor + bookWidth / 2, y + bookHeight / 2 + 0.08, 0.31],
        [bookWidth, bookHeight, 0.3],
        material
      );
      book.rotation.z = (Math.random() - 0.5) * 0.08;
      cursor += bookWidth + 0.035;
    }
  }
}

function makeArchWindow(scene: THREE.Scene) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.88, 0);
  shape.lineTo(-0.88, 2.15);
  shape.quadraticCurveTo(-0.88, 3.2, 0, 3.2);
  shape.quadraticCurveTo(0.88, 3.2, 0.88, 2.15);
  shape.lineTo(0.88, 0);
  shape.closePath();

  const window = new THREE.Mesh(
    new THREE.ShapeGeometry(shape, 24),
    new THREE.MeshBasicMaterial({ color: '#283b4b', transparent: true, opacity: 0.76, side: THREE.DoubleSide })
  );
  window.position.set(0, 2.5, -7.72);
  scene.add(window);

  const frame = new THREE.Mesh(
    new THREE.EdgesGeometry(new THREE.ShapeGeometry(shape, 24)),
    new THREE.LineBasicMaterial({ color: '#9b7850' })
  );
  frame.position.copy(window.position);
  frame.position.z -= 0.04;
  scene.add(frame);

  const mullionMaterial = new THREE.MeshStandardMaterial({ color: '#725333', roughness: 0.55 });
  box(scene, [0, 3.8, -7.62], [0.07, 2.6, 0.09], mullionMaterial);
  box(scene, [0, 4.1, -7.62], [1.65, 0.07, 0.09], mullionMaterial);
  box(scene, [0, 3.25, -7.62], [1.65, 0.07, 0.09], mullionMaterial);
  const moon = new THREE.Mesh(
    new THREE.CircleGeometry(0.22, 32),
    new THREE.MeshBasicMaterial({ color: '#c4ccd1', transparent: true, opacity: 0.7 })
  );
  moon.position.set(0.42, 4.45, -7.58);
  scene.add(moon);
}

function makeDesk(scene: THREE.Scene) {
  const wood = new THREE.MeshStandardMaterial({ color: '#57351f', roughness: 0.38, metalness: 0.08 });
  const darkWood = new THREE.MeshStandardMaterial({ color: '#291a12', roughness: 0.45 });
  box(scene, [0.1, 1.35, 0.4], [3.8, 0.2, 1.65], wood);
  box(scene, [0.1, 1.22, 0.4], [3.55, 0.08, 1.42], darkWood);
  for (const x of [-1.5, 1.7]) {
    box(scene, [x, 0.65, 0.42], [0.18, 1.25, 1.24], darkWood);
    box(scene, [x, 1.02, 0.42], [0.76, 0.08, 1.16], wood);
  }
  box(scene, [0.1, 0.74, -0.27], [3.3, 0.09, 0.12], wood);

  const brass = new THREE.MeshStandardMaterial({ color: '#c69a55', metalness: 0.72, roughness: 0.27 });
  const candle = new THREE.MeshStandardMaterial({ color: '#ddc8a4', roughness: 0.7 });
  box(scene, [-1.18, 1.48, 0.28], [0.13, 0.14, 0.13], brass);
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.035, 0.12, 8),
    new THREE.MeshBasicMaterial({ color: '#ffd180' })
  );
  flame.position.set(-1.18, 1.62, 0.28);
  scene.add(flame);
  box(scene, [-1.18, 1.31, 0.28], [0.19, 0.25, 0.19], candle);
}

function makePiano(scene: THREE.Scene) {
  const piano = new THREE.Group();
  piano.position.set(3.55, 0, 0.2);
  scene.add(piano);
  const black = new THREE.MeshStandardMaterial({ color: '#11100e', roughness: 0.25, metalness: 0.15 });
  const polished = new THREE.MeshStandardMaterial({ color: '#241a14', roughness: 0.22, metalness: 0.18 });
  box(piano, [0, 1.05, 0], [2.4, 0.25, 1.35], polished);
  box(piano, [0.15, 1.27, -0.13], [1.95, 0.08, 1.13], black);
  box(piano, [-0.38, 0.92, 0.62], [1.85, 0.12, 0.2], black);
  for (const x of [-0.93, 0.75]) box(piano, [x, 0.48, -0.35], [0.09, 0.95, 0.09], black);
  const whiteKey = new THREE.MeshStandardMaterial({ color: '#e5d9c4', roughness: 0.4 });
  const blackKey = new THREE.MeshStandardMaterial({ color: '#171512', roughness: 0.3 });
  for (let key = 0; key < 18; key += 1) {
    const x = -1.02 + key * 0.115;
    box(piano, [x, 0.93, 0.73], [0.105, 0.08, 0.48], whiteKey);
    if (![2, 6, 9, 13, 16].includes(key)) box(piano, [x + 0.05, 1.005, 0.57], [0.055, 0.07, 0.23], blackKey);
  }
  const lid = box(piano, [0.1, 1.75, -0.18], [1.78, 0.07, 1.0], polished);
  lid.rotation.z = -0.45;
  box(piano, [-0.95, 0.5, 0.72], [0.08, 1, 0.08], black);
}

function makeOpenBook(scene: THREE.Scene) {
  const book = new THREE.Group();
  book.position.set(0.45, 3.5, -1.35);
  scene.add(book);
  const page = new THREE.MeshStandardMaterial({
    color: '#ead7b3',
    emissive: '#a66b2b',
    emissiveIntensity: 0.42,
    roughness: 0.76,
    side: THREE.DoubleSide,
  });
  const spine = new THREE.MeshStandardMaterial({ color: '#674228', roughness: 0.52 });

  for (const side of [-1, 1]) {
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 1.65, 1, 8), page);
    leaf.position.x = side * 0.65;
    leaf.rotation.y = side * -0.08;
    leaf.rotation.x = -0.12;
    book.add(leaf);
    for (let line = 0; line < 7; line += 1) {
      const ink = new THREE.MeshBasicMaterial({ color: '#a88154', transparent: true, opacity: 0.6 });
      const rule = new THREE.Mesh(new THREE.BoxGeometry(0.78 - (line % 3) * 0.06, 0.008, 0.006), ink);
      rule.position.set(side * 0.67, 0.48 - line * 0.15, 0.012);
      book.add(rule);
    }
  }
  box(book, [0, 0, 0.025], [0.12, 1.68, 0.12], spine);

  const halo = new THREE.PointLight('#ffc56f', 14, 7, 2);
  halo.position.set(0, 0.3, 1.25);
  book.add(halo);
  return book;
}

export default function LibraryScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch (error) {
      console.error('The Three.js library scene could not initialize WebGL.', error);
      setUnavailable(true);
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#100d0a');
    scene.fog = new THREE.FogExp2('#100d0a', 0.045);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 70);
    camera.position.set(-0.35, 3.1, 11.6);
    const lookTarget = new THREE.Vector3(0, 2.05, -2.2);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.HemisphereLight('#b99b73', '#1b120d', 1.15);
    scene.add(ambient);
    const keyLight = new THREE.PointLight('#ffbc68', 180, 19, 1.8);
    keyLight.position.set(-1.5, 5.3, 1.7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight('#d28a43', 75, 12, 2);
    fillLight.position.set(4.5, 3.6, -2);
    scene.add(fillLight);
    const windowLight = new THREE.PointLight('#7890a0', 22, 8, 2);
    windowLight.position.set(0, 4, -6.4);
    scene.add(windowLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 22),
      new THREE.MeshStandardMaterial({ color: '#39271a', roughness: 0.28, metalness: 0.12 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.05, -0.7);
    floor.receiveShadow = true;
    scene.add(floor);
    const plankMaterial = new THREE.MeshStandardMaterial({ color: '#5d4029', roughness: 0.38, metalness: 0.08 });
    for (let z = -10; z < 9; z += 0.78) {
      box(scene, [0, -0.015, z], [17.8, 0.025, 0.025], plankMaterial);
    }
    for (let z = -9; z < 8; z += 2.34) {
      for (const x of [-5.7, 0.1, 5.8]) {
        box(scene, [x, 0.003, z], [0.025, 0.02, 0.78], plankMaterial);
      }
    }

    const wall = new THREE.MeshStandardMaterial({ color: '#211710', roughness: 0.88 });
    box(scene, [0, 3.45, -8.15], [14, 7, 0.35], wall);
    box(scene, [-7.05, 3.45, 0], [0.35, 7, 16], wall);
    box(scene, [7.05, 3.45, 0], [0.35, 7, 16], wall);

    makeArchWindow(scene);
    makeBookshelf(scene, -4.65, -7.65, 3.6, 5);
    makeBookshelf(scene, 4.65, -7.65, 3.6, 5);
    makeBookshelf(scene, -6.55, -3.2, 0.82, 5);
    makeBookshelf(scene, -6.55, 1.1, 0.82, 5);
    makeBookshelf(scene, 6.55, -3.2, 0.82, 5);
    makeBookshelf(scene, 6.55, 1.1, 0.82, 5);

    const stairMaterial = new THREE.MeshStandardMaterial({ color: '#4b3322', roughness: 0.68 });
    for (let step = 0; step < 9; step += 1) {
      const width = 3.8 - step * 0.24;
      box(
        scene,
        [0, 0.14 + step * 0.24, -2.6 - step * 0.52],
        [width, 0.28, 0.72],
        stairMaterial
      );
    }
    makeDesk(scene);
    makePiano(scene);
    const book = makeOpenBook(scene);

    const beamMaterial = new THREE.MeshBasicMaterial({
      color: '#d58a43',
      transparent: true,
      opacity: 0.035,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const beam = new THREE.Mesh(new THREE.ConeGeometry(1.8, 7, 32, 1, true), beamMaterial);
    beam.position.set(-1.1, 3.4, 0.4);
    beam.rotation.x = Math.PI;
    scene.add(beam);
    const secondBeam = beam.clone();
    secondBeam.position.set(3.8, 3.1, -1.4);
    secondBeam.scale.set(0.72, 0.88, 0.72);
    scene.add(secondBeam);

    const particleCount = window.innerWidth < 700 ? 100 : 220;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 1] = Math.random() * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 13;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: '#f0c98e', size: 0.025, transparent: true, opacity: 0.72, sizeAttenuation: true })
    );
    scene.add(particles);

    let frame = 0;
    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const sequence = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    sequence
      .to(camera.position, { x: 0.15, y: 2.85, z: 9.5, duration: 4.8, ease: 'power3.out' }, 0)
      .to(lookTarget, { x: 0.15, y: 2.2, z: -2.7, duration: 4.8, ease: 'power3.out' }, 0)
      .to(book.position, { y: 3.72, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' }, 0.8)
      .to(book.rotation, { y: 0.075, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' }, 0.8)
      .to(keyLight, { intensity: 205, duration: 2.3, yoyo: true, repeat: -1, ease: 'sine.inOut' }, 1.2);

    const render = () => {
      camera.lookAt(lookTarget);
      const positions = particleGeometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i += 1) {
        const index = i * 3 + 1;
        positions.array[index] = (positions.array[index] + 0.0025) % 6;
      }
      positions.needsUpdate = true;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      sequence.kill();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className={unavailable ? 'library-scene library-scene-fallback' : 'library-scene'} aria-hidden="true" />;
}
