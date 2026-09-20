import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme, THEME_CONFIGS } from '../context/ThemeContext';
import {
  Waves,
  Network,
  Boxes,
  Atom,
  Terminal,
} from 'lucide-react';

export type ThreeSceneMode = 'wave' | 'constellation' | 'geometry' | 'vortex' | 'cascade';

export interface SceneModeInfo {
  id: ThreeSceneMode;
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  cameraPos: [number, number, number];
  lookAtPos: [number, number, number];
}

export const SCENE_MODES: SceneModeInfo[] = [
  {
    id: 'wave',
    name: 'Quantum Wave Grid',
    tagline: 'Harmonic sine/cosine undulating particle surface with cursor ripples',
    icon: Waves,
    cameraPos: [0, 8, 72],
    lookAtPos: [0, -12, 0],
  },
  {
    id: 'constellation',
    name: 'Neural Star Constellation',
    tagline: 'Proximity-linked 3D dynamic synapsing nodes with cursor force field',
    icon: Network,
    cameraPos: [0, 0, 78],
    lookAtPos: [0, 0, 0],
  },
  {
    id: 'geometry',
    name: 'Hyper-Dimensional Matrix',
    tagline: 'Platonic polyhedra, gyro rings & refractive wireframes',
    icon: Boxes,
    cameraPos: [10, 4, 66],
    lookAtPos: [0, 0, 0],
  },
  {
    id: 'vortex',
    name: 'DNA Helix & Quantum Vortex',
    tagline: 'Molecular double-helix & logarithmic particle funnel',
    icon: Atom,
    cameraPos: [0, 16, 68],
    lookAtPos: [0, 0, 0],
  },
  {
    id: 'cascade',
    name: 'Cyber Matrix Data Cascade',
    tagline: 'Vertical code rain showers & neon horizon grid',
    icon: Terminal,
    cameraPos: [0, 6, 75],
    lookAtPos: [0, 0, 0],
  },
];

export const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeConfig = THEME_CONFIGS[theme];

  // Active scene mode index for automatic morphing
  const [activeModeIndex, setActiveModeIndex] = useState<number>(0);
  const activeModeIndexRef = useRef<number>(0);
  activeModeIndexRef.current = activeModeIndex;

  // Material references for live theme and opacity interpolation
  const materialsRef = useRef<{
    waveMaterial?: THREE.PointsMaterial;
    pointsMaterial?: THREE.PointsMaterial;
    linesMaterial?: THREE.LineBasicMaterial;
    neuralCoreMaterial?: THREE.MeshBasicMaterial;
    wireframeMaterial?: THREE.MeshBasicMaterial;
    torusMaterial?: THREE.MeshBasicMaterial;
    coreSphereMaterial?: THREE.MeshBasicMaterial;
    gyroMaterial?: THREE.MeshBasicMaterial;
    helixMaterial?: THREE.PointsMaterial;
    helixRungMaterial?: THREE.LineBasicMaterial;
    vortexMaterial?: THREE.PointsMaterial;
    cascadeMaterial?: THREE.PointsMaterial;
    cascadeGridHelper?: THREE.GridHelper;
    crystalsMaterial?: THREE.MeshBasicMaterial;
    crystalsCoreMaterial?: THREE.MeshBasicMaterial;
    stardustMaterial?: THREE.PointsMaterial;
  }>({});

  // Group references
  const groupsRef = useRef<{
    waveGroup?: THREE.Group;
    constellationGroup?: THREE.Group;
    geometryGroup?: THREE.Group;
    vortexGroup?: THREE.Group;
    cascadeGroup?: THREE.Group;
    ambientCrystalsGroup?: THREE.Group;
  }>({});

  // Opacity tracking for smooth cross-fading (5 modes)
  const groupOpacitiesRef = useRef<number[]>([1, 0, 0, 0, 0]);

  // Timer effect for auto-cycling every 7 seconds seamlessly
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveModeIndex((curr) => (curr + 1) % SCENE_MODES.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  // Main Three.js Initialization & 60FPS Render Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    );
    const initialMode = SCENE_MODES[0];
    camera.position.set(...initialMode.cameraPos);

    // 3. High-performance WebGL Renderer with alpha transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Create Texture for Glowing Particles
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.25, 'rgba(255,255,255,0.9)');
      gradient.addColorStop(0.55, 'rgba(255,255,255,0.4)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    // -------------------------------------------------------------
    // PERSISTENT LAYER: Ethereal Floating Holographic Crystals
    // (Gives incredible depth across ALL portfolio sections!)
    // -------------------------------------------------------------
    const ambientCrystalsGroup = new THREE.Group();
    groupsRef.current.ambientCrystalsGroup = ambientCrystalsGroup;
    scene.add(ambientCrystalsGroup);

    const crystalsMaterial = new THREE.MeshBasicMaterial({
      color: themeConfig.wireframeHex,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    materialsRef.current.crystalsMaterial = crystalsMaterial;

    const crystalsCoreMaterial = new THREE.MeshBasicMaterial({
      color: themeConfig.particleHex,
      transparent: true,
      opacity: 0.15,
    });
    materialsRef.current.crystalsCoreMaterial = crystalsCoreMaterial;

    const crystalMeshes: {
      mesh: THREE.Group;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      baseY: number;
      floatSpeed: number;
    }[] = [];

    // Distinct polyhedral geometries: Icosahedron, Octahedron, Dodecahedron
    const polyGeos = [
      new THREE.IcosahedronGeometry(7, 0),
      new THREE.OctahedronGeometry(6.5, 0),
      new THREE.DodecahedronGeometry(6, 0),
      new THREE.IcosahedronGeometry(5.5, 0),
      new THREE.OctahedronGeometry(8, 0),
      new THREE.DodecahedronGeometry(5, 0),
    ];

    const crystalPositions = [
      [-48, 22, -35],
      [52, -18, -45],
      [-36, -26, -25],
      [42, 28, -40],
      [-56, 4, -55],
      [35, -4, -30],
    ];

    polyGeos.forEach((geo, i) => {
      const crystalGroup = new THREE.Group();
      const wire = new THREE.Mesh(geo, crystalsMaterial);
      const core = new THREE.Mesh(geo, crystalsCoreMaterial);
      core.scale.set(0.65, 0.65, 0.65);
      crystalGroup.add(wire);
      crystalGroup.add(core);

      const pos = crystalPositions[i];
      crystalGroup.position.set(pos[0], pos[1], pos[2]);
      ambientCrystalsGroup.add(crystalGroup);

      crystalMeshes.push({
        mesh: crystalGroup,
        rotSpeedX: 0.004 + (i % 3) * 0.003,
        rotSpeedY: 0.006 + (i % 2) * 0.004,
        rotSpeedZ: 0.003 + (i % 4) * 0.002,
        baseY: pos[1],
        floatSpeed: 0.8 + (i % 3) * 0.4,
      });
    });

    // Persistent Cosmic Stardust Field (300 twinkling stars)
    const stardustCount = 300;
    const stardustPos = new Float32Array(stardustCount * 3);
    for (let s = 0; s < stardustCount; s++) {
      stardustPos[s * 3] = (Math.random() - 0.5) * 220;
      stardustPos[s * 3 + 1] = (Math.random() - 0.5) * 180;
      stardustPos[s * 3 + 2] = -90 + Math.random() * 110;
    }
    const stardustGeo = new THREE.BufferGeometry();
    stardustGeo.setAttribute('position', new THREE.BufferAttribute(stardustPos, 3));
    const stardustMaterial = new THREE.PointsMaterial({
      color: themeConfig.particleHex,
      size: 1.8,
      map: particleTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materialsRef.current.stardustMaterial = stardustMaterial;
    const stardustPoints = new THREE.Points(stardustGeo, stardustMaterial);
    scene.add(stardustPoints);

    // -------------------------------------------------------------
    // 1. GROUP: Quantum Wave Grid
    // -------------------------------------------------------------
    const waveGroup = new THREE.Group();
    groupsRef.current.waveGroup = waveGroup;
    scene.add(waveGroup);

    const waveCols = 66;
    const waveRows = 46;
    const waveCount = waveCols * waveRows;
    const wavePositions = new Float32Array(waveCount * 3);
    const waveStepX = 3.6;
    const waveStepZ = 3.2;
    const waveOffsetX = (waveCols * waveStepX) / 2;
    const waveOffsetZ = (waveRows * waveStepZ) / 2;

    for (let r = 0; r < waveRows; r++) {
      for (let c = 0; c < waveCols; c++) {
        const i = (r * waveCols + c) * 3;
        wavePositions[i] = c * waveStepX - waveOffsetX;
        wavePositions[i + 1] = -26;
        wavePositions[i + 2] = r * waveStepZ - waveOffsetZ - 25;
      }
    }

    const waveGeometry = new THREE.BufferGeometry();
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));

    const waveMaterial = new THREE.PointsMaterial({
      color: themeConfig.particleHex,
      size: theme === 'light' ? 2.8 : 3.4,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materialsRef.current.waveMaterial = waveMaterial;

    const wavePoints = new THREE.Points(waveGeometry, waveMaterial);
    wavePoints.rotation.x = 0.24;
    waveGroup.add(wavePoints);

    // -------------------------------------------------------------
    // 2. GROUP: Neural Star Constellation
    // -------------------------------------------------------------
    const constellationGroup = new THREE.Group();
    groupsRef.current.constellationGroup = constellationGroup;
    scene.add(constellationGroup);

    const particleCount = 220;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 190;
      particlePositions[i + 1] = (Math.random() - 0.5) * 150;
      particlePositions[i + 2] = (Math.random() - 0.5) * 120;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.05,
        y: (Math.random() - 0.5) * 0.05,
        z: (Math.random() - 0.5) * 0.05,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      color: themeConfig.particleHex,
      size: theme === 'light' ? 3.0 : 3.8,
      map: particleTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materialsRef.current.pointsMaterial = pointsMaterial;

    const constellation = new THREE.Points(particleGeometry, pointsMaterial);
    constellationGroup.add(constellation);

    // Dynamic proximity lines
    const maxLineSegments = 160;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const linesMaterial = new THREE.LineBasicMaterial({
      color: themeConfig.particleHex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    materialsRef.current.linesMaterial = linesMaterial;

    const lineMesh = new THREE.LineSegments(lineGeometry, linesMaterial);
    constellationGroup.add(lineMesh);

    // Central pulsing neural core sphere
    const neuralCoreGeo = new THREE.SphereGeometry(9, 20, 20);
    const neuralCoreMaterial = new THREE.MeshBasicMaterial({
      color: themeConfig.wireframeHex,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    materialsRef.current.neuralCoreMaterial = neuralCoreMaterial;
    const neuralCoreMesh = new THREE.Mesh(neuralCoreGeo, neuralCoreMaterial);
    neuralCoreMesh.position.set(0, 0, -10);
    constellationGroup.add(neuralCoreMesh);

    // -------------------------------------------------------------
    // 3. GROUP: Hyper-Dimensional Matrix
    // -------------------------------------------------------------
    const geometryGroup = new THREE.Group();
    groupsRef.current.geometryGroup = geometryGroup;
    scene.add(geometryGroup);

    // Icosahedron (Right side)
    const icosaGeometry = new THREE.IcosahedronGeometry(18, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: themeConfig.wireframeHex,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    materialsRef.current.wireframeMaterial = wireframeMaterial;
    const icosaMesh = new THREE.Mesh(icosaGeometry, wireframeMaterial);
    icosaMesh.position.set(38, -4, -15);
    geometryGroup.add(icosaMesh);

    // Inner concentric sphere
    const coreSphereGeo = new THREE.SphereGeometry(7.5, 16, 16);
    const coreSphereMaterial = new THREE.MeshBasicMaterial({
      color: themeConfig.particleHex,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    materialsRef.current.coreSphereMaterial = coreSphereMaterial;
    const coreSphereMesh = new THREE.Mesh(coreSphereGeo, coreSphereMaterial);
    coreSphereMesh.position.copy(icosaMesh.position);
    geometryGroup.add(coreSphereMesh);

    // Torus Knot (Left side)
    const torusGeometry = new THREE.TorusKnotGeometry(12, 2.8, 64, 16);
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: themeConfig.particleHex,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    materialsRef.current.torusMaterial = torusMaterial;
    const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
    torusMesh.position.set(-42, 10, -20);
    geometryGroup.add(torusMesh);

    // Octahedron Accent (Top right)
    const octaGeometry = new THREE.OctahedronGeometry(13, 0);
    const octaMesh = new THREE.Mesh(octaGeometry, wireframeMaterial);
    octaMesh.position.set(22, 28, -35);
    geometryGroup.add(octaMesh);

    // Gyroscope Outer Gimbal Rings
    const gyroGeo1 = new THREE.TorusGeometry(18, 0.4, 16, 64);
    const gyroMaterial = new THREE.MeshBasicMaterial({
      color: themeConfig.wireframeHex,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    materialsRef.current.gyroMaterial = gyroMaterial;
    const gyroMesh1 = new THREE.Mesh(gyroGeo1, gyroMaterial);
    gyroMesh1.position.set(0, 5, -25);
    geometryGroup.add(gyroMesh1);

    const gyroGeo2 = new THREE.TorusGeometry(14, 0.35, 16, 64);
    const gyroMesh2 = new THREE.Mesh(gyroGeo2, gyroMaterial);
    gyroMesh2.position.set(0, 5, -25);
    geometryGroup.add(gyroMesh2);

    // -------------------------------------------------------------
    // 4. GROUP: DNA Helix & Quantum Vortex
    // -------------------------------------------------------------
    const vortexGroup = new THREE.Group();
    groupsRef.current.vortexGroup = vortexGroup;
    scene.add(vortexGroup);

    const helixPointsCount = 180;
    const helixPosArray = new Float32Array(helixPointsCount * 2 * 3);
    const helixLength = 110;
    const helixRadius = 14;
    const helixTurns = 3.5;

    for (let i = 0; i < helixPointsCount; i++) {
      const t = (i / helixPointsCount) * Math.PI * 2 * helixTurns;
      const y = (i / helixPointsCount) * helixLength - helixLength / 2;

      const idx1 = i * 3;
      helixPosArray[idx1] = Math.cos(t) * helixRadius - 28;
      helixPosArray[idx1 + 1] = y;
      helixPosArray[idx1 + 2] = Math.sin(t) * helixRadius - 20;

      const idx2 = (helixPointsCount + i) * 3;
      helixPosArray[idx2] = Math.cos(t + Math.PI) * helixRadius - 28;
      helixPosArray[idx2 + 1] = y;
      helixPosArray[idx2 + 2] = Math.sin(t + Math.PI) * helixRadius - 20;
    }

    const helixGeometry = new THREE.BufferGeometry();
    helixGeometry.setAttribute('position', new THREE.BufferAttribute(helixPosArray, 3));

    const helixMaterial = new THREE.PointsMaterial({
      color: themeConfig.particleHex,
      size: theme === 'light' ? 3.0 : 3.6,
      map: particleTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materialsRef.current.helixMaterial = helixMaterial;

    const helixPoints = new THREE.Points(helixGeometry, helixMaterial);
    vortexGroup.add(helixPoints);

    // DNA Cross-rungs
    const rungsCount = 38;
    const rungPosArray = new Float32Array(rungsCount * 6);
    for (let r = 0; r < rungsCount; r++) {
      const t = (r / rungsCount) * Math.PI * 2 * helixTurns;
      const y = (r / rungsCount) * helixLength - helixLength / 2;
      const r6 = r * 6;
      rungPosArray[r6] = Math.cos(t) * helixRadius - 28;
      rungPosArray[r6 + 1] = y;
      rungPosArray[r6 + 2] = Math.sin(t) * helixRadius - 20;

      rungPosArray[r6 + 3] = Math.cos(t + Math.PI) * helixRadius - 28;
      rungPosArray[r6 + 4] = y;
      rungPosArray[r6 + 5] = Math.sin(t + Math.PI) * helixRadius - 20;
    }

    const helixRungGeo = new THREE.BufferGeometry();
    helixRungGeo.setAttribute('position', new THREE.BufferAttribute(rungPosArray, 3));
    const helixRungMaterial = new THREE.LineBasicMaterial({
      color: themeConfig.wireframeHex,
      transparent: true,
      opacity: 0,
    });
    materialsRef.current.helixRungMaterial = helixRungMaterial;
    const helixRungLines = new THREE.LineSegments(helixRungGeo, helixRungMaterial);
    vortexGroup.add(helixRungLines);

    // Vortex Particle Funnel (Right side)
    const vortexParticlesCount = 320;
    const vortexPosArray = new Float32Array(vortexParticlesCount * 3);
    for (let i = 0; i < vortexParticlesCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 22;
      const y = (Math.random() - 0.5) * 80;
      const i3 = i * 3;
      vortexPosArray[i3] = Math.cos(angle) * radius + 32;
      vortexPosArray[i3 + 1] = y;
      vortexPosArray[i3 + 2] = Math.sin(angle) * radius - 20;
    }

    const vortexGeometry = new THREE.BufferGeometry();
    vortexGeometry.setAttribute('position', new THREE.BufferAttribute(vortexPosArray, 3));

    const vortexMaterial = new THREE.PointsMaterial({
      color: themeConfig.particleHex,
      size: theme === 'light' ? 2.8 : 3.5,
      map: particleTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materialsRef.current.vortexMaterial = vortexMaterial;

    const vortexPoints = new THREE.Points(vortexGeometry, vortexMaterial);
    vortexGroup.add(vortexPoints);

    // -------------------------------------------------------------
    // 5. GROUP: Cyber Matrix Data Cascade
    // -------------------------------------------------------------
    const cascadeGroup = new THREE.Group();
    groupsRef.current.cascadeGroup = cascadeGroup;
    scene.add(cascadeGroup);

    const cascadeCount = 380;
    const cascadePos = new Float32Array(cascadeCount * 3);
    const cascadeSpeeds = new Float32Array(cascadeCount);

    for (let c = 0; c < cascadeCount; c++) {
      const c3 = c * 3;
      cascadePos[c3] = (Math.random() - 0.5) * 160;
      cascadePos[c3 + 1] = (Math.random() - 0.5) * 130;
      cascadePos[c3 + 2] = -40 + Math.random() * 70;
      cascadeSpeeds[c] = 0.4 + Math.random() * 1.2;
    }

    const cascadeGeom = new THREE.BufferGeometry();
    cascadeGeom.setAttribute('position', new THREE.BufferAttribute(cascadePos, 3));

    const cascadeMaterial = new THREE.PointsMaterial({
      color: themeConfig.particleHex,
      size: theme === 'light' ? 2.6 : 3.2,
      map: particleTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materialsRef.current.cascadeMaterial = cascadeMaterial;

    const cascadePoints = new THREE.Points(cascadeGeom, cascadeMaterial);
    cascadeGroup.add(cascadePoints);

    // Neon floor grid for cascade mode
    const cascadeGrid = new THREE.GridHelper(180, 36, themeConfig.wireframeHex, 0x172554);
    cascadeGrid.position.y = -30;
    cascadeGrid.material.transparent = true;
    cascadeGrid.material.opacity = 0;
    cascadeGroup.add(cascadeGrid);
    materialsRef.current.cascadeGridHelper = cascadeGrid;

    // -------------------------------------------------------------
    // Mouse Interaction & Interactive Dynamic Ripple Physics
    // -------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollOffset = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.035;
      mouseY = (e.clientY - windowHalfY) * 0.035;
    };

    const handleScroll = () => {
      // Gentle depth parallax linked to scroll
      scrollOffset = (window.scrollY / (document.body.scrollHeight || 1)) * 40;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // -------------------------------------------------------------
    // Main 60FPS Animation & Morphing Loop
    // -------------------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const currentCamPos = new THREE.Vector3(...initialMode.cameraPos);
    const targetCamPos = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3(...initialMode.lookAtPos);
    const targetLookAt = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation toward active mode's vantage point + scroll depth
      const currentMode = SCENE_MODES[activeModeIndexRef.current] || SCENE_MODES[0];
      targetCamPos.set(
        currentMode.cameraPos[0] + targetX * 0.35,
        currentMode.cameraPos[1] - targetY * 0.35 - scrollOffset * 0.15,
        currentMode.cameraPos[2] - scrollOffset * 0.2
      );
      targetLookAt.set(
        currentMode.lookAtPos[0] + targetX * 0.15,
        currentMode.lookAtPos[1] - targetY * 0.15,
        currentMode.lookAtPos[2]
      );

      // Smooth lerp camera position and lookAt (0.04 factor for buttery cinematic motion)
      currentCamPos.lerp(targetCamPos, 0.04);
      currentLookAt.lerp(targetLookAt, 0.04);
      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      // -------------------------------------------------------------
      // Animate Persistent Layer: Floating Quantum Cyber Crystals
      // -------------------------------------------------------------
      crystalMeshes.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.rotation.z += item.rotSpeedZ;
        // Subtle vertical bobbing + scroll parallax
        item.mesh.position.y =
          item.baseY +
          Math.sin(elapsedTime * item.floatSpeed) * 2.2 -
          scrollOffset * 0.3;
      });

      // Twinkle ambient stardust
      if (stardustMaterial) {
        stardustMaterial.opacity = 0.35 + Math.sin(elapsedTime * 1.5) * 0.12;
      }

      // -------------------------------------------------------------
      // Smooth Group Opacity Cross-Fading (Linear Interpolation across 5 scenes)
      // -------------------------------------------------------------
      const activeIdx = activeModeIndexRef.current;
      const opacities = groupOpacitiesRef.current;
      const lerpSpeed = 0.055;

      for (let i = 0; i < 5; i++) {
        const targetOp = i === activeIdx ? 1 : 0.03;
        opacities[i] += (targetOp - opacities[i]) * lerpSpeed;
      }

      const isLight = theme === 'light';

      // 1. Quantum Wave Grid opacities
      if (waveMaterial) {
        waveMaterial.opacity = opacities[0] * (isLight ? 0.65 : 0.85);
      }

      // 2. Neural Constellation opacities
      if (pointsMaterial && linesMaterial && neuralCoreMaterial) {
        pointsMaterial.opacity = opacities[1] * (isLight ? 0.7 : 0.9);
        linesMaterial.opacity = opacities[1] * (isLight ? 0.25 : 0.42);
        neuralCoreMaterial.opacity = opacities[1] * (isLight ? 0.2 : 0.4);
      }

      // 3. Hyper-Dimensional Matrix opacities
      if (wireframeMaterial && torusMaterial && coreSphereMaterial && gyroMaterial) {
        wireframeMaterial.opacity = opacities[2] * (isLight ? 0.35 : 0.6);
        torusMaterial.opacity = opacities[2] * (isLight ? 0.3 : 0.55);
        coreSphereMaterial.opacity = opacities[2] * (isLight ? 0.25 : 0.45);
        gyroMaterial.opacity = opacities[2] * (isLight ? 0.28 : 0.5);
      }

      // 4. DNA Helix & Quantum Vortex opacities
      if (helixMaterial && helixRungMaterial && vortexMaterial) {
        helixMaterial.opacity = opacities[3] * (isLight ? 0.65 : 0.88);
        helixRungMaterial.opacity = opacities[3] * (isLight ? 0.22 : 0.4);
        vortexMaterial.opacity = opacities[3] * (isLight ? 0.65 : 0.85);
      }

      // 5. Cyber Matrix Data Cascade opacities
      if (cascadeMaterial && cascadeGrid) {
        cascadeMaterial.opacity = opacities[4] * (isLight ? 0.65 : 0.85);
        cascadeGrid.material.opacity = opacities[4] * (isLight ? 0.2 : 0.35);
      }

      // -------------------------------------------------------------
      // 1. Animate Wave Grid (Undulating harmonic surface + interactive cursor ripple)
      // -------------------------------------------------------------
      if (opacities[0] > 0.02) {
        const wavePosArr = waveGeometry.attributes.position.array as Float32Array;
        const cursorWorldX = targetX * 1.6;
        for (let r = 0; r < waveRows; r++) {
          for (let c = 0; c < waveCols; c++) {
            const idx = (r * waveCols + c) * 3;
            const x = wavePosArr[idx];
            const z = wavePosArr[idx + 2];
            const waveHeight =
              Math.sin(x * 0.08 + elapsedTime * 1.6) * 4.6 +
              Math.cos(z * 0.09 + elapsedTime * 1.2) * 4.0;

            // Interactive dynamic cursor ripple
            const dx = x - cursorWorldX;
            const dz = z - (-25 - targetY * 1.2);
            const dist = Math.sqrt(dx * dx + dz * dz);
            const ripple = dist < 24 ? Math.cos(dist * 0.45 - elapsedTime * 5) * (24 - dist) * 0.22 : 0;

            wavePosArr[idx + 1] = -26 + waveHeight + ripple;
          }
        }
        waveGeometry.attributes.position.needsUpdate = true;
      }

      // -------------------------------------------------------------
      // 2. Animate Neural Constellation (Floating particles + proximity lines + cursor field)
      // -------------------------------------------------------------
      if (opacities[1] > 0.02) {
        const posArr = particleGeometry.attributes.position.array as Float32Array;
        const cursorFieldX = targetX * 2.2;
        const cursorFieldY = -targetY * 2.2;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          posArr[i3] += particleVelocities[i].x;
          posArr[i3 + 1] += particleVelocities[i].y;
          posArr[i3 + 2] += particleVelocities[i].z;

          // Interactive subtle magnetic cursor repulsion
          const cdx = posArr[i3] - cursorFieldX;
          const cdy = posArr[i3 + 1] - cursorFieldY;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cDist < 30 && cDist > 0.1) {
            const force = (30 - cDist) * 0.015;
            posArr[i3] += (cdx / cDist) * force;
            posArr[i3 + 1] += (cdy / cDist) * force;
          }

          if (Math.abs(posArr[i3]) > 95) particleVelocities[i].x *= -1;
          if (Math.abs(posArr[i3 + 1]) > 75) particleVelocities[i].y *= -1;
          if (Math.abs(posArr[i3 + 2]) > 60) particleVelocities[i].z *= -1;
        }
        particleGeometry.attributes.position.needsUpdate = true;

        const linePosArr = lineGeometry.attributes.position.array as Float32Array;
        let lineIndex = 0;
        const connectionDist = 24;

        for (let i = 0; i < particleCount && lineIndex < maxLineSegments * 6; i++) {
          const i3 = i * 3;
          const x1 = posArr[i3];
          const y1 = posArr[i3 + 1];
          const z1 = posArr[i3 + 2];

          for (let j = i + 1; j < particleCount && lineIndex < maxLineSegments * 6; j++) {
            const j3 = j * 3;
            const dx = x1 - posArr[j3];
            const dy = y1 - posArr[j3 + 1];
            const dz = z1 - posArr[j3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < connectionDist) {
              linePosArr[lineIndex++] = x1;
              linePosArr[lineIndex++] = y1;
              linePosArr[lineIndex++] = z1;
              linePosArr[lineIndex++] = posArr[j3];
              linePosArr[lineIndex++] = posArr[j3 + 1];
              linePosArr[lineIndex++] = posArr[j3 + 2];
            }
          }
        }
        for (let i = lineIndex; i < maxLineSegments * 6; i++) {
          linePosArr[i] = 0;
        }
        lineGeometry.attributes.position.needsUpdate = true;

        neuralCoreMesh.rotation.x += 0.008;
        neuralCoreMesh.rotation.y += 0.012;
        const coreScale = 1 + Math.sin(elapsedTime * 2.2) * 0.12;
        neuralCoreMesh.scale.set(coreScale, coreScale, coreScale);
      }

      // -------------------------------------------------------------
      // 3. Animate Hyper-Dimensional Matrix (Rotating platonic solids & gyro gimbals)
      // -------------------------------------------------------------
      if (opacities[2] > 0.02) {
        icosaMesh.rotation.x += 0.006;
        icosaMesh.rotation.y += 0.009;
        coreSphereMesh.rotation.y -= 0.012;

        torusMesh.rotation.x += 0.007;
        torusMesh.rotation.y += 0.01;

        octaMesh.rotation.y += 0.008;
        octaMesh.rotation.z += 0.005;

        gyroMesh1.rotation.x += 0.012;
        gyroMesh1.rotation.y += 0.008;
        gyroMesh2.rotation.y -= 0.016;
        gyroMesh2.rotation.z += 0.01;
      }

      // -------------------------------------------------------------
      // 4. Animate DNA Helix & Quantum Vortex (Double helix twisting + swirling funnel)
      // -------------------------------------------------------------
      if (opacities[3] > 0.02) {
        helixPoints.rotation.y += 0.014;
        helixRungLines.rotation.y += 0.014;

        vortexPoints.rotation.y -= 0.022;
        const vArr = vortexGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < vortexParticlesCount; i++) {
          const i3 = i * 3;
          vArr[i3 + 1] += 0.35;
          if (vArr[i3 + 1] > 40) {
            vArr[i3 + 1] = -40;
          }
        }
        vortexGeometry.attributes.position.needsUpdate = true;
      }

      // -------------------------------------------------------------
      // 5. Animate Cyber Matrix Data Cascade (Digital rain falling down)
      // -------------------------------------------------------------
      if (opacities[4] > 0.02) {
        const cArr = cascadeGeom.attributes.position.array as Float32Array;
        for (let c = 0; c < cascadeCount; c++) {
          const c3 = c * 3;
          cArr[c3 + 1] -= cascadeSpeeds[c];
          if (cArr[c3 + 1] < -65) {
            cArr[c3 + 1] = 65;
            cArr[c3] = (Math.random() - 0.5) * 160;
          }
        }
        cascadeGeom.attributes.position.needsUpdate = true;
        cascadeGrid.position.z = (elapsedTime * 6) % 10;
      }

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup WebGL resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      waveGeometry.dispose();
      particleGeometry.dispose();
      lineGeometry.dispose();
      neuralCoreGeo.dispose();
      icosaGeometry.dispose();
      coreSphereGeo.dispose();
      torusGeometry.dispose();
      octaGeometry.dispose();
      gyroGeo1.dispose();
      gyroGeo2.dispose();
      helixGeometry.dispose();
      helixRungGeo.dispose();
      vortexGeometry.dispose();
      cascadeGeom.dispose();
      cascadeGrid.geometry.dispose();
      stardustGeo.dispose();
      polyGeos.forEach((g) => g.dispose());
      renderer.dispose();
    };
  }, []);

  // Update material colors on theme changes
  useEffect(() => {
    const mats = materialsRef.current;
    if (mats.waveMaterial) mats.waveMaterial.color.setHex(themeConfig.particleHex);
    if (mats.pointsMaterial) mats.pointsMaterial.color.setHex(themeConfig.particleHex);
    if (mats.linesMaterial) mats.linesMaterial.color.setHex(themeConfig.particleHex);
    if (mats.neuralCoreMaterial) mats.neuralCoreMaterial.color.setHex(themeConfig.wireframeHex);
    if (mats.wireframeMaterial) mats.wireframeMaterial.color.setHex(themeConfig.wireframeHex);
    if (mats.torusMaterial) mats.torusMaterial.color.setHex(themeConfig.particleHex);
    if (mats.coreSphereMaterial) mats.coreSphereMaterial.color.setHex(themeConfig.particleHex);
    if (mats.gyroMaterial) mats.gyroMaterial.color.setHex(themeConfig.wireframeHex);
    if (mats.helixMaterial) mats.helixMaterial.color.setHex(themeConfig.particleHex);
    if (mats.helixRungMaterial) mats.helixRungMaterial.color.setHex(themeConfig.wireframeHex);
    if (mats.vortexMaterial) mats.vortexMaterial.color.setHex(themeConfig.particleHex);
    if (mats.cascadeMaterial) mats.cascadeMaterial.color.setHex(themeConfig.particleHex);
    if (mats.crystalsMaterial) mats.crystalsMaterial.color.setHex(themeConfig.wireframeHex);
    if (mats.crystalsCoreMaterial) mats.crystalsCoreMaterial.color.setHex(themeConfig.particleHex);
    if (mats.stardustMaterial) mats.stardustMaterial.color.setHex(themeConfig.particleHex);
  }, [theme, themeConfig]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700"
    />
  );
};
