import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ThreeCanvas from './ThreeCanvas';
import MoonDisk from './MoonDisk';
import { Button, Panel, Slider, Toggle, Badge } from './UI';
import { cn } from '../utils/cn';
import { computePhase, degToRad, sounds } from '../lib/core';
import {
  Play,
  Pause,
  RotateCcw,
  Camera,
  FastForward,
  StepForward,
  RefreshCw,
  Info,
} from 'lucide-react';

// ---------- Konstanta skala visual (skematis) ----------
const SUN_RADIUS = 4;
const EARTH_ORBIT = 24;
const EARTH_RADIUS = 2.6;
const MOON_ORBIT = 6.5;
const MOON_RADIUS = 0.85;
const AXIS_TILT = 23.5;

// ---------- Tekstur prosedural ----------
function makeEarthTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#1e6fb8');
  g.addColorStop(0.5, '#2b8fd6');
  g.addColorStop(1, '#1e6fb8');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = '#3f9e4d';
  const blobs: [number, number, number, number][] = [
    [80, 70, 55, 35], [150, 100, 40, 50], [250, 60, 60, 30],
    [330, 110, 45, 40], [430, 80, 50, 35], [200, 170, 45, 25],
    [380, 180, 40, 22], [60, 160, 35, 20],
  ];
  for (const [x, y, rx, ry] of blobs) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#eaf4fb';
  ctx.fillRect(0, 0, 512, 18);
  ctx.fillRect(0, 238, 512, 18);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeMoonTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#9a9a9a';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = 2 + Math.random() * 10;
    ctx.fillStyle = `rgba(70,70,70,${0.25 + Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(200,200,200,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeGlowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(255,230,140,1)');
  g.addColorStop(0.25, 'rgba(255,190,70,0.7)');
  g.addColorStop(0.6, 'rgba(255,150,40,0.25)');
  g.addColorStop(1, 'rgba(255,140,30,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function makeLabel(text: string, color = '#ffffff'): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.font = 'bold 30px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillText(text, 128, 32);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(7, 1.75, 1);
  return sprite;
}

function makeOrbitRing(radius: number, color: number): THREE.LineLoop {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, -Math.sin(a) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 });
  return new THREE.LineLoop(geo, mat);
}

function makeArrow(color: number): THREE.Mesh {
  const geo = new THREE.ConeGeometry(0.4, 1.2, 8);
  const mat = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh(geo, mat);
}

function makeHelperLine(color: number) {
  const group = new THREE.Group();
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(),
    new THREE.Vector3(),
  ]);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.95 });
  const line = new THREE.Line(geo, mat);
  group.add(line);
  const coneGeo = new THREE.ConeGeometry(0.35, 1.0, 8);
  const coneMat = new THREE.MeshBasicMaterial({ color });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  group.add(cone);
  const update = (from: THREE.Vector3, to: THREE.Vector3) => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    pos.setXYZ(0, from.x, from.y, from.z);
    pos.setXYZ(1, to.x, to.y, to.z);
    pos.needsUpdate = true;
    geo.computeBoundingSphere();
    const dir = to.clone().sub(from).normalize();
    cone.position.copy(to).add(dir.clone().multiplyScalar(-0.5));
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  };
  return { group, update };
}

// ---------- Komponen utama ----------
interface SimState {
  earthAngle: number;
  moonAngle: number;
  earthPlaying: boolean;
  moonPlaying: boolean;
  speed: number;
  showOrbits: boolean;
  showLabels: boolean;
  showAxis: boolean;
  showHelpers: boolean;
  rotateEarth: boolean;
  cycleTarget: number | null;
}

interface DisplayState {
  earthAngle: number;
  moonAngle: number;
  phaseName: string;
  illumination: number;
  day: number;
  elongation: number;
  waxing: boolean;
}

export default function Lab3D() {
  const simRef = useRef<SimState>({
    earthAngle: 0,
    moonAngle: 0,
    earthPlaying: false,
    moonPlaying: false,
    speed: 1,
    showOrbits: true,
    showLabels: true,
    showAxis: true,
    showHelpers: false,
    rotateEarth: true,
    cycleTarget: null,
  });
  const sceneRefs = useRef<Record<string, any>>({});
  const [display, setDisplay] = useState<DisplayState>({
    earthAngle: 0,
    moonAngle: 0,
    phaseName: 'Bulan Baru',
    illumination: 0,
    day: 0,
    elongation: 0,
    waxing: true,
  });
  const [mode, setMode] = useState<'orbital' | 'earth'>('orbital');
  const [speed, setSpeedState] = useState(1);
  const [ui, setUi] = useState({
    earthPlaying: false,
    moonPlaying: false,
    showOrbits: true,
    showLabels: true,
    showAxis: true,
    showHelpers: false,
    rotateEarth: true,
  });

  // Sinkronisasi tampilan dari ref simulasi
  useEffect(() => {
    const id = setInterval(() => {
      const s = simRef.current;
      const eRad = degToRad(s.earthAngle);
      const earthPos = {
        x: Math.cos(eRad) * EARTH_ORBIT,
        y: 0,
        z: -Math.sin(eRad) * EARTH_ORBIT,
      };
      const mRad = degToRad(s.moonAngle);
      const moonPos = {
        x: earthPos.x + Math.cos(mRad) * MOON_ORBIT,
        y: 0,
        z: earthPos.z - Math.sin(mRad) * MOON_ORBIT,
      };
      const phase = computePhase(
        { x: 0, y: 0, z: 0 },
        earthPos,
        moonPos,
        { x: 0, y: 1, z: 0 }
      );
      setDisplay((d) => {
        if (
          Math.abs(d.earthAngle - s.earthAngle) < 0.05 &&
          Math.abs(d.moonAngle - s.moonAngle) < 0.05 &&
          d.phaseName === phase.phaseName
        )
          return d;
        return {
          earthAngle: s.earthAngle,
          moonAngle: s.moonAngle,
          phaseName: phase.phaseName,
          illumination: phase.illumination,
          day: phase.day,
          elongation: phase.elongationUnsigned,
          waxing: phase.waxing,
        };
      });
    }, 100);
    return () => clearInterval(id);
  }, []);

  const onSetup = useCallback(
    ({ scene, camera, controls }: any) => {
      // Pencahayaan
      scene.add(new THREE.AmbientLight(0x334455, 0.7));
      const sunLight = new THREE.PointLight(0xffffff, 3, 0, 0);
      scene.add(sunLight);

      // Matahari
      const sunMesh = new THREE.Mesh(
        new THREE.SphereGeometry(SUN_RADIUS, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffcc33 })
      );
      scene.add(sunMesh);
      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makeGlowTexture(),
          color: 0xffaa33,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      glow.scale.set(20, 20, 1);
      scene.add(glow);
      const sunLabel = makeLabel('Matahari', '#ffd966');
      sunLabel.position.set(0, SUN_RADIUS + 2.5, 0);
      scene.add(sunLabel);

      // Bumi
      const earthGroup = new THREE.Group();
      scene.add(earthGroup);
      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.z = degToRad(AXIS_TILT);
      earthGroup.add(tiltGroup);
      const earthMesh = new THREE.Mesh(
        new THREE.SphereGeometry(EARTH_RADIUS, 48, 48),
        new THREE.MeshStandardMaterial({
          map: makeEarthTexture(),
          roughness: 0.9,
          metalness: 0,
        })
      );
      tiltGroup.add(earthMesh);
      const axisLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -EARTH_RADIUS * 1.7, 0),
          new THREE.Vector3(0, EARTH_RADIUS * 1.7, 0),
        ]),
        new THREE.LineBasicMaterial({ color: 0xff6b6b })
      );
      tiltGroup.add(axisLine);
      const earthLabel = makeLabel('Bumi', '#7fd4ff');
      earthLabel.position.set(0, EARTH_RADIUS + 2, 0);
      earthGroup.add(earthLabel);

      // Orbit Bulan (anak earthGroup)
      const moonOrbitRing = makeOrbitRing(MOON_ORBIT, 0x67e8f9);
      earthGroup.add(moonOrbitRing);
      const moonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(MOON_RADIUS, 32, 32),
        new THREE.MeshStandardMaterial({
          map: makeMoonTexture(),
          roughness: 1,
          metalness: 0,
        })
      );
      earthGroup.add(moonMesh);
      const moonLabel = makeLabel('Bulan', '#e5e7eb');
      moonLabel.position.set(0, MOON_RADIUS + 1.3, 0);
      moonMesh.add(moonLabel);

      // Orbit Bumi
      const earthOrbitRing = makeOrbitRing(EARTH_ORBIT, 0x94a3b8);
      scene.add(earthOrbitRing);

      // Anak panah arah
      const earthArrow = makeArrow(0x94a3b8);
      scene.add(earthArrow);
      const moonArrow = makeArrow(0x67e8f9);
      earthGroup.add(moonArrow);

      // Garis bantu
      const sunEarthLine = makeHelperLine(0xfbbf24);
      scene.add(sunEarthLine.group);
      const earthMoonLine = makeHelperLine(0x22d3ee);
      scene.add(earthMoonLine.group);

      sceneRefs.current = {
        camera,
        controls,
        earthMesh,
        moonMesh,
        earthGroup,
        earthOrbitRing,
        moonOrbitRing,
        earthArrow,
        moonArrow,
        sunEarthLine,
        earthMoonLine,
        tiltGroup,
        sunLabel,
        earthLabel,
        moonLabel,
      };

      const updatePositions = () => {
        const st = simRef.current;
        const eRad = degToRad(st.earthAngle);
        earthGroup.position.set(
          Math.cos(eRad) * EARTH_ORBIT,
          0,
          -Math.sin(eRad) * EARTH_ORBIT
        );
        const mRad = degToRad(st.moonAngle);
        moonMesh.position.set(
          Math.cos(mRad) * MOON_ORBIT,
          0,
          -Math.sin(mRad) * MOON_ORBIT
        );
        // anak panah
        earthArrow.position.set(
          Math.cos(eRad) * EARTH_ORBIT,
          0,
          -Math.sin(eRad) * EARTH_ORBIT
        );
        earthArrow.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(-Math.sin(eRad), 0, -Math.cos(eRad))
        );
        moonArrow.position.set(
          Math.cos(mRad) * MOON_ORBIT,
          0,
          -Math.sin(mRad) * MOON_ORBIT
        );
        moonArrow.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(-Math.sin(mRad), 0, -Math.cos(mRad))
        );
        // garis bantu
        const earthPos = earthGroup.position.clone();
        const moonPos = earthPos.clone().add(moonMesh.position);
        sunEarthLine.update(new THREE.Vector3(0, 0, 0), earthPos);
        earthMoonLine.update(earthPos, moonPos);
        // visibilitas
        earthOrbitRing.visible = st.showOrbits;
        moonOrbitRing.visible = st.showOrbits;
        earthArrow.visible = st.showOrbits;
        moonArrow.visible = st.showOrbits;
        axisLine.visible = st.showAxis;
        sunLabel.visible = st.showLabels;
        earthLabel.visible = st.showLabels;
        moonLabel.visible = st.showLabels;
        sunEarthLine.group.visible = st.showHelpers;
        earthMoonLine.group.visible = st.showHelpers;
      };

      updatePositions();

      const onFrame = (dt: number) => {
        const st = simRef.current;
        if (st.earthPlaying) {
          st.earthAngle = (st.earthAngle + dt * 3 * st.speed) % 360;
        }
        if (st.moonPlaying) {
          st.moonAngle += dt * 18 * st.speed;
          if (st.cycleTarget != null) {
            if (st.moonAngle >= st.cycleTarget) {
              st.moonAngle = st.cycleTarget % 360;
              st.cycleTarget = null;
              st.moonPlaying = false;
            }
          } else {
            st.moonAngle = st.moonAngle % 360;
          }
        }
        if (st.rotateEarth) earthMesh.rotation.y += dt * 0.6;
        updatePositions();
      };

      return { onFrame, dispose: () => {} };
    },
    []
  );

  // ---------- Handler kontrol ----------
  const setEarthAngle = (v: number) => {
    simRef.current.earthAngle = v;
    simRef.current.earthPlaying = false;
    setDisplay((d) => ({ ...d, earthAngle: v }));
  };
  const setMoonAngle = (v: number) => {
    simRef.current.moonAngle = v;
    simRef.current.moonPlaying = false;
    simRef.current.cycleTarget = null;
    setDisplay((d) => ({ ...d, moonAngle: v }));
  };
  const toggleEarth = () => {
    simRef.current.earthPlaying = !simRef.current.earthPlaying;
    setUi((u) => ({ ...u, earthPlaying: simRef.current.earthPlaying }));
    sounds.click();
  };
  const toggleMoon = () => {
    simRef.current.moonPlaying = !simRef.current.moonPlaying;
    simRef.current.cycleTarget = null;
    setUi((u) => ({ ...u, moonPlaying: simRef.current.moonPlaying }));
    sounds.click();
  };
  const toggleAll = () => {
    const s = simRef.current;
    const any = s.earthPlaying || s.moonPlaying;
    s.earthPlaying = !any;
    s.moonPlaying = !any;
    s.cycleTarget = null;
    setUi((u) => ({
      ...u,
      earthPlaying: s.earthPlaying,
      moonPlaying: s.moonPlaying,
    }));
    sounds.click();
  };
  const changeSpeed = (v: number) => {
    simRef.current.speed = v;
    setSpeedState(v);
    sounds.click();
  };
  const resetEarth = () => {
    simRef.current.earthAngle = 0;
    simRef.current.earthPlaying = false;
    setDisplay((d) => ({ ...d, earthAngle: 0 }));
    sounds.click();
  };
  const resetMoon = () => {
    simRef.current.moonAngle = 0;
    simRef.current.moonPlaying = false;
    simRef.current.cycleTarget = null;
    setDisplay((d) => ({ ...d, moonAngle: 0 }));
    sounds.click();
  };
  const resetAll = () => {
    simRef.current.earthAngle = 0;
    simRef.current.moonAngle = 0;
    simRef.current.earthPlaying = false;
    simRef.current.moonPlaying = false;
    simRef.current.cycleTarget = null;
    setDisplay((d) => ({ ...d, earthAngle: 0, moonAngle: 0 }));
    sounds.click();
  };
  const resetCamera = () => {
    const { camera, controls } = sceneRefs.current;
    if (camera) camera.position.set(0, 34, 52);
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
    sounds.click();
  };
  const stepPhase = () => {
    const s = simRef.current;
    const elong = (((s.moonAngle - s.earthAngle - 180) % 360) + 360) % 360;
    const phaseIndex = Math.round(elong / 45) % 8;
    const nextIndex = (phaseIndex + 1) % 8;
    s.moonAngle = (s.earthAngle + 180 + nextIndex * 45) % 360;
    s.moonPlaying = false;
    s.cycleTarget = null;
    sounds.phase();
  };
  const fullCycle = () => {
    const s = simRef.current;
    s.cycleTarget = s.moonAngle + 360;
    s.moonPlaying = true;
    sounds.click();
  };
  const toggleFlag = (
    key:
      | 'showOrbits'
      | 'showLabels'
      | 'showAxis'
      | 'showHelpers'
      | 'rotateEarth'
  ) => {
    const st = simRef.current;
    if (key === 'showOrbits') st.showOrbits = !st.showOrbits;
    else if (key === 'showLabels') st.showLabels = !st.showLabels;
    else if (key === 'showAxis') st.showAxis = !st.showAxis;
    else if (key === 'showHelpers') st.showHelpers = !st.showHelpers;
    else if (key === 'rotateEarth') st.rotateEarth = !st.rotateEarth;
    setUi((u) => ({ ...u, [key]: simRef.current[key] }));
    sounds.click();
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Area 3D */}
      <div className="relative h-[55vh] lg:h-[calc(100vh-10rem)] lg:flex-1 lg:min-h-0 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950/60">
        <ThreeCanvas className="absolute inset-0" onSetup={onSetup} />
        <div className="absolute top-3 left-3">
          <Badge tone="amber">Model skematis — tidak berskala</Badge>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={() => setMode(mode === 'orbital' ? 'earth' : 'orbital')}
            className="rounded-lg bg-slate-800/80 border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            {mode === 'orbital' ? 'Mode Orbit' : 'Dari Bumi'}
          </button>
        </div>
        {mode === 'earth' && (
          <div className="absolute bottom-3 left-3 rounded-xl bg-slate-900/85 border border-slate-700 p-3 backdrop-blur-sm">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-300">
              Pandangan dari Bumi
            </div>
            <MoonDisk
              elongationUnsigned={display.elongation}
              waxing={display.waxing}
              size={150}
            />
            <div className="mt-1 text-center text-sm font-bold text-amber-300">
              {display.phaseName}
            </div>
          </div>
        )}
      </div>

      {/* Panel kontrol */}
      <div className="w-full lg:w-80 space-y-3 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto pr-1">
        {/* Mode & kecepatan */}
        <Panel title="Mode & Kecepatan">
          <div className="mb-3">
            <div className="mb-1 text-xs text-slate-400">Mode tampilan</div>
            <div className="flex rounded-lg bg-slate-800 p-0.5 gap-0.5">
              {(['orbital', 'earth'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    sounds.click();
                  }}
                  className={cn(
                    'flex-1 px-2 py-1.5 rounded-md text-xs font-semibold transition',
                    mode === m
                      ? 'bg-cyan-500 text-slate-900'
                      : 'text-slate-300 hover:bg-slate-700'
                  )}
                >
                  {m === 'orbital' ? 'Model Orbit' : 'Dari Bumi'}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <div className="mb-1 text-xs text-slate-400">Kecepatan animasi</div>
            <div className="flex rounded-lg bg-slate-800 p-0.5 gap-0.5">
              {[0.25, 0.5, 1, 2].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => changeSpeed(v)}
                  className={cn(
                    'flex-1 px-2 py-1.5 rounded-md text-xs font-semibold transition',
                    speed === v
                      ? 'bg-amber-400 text-slate-900'
                      : 'text-slate-300 hover:bg-slate-700'
                  )}
                >
                  {v}×
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Toggle checked={ui.showOrbits} onChange={() => toggleFlag('showOrbits')} label="Orbit" />
            <Toggle checked={ui.showLabels} onChange={() => toggleFlag('showLabels')} label="Label" />
            <Toggle checked={ui.showAxis} onChange={() => toggleFlag('showAxis')} label="Poros" />
            <Toggle checked={ui.rotateEarth} onChange={() => toggleFlag('rotateEarth')} label="Putar Bumi" />
            <Toggle checked={ui.showHelpers} onChange={() => toggleFlag('showHelpers')} label="Garis Bantu" />
          </div>
        </Panel>

        {/* Orbit Bumi */}
        <Panel title="Orbit Bumi (Revolusi)">
          <Slider
            label="Sudut orbit Bumi"
            value={Math.round(display.earthAngle)}
            min={0}
            max={360}
            onChange={setEarthAngle}
          />
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="secondary" onClick={toggleEarth}>
              {ui.earthPlaying ? <Pause size={14} /> : <Play size={14} />}
              {ui.earthPlaying ? 'Jeda' : 'Putar'}
            </Button>
            <Button size="sm" variant="ghost" onClick={resetEarth}>
              <RotateCcw size={14} /> Reset
            </Button>
          </div>
        </Panel>

        {/* Orbit Bulan */}
        <Panel title="Orbit Bulan">
          <Slider
            label="Sudut orbit Bulan"
            value={Math.round(display.moonAngle)}
            min={0}
            max={360}
            onChange={setMoonAngle}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={toggleMoon}>
              {ui.moonPlaying ? <Pause size={14} /> : <Play size={14} />}
              {ui.moonPlaying ? 'Jeda' : 'Putar'}
            </Button>
            <Button size="sm" variant="ghost" onClick={resetMoon}>
              <RotateCcw size={14} /> Reset
            </Button>
            <Button size="sm" variant="ghost" onClick={stepPhase}>
              <StepForward size={14} /> 1 Fase
            </Button>
            <Button size="sm" variant="ghost" onClick={fullCycle}>
              <FastForward size={14} /> 1 Siklus
            </Button>
          </div>
        </Panel>

        {/* Aksi global */}
        <Panel title="Aksi">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="primary" onClick={toggleAll}>
              {ui.earthPlaying || ui.moonPlaying ? (
                <>
                  <Pause size={14} /> Jeda Semua
                </>
              ) : (
                <>
                  <Play size={14} /> Putar Semua
                </>
              )}
            </Button>
            <Button size="sm" variant="danger" onClick={resetAll}>
              <RefreshCw size={14} /> Reset Orbit
            </Button>
            <Button size="sm" variant="ghost" onClick={resetCamera}>
              <Camera size={14} /> Reset Kamera
            </Button>
          </div>
        </Panel>

        {/* Info fase */}
        <Panel title="Fase Bulan (dari geometri)">
          <div className="flex items-center gap-3">
            <MoonDisk
              elongationUnsigned={display.elongation}
              waxing={display.waxing}
              size={92}
            />
            <div className="flex-1 text-sm">
              <div className="text-lg font-bold text-amber-300">
                {display.phaseName}
              </div>
              <div className="text-xs text-slate-400">
                {display.waxing ? 'Sabit mengembang' : 'Sabit mengecil'}
              </div>
              <div className="mt-1 text-xs text-slate-300">
                Iluminasi:{' '}
                <span className="font-mono text-cyan-300">
                  {Math.round(display.illumination * 100)}%
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Hari siklus:{' '}
                <span className="font-mono text-cyan-300">
                  {display.day.toFixed(1).replace('.', ',')}
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Sudut memanjang:{' '}
                <span className="font-mono text-cyan-300">
                  {Math.round(display.elongation)}°
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-800/60 p-2">
              <div className="text-slate-400">Sudut Bumi</div>
              <div className="font-mono text-cyan-300">
                {Math.round(display.earthAngle)}°
              </div>
            </div>
            <div className="rounded-lg bg-slate-800/60 p-2">
              <div className="text-slate-400">Sudut Bulan</div>
              <div className="font-mono text-cyan-300">
                {Math.round(display.moonAngle)}°
              </div>
            </div>
          </div>
        </Panel>

        <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 text-[11px] text-slate-400">
          <Info size={12} className="mr-1 inline" />
          Kecepatan animasi tidak sama dengan kecepatan gerak benda langit yang
          sebenarnya. Fase dihitung dari posisi relatif Matahari, Bumi, dan Bulan.
        </div>
      </div>
    </div>
  );
}
