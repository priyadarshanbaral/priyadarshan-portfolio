import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Volume2,
  VolumeX,
  Zap,
  Activity,
  Cpu,
  Camera,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ThreeIntroProps {
  onEnter: () => void;
}

export const ThreeIntro: React.FC<ThreeIntroProps> = ({ onEnter }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isWarping, setIsWarping] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(6);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'closeup' | 'cinematic'>('orbit');
  const [bootLogIndex, setBootLogIndex] = useState<number>(0);

  // Web Audio Context for Procedural Sci-Fi Sound Effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  const BOOT_LOGS = [
    'INITIALIZING QUANTUM KERNEL v4.8...',
    'SYNCING MERN ARCHITECTURE // REACT 19 & NODE.JS...',
    'CONNECTING DISTRIBUTED MICROSERVICES & CLOUD NODES...',
    'DECRYPTING DEVELOPER PROFILE: PRIYADARSHAN BARAL...',
    'ALL SYSTEMS OPERATIONAL // READY FOR QUANTUM WARP',
  ];

  // Procedural Sound Generator using Web Audio API
  const playSound = useCallback(
    (type: 'hum' | 'beep' | 'synapse' | 'warp' | 'burst') => {
      if (!audioEnabled) return;
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;

        if (type === 'beep') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(840, now);
          osc.frequency.setValueAtTime(1260, now + 0.04);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc.start(now);
          osc.stop(now + 0.09);
        } else if (type === 'synapse') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(980, now + 0.12);
          gain.gain.setValueAtTime(0.035, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'warp' || type === 'burst') {
          // Massive Quantum Supernova Riser & Sub-Bass Drop
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          const gain2 = ctx.createGain();

          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);

          // Riser
          osc1.type = 'sawtooth';
          osc1.frequency.setValueAtTime(140, now);
          osc1.frequency.exponentialRampToValueAtTime(1100, now + 0.5);
          gain1.gain.setValueAtTime(0.08, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
          osc1.start(now);
          osc1.stop(now + 0.9);

          // Sub Bass Detonation
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(160, now);
          osc2.frequency.exponentialRampToValueAtTime(32, now + 1.2);
          gain2.gain.setValueAtTime(0.12, now);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc2.start(now);
          osc2.stop(now + 1.2);
        }
      } catch {
        // Fallback gracefully
      }
    },
    [audioEnabled]
  );

  // Trigger Quantum Warp & Transition Sequence
  const isWarpingRef = useRef(false);
  const triggerEnter = useCallback(() => {
    if (isWarpingRef.current) return;
    isWarpingRef.current = true;
    setIsWarping(true);
    playSound('burst');

    // Smooth transition dissolve after supernova burst
    setTimeout(() => {
      onEnter();
    }, 1200);
  }, [onEnter, playSound]);

  // Progressive Boot Telemetry & Countdown Timer
  useEffect(() => {
    if (isPaused || isWarping) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerEnter();
          return 0;
        }
        setBootLogIndex((curr) => Math.min(BOOT_LOGS.length - 1, curr + 1));
        playSound('beep');
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, isWarping, triggerEnter, playSound]);

  // Keyboard Navigation: Enter or Space to warp
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        triggerEnter();
      } else if (e.code === 'KeyC') {
        setCameraMode((prev) => (prev === 'orbit' ? 'closeup' : prev === 'closeup' ? 'cinematic' : 'orbit'));
        playSound('beep');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerEnter, playSound]);

  // -------------------------------------------------------------------------
  // Main Three.js Scene Setup & 60FPS Quantum Animation Loop
  // -------------------------------------------------------------------------
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.009);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    );
    camera.position.set(0, 0, 32);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // 2. High-Tech Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x10b981, 2.8);
    keyLight.position.set(15, 20, 20);
    scene.add(keyLight);

    const cyanLight = new THREE.DirectionalLight(0x06b6d4, 3.0);
    cyanLight.position.set(-18, -12, 15);
    scene.add(cyanLight);

    const coreLight = new THREE.PointLight(0x34d399, 4.5, 45);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Particle Texture Generator
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(52,211,153,0.9)');
      grad.addColorStop(0.65, 'rgba(6,182,212,0.4)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTex = new THREE.CanvasTexture(canvas);

    // =======================================================================
    // 3. CENTRAL 3D QUANTUM NEURAL CORE & GYROSCOPIC ACCELERATOR
    // =======================================================================
    const coreRoot = new THREE.Group();
    scene.add(coreRoot);

    // Layer 1: Radiant Plasma Singularity Core (Inner Sphere)
    const singularityGeo = new THREE.SphereGeometry(2.4, 32, 32);
    const singularityMat = new THREE.MeshBasicMaterial({
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.95,
    });
    const singularityMesh = new THREE.Mesh(singularityGeo, singularityMat);
    coreRoot.add(singularityMesh);

    // Layer 2: Crystalline Polyhedral Quantum Core (Wireframe Icosahedron)
    const icosaGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const icosaMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      wireframe: true,
      metalness: 0.9,
      roughness: 0.15,
    });
    const icosaMesh = new THREE.Mesh(icosaGeo, icosaMat);
    coreRoot.add(icosaMesh);

    // Layer 3: Concentric Gyroscopic Accelerator Ring 1 (X-Axis)
    const gyroRing1Geo = new THREE.TorusGeometry(6.6, 0.22, 16, 80);
    const gyroRing1Mat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
    });
    const gyroRing1 = new THREE.Mesh(gyroRing1Geo, gyroRing1Mat);
    coreRoot.add(gyroRing1);

    // Layer 4: Concentric Gyroscopic Accelerator Ring 2 (Y-Axis)
    const gyroRing2Geo = new THREE.TorusGeometry(8.5, 0.2, 16, 80);
    const gyroRing2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
    });
    const gyroRing2 = new THREE.Mesh(gyroRing2Geo, gyroRing2Mat);
    coreRoot.add(gyroRing2);

    // Layer 5: Concentric Gyroscopic Outer Stasis Gate (Z-Axis)
    const gyroRing3Geo = new THREE.TorusGeometry(10.8, 0.18, 16, 96);
    const gyroRing3Mat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
    });
    const gyroRing3 = new THREE.Mesh(gyroRing3Geo, gyroRing3Mat);
    coreRoot.add(gyroRing3);

    // Outer Polyhedron Cage (Dodecahedron Shell)
    const dodecaGeo = new THREE.DodecahedronGeometry(13.5, 0);
    const dodecaMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const dodecaMesh = new THREE.Mesh(dodecaGeo, dodecaMat);
    coreRoot.add(dodecaMesh);

    // =======================================================================
    // 4. 3D ORBITAL QUANTUM SATELLITES WITH LASER CONDUITS
    // =======================================================================
    const satelliteCount = 6;
    const satellites: {
      group: THREE.Group;
      angle: number;
      speed: number;
      radius: number;
      orbitInclination: number;
    }[] = [];

    const satGeo = new THREE.OctahedronGeometry(0.7, 0);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const satCoreMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });

    // Laser conduits connecting satellites to the core
    const laserGeo = new THREE.BufferGeometry();
    const laserPositions = new Float32Array(satelliteCount * 6);
    laserGeo.setAttribute('position', new THREE.BufferAttribute(laserPositions, 3));
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const laserMesh = new THREE.LineSegments(laserGeo, laserMat);
    coreRoot.add(laserMesh);

    for (let i = 0; i < satelliteCount; i++) {
      const satGroup = new THREE.Group();
      const satWire = new THREE.Mesh(satGeo, satMat);
      const satCore = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), satCoreMat);
      satGroup.add(satWire);
      satGroup.add(satCore);
      coreRoot.add(satGroup);

      satellites.push({
        group: satGroup,
        angle: (i / satelliteCount) * Math.PI * 2,
        speed: 0.8 + (i % 3) * 0.35,
        radius: 11.5 + (i % 2) * 2.5,
        orbitInclination: (i * 0.45) - 0.9,
      });
    }

    // =======================================================================
    // 5. 3D NEURAL SYNAPSE PARTICLE FIELD (DYNAMIC GRAVITATIONAL VORTEX)
    // =======================================================================
    const particleCount = 480;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];
    const particleBasePos: { x: number; y: number; z: number }[] = [];

    for (let p = 0; p < particleCount; p++) {
      const p3 = p * 3;
      const phi = Math.acos(-1 + (2 * p) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const radius = 9 + Math.random() * 16;

      const x = Math.cos(theta) * Math.sin(phi) * radius;
      const y = Math.sin(theta) * Math.sin(phi) * radius;
      const z = Math.cos(phi) * radius;

      particlePositions[p3] = x;
      particlePositions[p3 + 1] = y;
      particlePositions[p3 + 2] = z;

      particleBasePos.push({ x, y, z });
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.04,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 2.2,
      map: particleTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Neural Proximity Lines
    const maxLines = 140;
    const linePosArr = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePosArr, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const synapseLineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(synapseLineMesh);

    // Ambient Warp Stardust Field
    const stardustCount = 350;
    const stardustPositions = new Float32Array(stardustCount * 3);
    for (let s = 0; s < stardustCount; s++) {
      stardustPositions[s * 3] = (Math.random() - 0.5) * 120;
      stardustPositions[s * 3 + 1] = (Math.random() - 0.5) * 90;
      stardustPositions[s * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    const stardustGeo = new THREE.BufferGeometry();
    stardustGeo.setAttribute('position', new THREE.BufferAttribute(stardustPositions, 3));
    const stardustMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.4,
      map: particleTex,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stardustPoints = new THREE.Points(stardustGeo, stardustMat);
    scene.add(stardustPoints);

    // =======================================================================
    // 6. QUANTUM SUPERNOVA EXPANSION PARTICLES (DETONATION BURST)
    // =======================================================================
    const burstCount = 500;
    const burstPositions = new Float32Array(burstCount * 3);
    const burstVelocities = new Float32Array(burstCount * 3);
    for (let b = 0; b < burstCount; b++) {
      burstPositions[b * 3] = 0;
      burstPositions[b * 3 + 1] = 0;
      burstPositions[b * 3 + 2] = 0;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const spd = 25 + Math.random() * 50;

      burstVelocities[b * 3] = Math.sin(phi) * Math.cos(theta) * spd;
      burstVelocities[b * 3 + 1] = Math.sin(phi) * Math.sin(theta) * spd;
      burstVelocities[b * 3 + 2] = Math.cos(phi) * spd;
    }
    const burstGeo = new THREE.BufferGeometry();
    burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3));
    const burstMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 3.2,
      map: particleTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const burstSystem = new THREE.Points(burstGeo, burstMat);
    scene.add(burstSystem);

    // =======================================================================
    // 7. MOUSE INTERACTION & 3D GYRO-TILT PHYSICS
    // =======================================================================
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW;
      mouseY = (e.clientY - halfH) / halfH;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // =======================================================================
    // 8. 60FPS TICK & QUANTUM RENDER LOOP
    // =======================================================================
    let animId: number;
    const clock = new THREE.Clock();
    let frameCounter = 0;
    let lastFpsTime = performance.now();
    let burstAge = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // FPS tracking
      frameCounter++;
      const now = performance.now();
      if (now - lastFpsTime >= 500) {
        setFps(Math.round((frameCounter * 1000) / (now - lastFpsTime)));
        frameCounter = 0;
        lastFpsTime = now;
      }

      // Gyroscopic tilt towards cursor
      targetRotY += (mouseX * 0.85 - targetRotY) * 0.05;
      targetRotX += (mouseY * 0.65 - targetRotX) * 0.05;

      coreRoot.rotation.y = targetRotY + elapsed * 0.25;
      coreRoot.rotation.x = targetRotX;

      // -------------------------------------------------------------
      // 1. Gyroscopic Ring Counter-Rotations
      // -------------------------------------------------------------
      const speedMultiplier = isWarpingRef.current ? 7.5 : 1.0;

      gyroRing1.rotation.x += delta * 1.8 * speedMultiplier;
      gyroRing1.rotation.y += delta * 0.9 * speedMultiplier;

      gyroRing2.rotation.y -= delta * 2.2 * speedMultiplier;
      gyroRing2.rotation.z += delta * 1.2 * speedMultiplier;

      gyroRing3.rotation.z += delta * 1.4 * speedMultiplier;
      gyroRing3.rotation.x -= delta * 0.8 * speedMultiplier;

      icosaMesh.rotation.y += delta * 0.8 * speedMultiplier;
      icosaMesh.rotation.z += delta * 0.5 * speedMultiplier;

      dodecaMesh.rotation.y -= delta * 0.3 * speedMultiplier;
      dodecaMesh.rotation.x += delta * 0.2 * speedMultiplier;

      // Singularity core pulse
      const corePulse = 1 + Math.sin(elapsed * 5) * 0.18;
      singularityMesh.scale.set(corePulse, corePulse, corePulse);

      // -------------------------------------------------------------
      // 2. Animate Orbital Satellites & Dynamic Laser Conduits
      // -------------------------------------------------------------
      const laserArr = laserGeo.attributes.position.array as Float32Array;

      satellites.forEach((sat, sIdx) => {
        sat.angle += delta * sat.speed * (isWarpingRef.current ? 4.5 : 1.0);
        const sx = Math.cos(sat.angle) * sat.radius;
        const sy = Math.sin(sat.angle) * Math.sin(sat.orbitInclination) * sat.radius;
        const sz = Math.sin(sat.angle) * Math.cos(sat.orbitInclination) * sat.radius;

        sat.group.position.set(sx, sy, sz);
        sat.group.rotation.x += 0.02;
        sat.group.rotation.y += 0.03;

        // Connect laser line from core (0,0,0) to satellite
        const lIdx = sIdx * 6;
        laserArr[lIdx] = 0;
        laserArr[lIdx + 1] = 0;
        laserArr[lIdx + 2] = 0;
        laserArr[lIdx + 3] = sx;
        laserArr[lIdx + 4] = sy;
        laserArr[lIdx + 5] = sz;
      });
      laserGeo.attributes.position.needsUpdate = true;

      // -------------------------------------------------------------
      // 3. Neural Synapse Particles & Gravity Ripple
      // -------------------------------------------------------------
      const pArr = particleGeometry.attributes.position.array as Float32Array;
      for (let p = 0; p < particleCount; p++) {
        const p3 = p * 3;
        // Orbit around Y
        const cosO = Math.cos(0.008);
        const sinO = Math.sin(0.008);
        const px = pArr[p3];
        const pz = pArr[p3 + 2];
        pArr[p3] = px * cosO - pz * sinO;
        pArr[p3 + 2] = px * sinO + pz * cosO;

        // Vertical harmonic undulation
        pArr[p3 + 1] += Math.sin(elapsed * 2 + p) * 0.03;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Dynamic Proximity Lines between Synapse Nodes
      const lineArray = lineGeo.attributes.position.array as Float32Array;
      let lineIdx = 0;
      const connectDist = 5.2;

      for (let i = 0; i < particleCount && lineIdx < maxLines * 6; i += 3) {
        const i3 = i * 3;
        const x1 = pArr[i3];
        const y1 = pArr[i3 + 1];
        const z1 = pArr[i3 + 2];

        for (let j = i + 1; j < particleCount && lineIdx < maxLines * 6; j += 4) {
          const j3 = j * 3;
          const dx = x1 - pArr[j3];
          const dy = y1 - pArr[j3 + 1];
          const dz = z1 - pArr[j3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectDist) {
            lineArray[lineIdx++] = x1;
            lineArray[lineIdx++] = y1;
            lineArray[lineIdx++] = z1;
            lineArray[lineIdx++] = pArr[j3];
            lineArray[lineIdx++] = pArr[j3 + 1];
            lineArray[lineIdx++] = pArr[j3 + 2];
          }
        }
      }
      for (let k = lineIdx; k < maxLines * 6; k++) {
        lineArray[k] = 0;
      }
      lineGeo.attributes.position.needsUpdate = true;

      // Rotate stardust background
      stardustPoints.rotation.y = elapsed * 0.02;

      // -------------------------------------------------------------
      // 4. Quantum Warp / Supernova Detonation Sequence
      // -------------------------------------------------------------
      if (isWarpingRef.current) {
        burstAge += delta;
        burstMat.opacity = Math.max(0, 1 - burstAge * 0.9);
        const bPos = burstGeo.attributes.position.array as Float32Array;
        for (let b = 0; b < burstCount; b++) {
          bPos[b * 3] += burstVelocities[b * 3] * delta;
          bPos[b * 3 + 1] += burstVelocities[b * 3 + 1] * delta;
          bPos[b * 3 + 2] += burstVelocities[b * 3 + 2] * delta;
        }
        burstGeo.attributes.position.needsUpdate = true;

        // Core implodes then expands rapidly
        coreRoot.scale.multiplyScalar(1.045);
        camera.fov = THREE.MathUtils.lerp(camera.fov, 110, 0.08);
        camera.updateProjectionMatrix();
      }

      // Camera view logic
      if (!isWarpingRef.current) {
        if (cameraMode === 'orbit') {
          camera.position.x = Math.sin(elapsed * 0.25) * 4;
          camera.position.y = Math.cos(elapsed * 0.2) * 2;
          camera.position.z = 32;
          camera.lookAt(0, 0, 0);
        } else if (cameraMode === 'closeup') {
          camera.position.set(0, 0, 15);
          camera.lookAt(0, 0, 0);
        } else if (cameraMode === 'cinematic') {
          camera.position.set(Math.cos(elapsed * 0.4) * 26, 8, Math.sin(elapsed * 0.4) * 26);
          camera.lookAt(0, 0, 0);
        }
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      singularityGeo.dispose();
      icosaGeo.dispose();
      gyroRing1Geo.dispose();
      gyroRing2Geo.dispose();
      gyroRing3Geo.dispose();
      dodecaGeo.dispose();
      satGeo.dispose();
      particleGeometry.dispose();
      lineGeo.dispose();
      stardustGeo.dispose();
      burstGeo.dispose();
      mount.innerHTML = '';
    };
  }, [cameraMode]);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 select-none overflow-hidden font-sans">
      {/* 3D WebGL Canvas Layer */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Cybernetic Radial Vignette & Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.75)_75%,rgba(2,6,23,0.98)_100%)]" />

      {/* Quantum Supernova White-Emerald Detonation Flash */}
      <div
        className={`absolute inset-0 pointer-events-none bg-gradient-to-tr from-emerald-300 via-cyan-200 to-white transition-opacity duration-700 ease-out z-40 ${
          isWarping ? 'opacity-95' : 'opacity-0'
        }`}
      />

      {/* ------------------------------------------------------------- */}
      {/* Top Header: System Status & Diagnostic Telemetry               */}
      {/* ------------------------------------------------------------- */}
      <header className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between pointer-events-auto z-30">
        {/* Left: Quantum Core Telemetry */}
        <div className="flex items-center gap-3 bg-neutral-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-neutral-800/90 shadow-2xl">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="font-mono text-xs">
              <span className="text-emerald-400 font-extrabold text-sm">GENESIS CORE</span>
              <span className="text-neutral-400 ml-1.5 text-[10px] hidden sm:inline">v4.8</span>
            </div>
          </div>
          <div className="h-3.5 w-[1px] bg-neutral-800" />
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">{fps} FPS</span>
          </div>
          <div className="h-3.5 w-[1px] bg-neutral-800 hidden md:block" />
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>MERN Full-Stack Engine</span>
          </div>
        </div>

        {/* Right: Camera Angle & Audio Controls */}
        <div className="flex items-center gap-2">
          {/* Camera View Switcher */}
          <button
            onClick={() => {
              setCameraMode((prev) => (prev === 'orbit' ? 'closeup' : prev === 'closeup' ? 'cinematic' : 'orbit'));
              playSound('beep');
            }}
            className="px-3 py-1.5 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 text-neutral-300 hover:text-emerald-400 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
            title="Switch 3D Viewpoint [C]"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span className="capitalize hidden sm:inline">{cameraMode} View</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => setAudioEnabled((a) => !a)}
            className="p-2 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 text-neutral-300 hover:text-emerald-400 transition-colors cursor-pointer shadow-lg"
            title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>

          {/* Instant Skip to Portfolio */}
          <button
            onClick={triggerEnter}
            className="px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-medium transition-all cursor-pointer shadow-lg flex items-center gap-1"
            title="Skip directly to portfolio"
          >
            <span>Skip</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* Live System Diagnostics / Boot Console Feed (Left HUD)         */}
      {/* ------------------------------------------------------------- */}
      <aside aria-label="System diagnostic console" className="absolute left-6 top-24 hidden lg:flex flex-col gap-1.5 max-w-sm pointer-events-none z-30 font-mono text-[11px] text-neutral-400">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
          <Terminal className="w-3.5 h-3.5" />
          <span>DIAGNOSTIC TELEMETRY</span>
        </div>
        {BOOT_LOGS.map((log, idx) => (
          <div
            key={idx}
            className={`transition-opacity duration-300 flex items-center gap-2 ${
              idx <= bootLogIndex ? 'opacity-90 text-neutral-300' : 'opacity-25 text-neutral-600'
            }`}
          >
            <span className="text-emerald-500">{idx <= bootLogIndex ? '✓' : '›'}</span>
            <span>{log}</span>
          </div>
        ))}
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* Bottom Cinematic Identity, Countdown & Click-to-Enter          */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute bottom-6 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col items-center text-center z-30 pointer-events-auto">
        {/* Name & Title Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/90 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-2 shadow-xl backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-emerald-400 animate-spin-slow" />
          <span>{PERSONAL_INFO.name} • {PERSONAL_INFO.title}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight drop-shadow-md">
          Initializing <span className="text-emerald-400">Quantum Portfolio</span>
        </h1>

        <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mt-1 hidden sm:block">
          Interactive 3D WebGL • Full Stack Engineering • Microservices & Distributed Systems
        </p>

        {/* Dynamic Countdown & Warp Trigger Button */}
        <div
          onClick={triggerEnter}
          className="flex flex-col items-center gap-2 w-full max-w-xs sm:max-w-sm cursor-pointer group select-none mt-3"
          title="Click anywhere or press Enter/Space to enter portfolio immediately"
        >
          <div className="w-full flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
            <span className="flex items-center gap-1.5 text-emerald-400 group-hover:text-emerald-300 transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isPaused ? 'Paused' : `Quantum singularity boot in ${countdown}s`}</span>
            </span>
            <span className="text-neutral-400 group-hover:text-neutral-200 transition-colors font-medium">
              [Click to Enter]
            </span>
          </div>

          <div className="w-full h-1.5 bg-neutral-900/90 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-1000 ease-linear shadow-[0_0_14px_rgba(52,211,153,0.9)]"
              style={{ width: `${((6 - countdown) / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
