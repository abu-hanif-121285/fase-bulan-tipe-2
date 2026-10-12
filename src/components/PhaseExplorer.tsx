import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ThreeCanvas from './ThreeCanvas';
import MoonDisk from './MoonDisk';
import { Button, Panel, Slider, Toggle, Badge } from './UI';
import { cn } from '../utils/cn';
import {
  computePhase,
  degToRad,
  moonAngleFromDay,
  PHASES,
  SYNODIC_MONTH,
  sounds,
} from '../lib/core';
import {
  makeEarthTexture,
  makeMoonTexture,
  makeGlowTexture,
  makeLabel,
  makeOrbitRing,
  makeHelperLine,
  makeDashedLine,
  makeAngleArc,
  SUN_RADIUS,
  EARTH_RADIUS,
  MOON_RADIUS,
} from './threeUtils';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sun,
  Globe,
  Moon,
  Eye,
  Info,
} from 'lucide-react';

// Skala skematis
const EARTH_ORBIT_R = 26;
const MOON_ORBIT_R = 7;

interface SimState {
  day: number; // 0..29,5
  earthAngle: number; // derajat
  playing: boolean;
  speed: number;
  moveEarth: boolean;
}

interface DisplayState {
  day: number;
  phaseName: string;
  phaseIndex: number;
  illumination: number;
  elongation: number;
  waxing: boolean;
}

export default function PhaseExplorer({
  jumpDay,
  jumpNonce,
}: {
  jumpDay?: number | null;
  jumpNonce?: number;
}) {
  const simRef = useRef<SimState>({
    day: 0,
    earthAngle: 0,
    playing: false,
    speed: 1,
    moveEarth: false,
  });
  const sceneRefs = useRef<Record<string, any>>({});
  const [display, setDisplay] = useState<DisplayState>({
    day: 0,
    phaseName: 'Bulan Baru',
    phaseIndex: 0,
    illumination: 0,
    elongation: 0,
    waxing: true,
  });
  const [day, setDayState] = useState(0);
  const [speed, setSpeedState] = useState(1);
  const [moveEarth, setMoveEarthState] = useState(false);
  const [playing, setPlayingState] = useState(false);

  // Lompat ke hari fase tertentu (dari Materi)
  useEffect(() => {
    if (jumpDay != null) {
      simRef.current.day = jumpDay;
      simRef.current.playing = false;
      setPlayingState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpDay, jumpNonce]);

  // Sinkronisasi tampilan
  useEffect(() => {
    const id = setInterval(() => {
      const s = simRef.current;
      const eRad = degToRad(s.earthAngle);
      const earthPos = {
        x: Math.cos(eRad) * EARTH_ORBIT_R,
        y: 0,
        z: -Math.sin(eRad) * EARTH_ORBIT_R,
      };
      const mWorld = eRad + degToRad(moonAngleFromDay(s.day));
      const moonPos = {
        x: earthPos.x + Math.cos(mWorld) * MOON_ORBIT_R,
        y: 0,
        z: earthPos.z - Math.sin(mWorld) * MOON_ORBIT_R,
      };
      const phase = computePhase(
        { x: 0, y: 0, z: 0 },
        earthPos,
        moonPos,
        { x: 0, y: 1, z: 0 }
      );
      setDisplay((d) => {
        if (
          Math.abs(d.day - s.day) < 0.05 &&
          d.phaseName === phase.phaseName
        )
          return d;
        return {
          day: s.day,
          phaseName: phase.phaseName,
          phaseIndex: phase.phaseIndex,
          illumination: phase.illumination,
          elongation: phase.elongationUnsigned,
          waxing: phase.waxing,
        };
      });
      setDayState(s.day);
      setSpeedState(s.speed);
      setMoveEarthState(s.moveEarth);
    }, 100);
    return () => clearInterval(id);
  }, []);

  const onSetup = useCallback(({ scene }: any) => {
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
    glow.scale.set(22, 22, 1);
    scene.add(glow);
    const sunLabel = makeLabel('Matahari', '#ffd966');
    sunLabel.position.set(0, SUN_RADIUS + 2.5, 0);
    scene.add(sunLabel);

    // Bumi
    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS, 48, 48),
      new THREE.MeshStandardMaterial({
        map: makeEarthTexture(),
        roughness: 0.9,
        metalness: 0,
      })
    );
    scene.add(earthMesh);
    const earthLabel = makeLabel('Bumi', '#7fd4ff');
    scene.add(earthLabel);

    // Orbit Bumi mengelilingi Matahari
    const earthOrbitRing = makeOrbitRing(EARTH_ORBIT_R, 0x94a3b8);
    scene.add(earthOrbitRing);

    // Orbit Bulan
    const moonOrbitRing = makeOrbitRing(MOON_ORBIT_R, 0x67e8f9);
    scene.add(moonOrbitRing);

    // Bulan
    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(MOON_RADIUS, 32, 32),
      new THREE.MeshStandardMaterial({
        map: makeMoonTexture(),
        roughness: 1,
        metalness: 0,
      })
    );
    scene.add(moonMesh);
    const moonLabel = makeLabel('Bulan', '#e5e7eb');
    scene.add(moonLabel);

    // Penanda 8 fase pada orbit Bulan
    const markers: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
      );
      scene.add(m);
      markers.push(m);
    }

    // Garis bantu Matahari -> Bumi
    const sunEarthLine = makeHelperLine(0xfbbf24);
    scene.add(sunEarthLine.group);
    // Garis bantu Bumi -> Bulan
    const earthMoonLine = makeHelperLine(0x22d3ee);
    scene.add(earthMoonLine.group);
    // Garis pandang (Bumi melalui Bulan, diperpanjang)
    const sightLine = makeDashedLine(0xffffff);
    scene.add(sightLine.line);
    // Busur sudut memanjang di Bumi
    const angleArc = makeAngleArc(0xf472b6);
    scene.add(angleArc.group);

    // Kerucut pengamat di Bumi (mengarah ke Bulan)
    const observerCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 1.2, 8),
      new THREE.MeshBasicMaterial({ color: 0xf472b6 })
    );
    scene.add(observerCone);

    sceneRefs.current = {
      earthMesh,
      moonMesh,
      earthOrbitRing,
      moonOrbitRing,
      earthLabel,
      moonLabel,
      sunEarthLine,
      earthMoonLine,
      sightLine,
      angleArc,
      observerCone,
      markers,
    };

    const updatePositions = () => {
      const st = simRef.current;
      const eRad = degToRad(st.earthAngle);
      const earthPos = new THREE.Vector3(
        Math.cos(eRad) * EARTH_ORBIT_R,
        0,
        -Math.sin(eRad) * EARTH_ORBIT_R
      );
      const mWorld = eRad + degToRad(moonAngleFromDay(st.day));
      const moonPos = new THREE.Vector3(
        earthPos.x + Math.cos(mWorld) * MOON_ORBIT_R,
        0,
        earthPos.z - Math.sin(mWorld) * MOON_ORBIT_R
      );

      earthMesh.position.copy(earthPos);
      moonMesh.position.copy(moonPos);
      earthLabel.position.set(earthPos.x, earthPos.y + EARTH_RADIUS + 1.8, earthPos.z);
      moonLabel.position.set(moonPos.x, moonPos.y + MOON_RADIUS + 1.2, moonPos.z);
      moonOrbitRing.position.copy(earthPos);

      // Penanda 8 fase
      for (let i = 0; i < 8; i++) {
        const a = degToRad(st.earthAngle + 180 + i * 45);
        markers[i].position.set(
          earthPos.x + Math.cos(a) * MOON_ORBIT_R,
          0,
          earthPos.z - Math.sin(a) * MOON_ORBIT_R
        );
      }

      // Garis bantu Matahari -> Bumi
      sunEarthLine.update(new THREE.Vector3(0, 0, 0), earthPos);
      // Garis bantu Bumi -> Bulan
      earthMoonLine.update(earthPos, moonPos);
      // Garis pandang: Bumi melalui Bulan, diperpanjang
      const sightDir = moonPos.clone().sub(earthPos).normalize();
      const sightEnd = moonPos.clone().add(sightDir.clone().multiplyScalar(10));
      sightLine.update(earthPos, sightEnd);
      // Busur sudut memanjang di Bumi
      const toSun = new THREE.Vector3(0, 0, 0).sub(earthPos).normalize();
      const toMoon = moonPos.clone().sub(earthPos).normalize();
      angleArc.update(earthPos, toSun, toMoon, 3.5);
      // Kerucut pengamat di Bumi mengarah ke Bulan
      observerCone.position.copy(
        earthPos.clone().add(toMoon.clone().multiplyScalar(EARTH_RADIUS + 1.2))
      );
      observerCone.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        toMoon
      );
    };

    updatePositions();

    const onFrame = (dt: number) => {
      const st = simRef.current;
      if (st.playing) {
        st.day = (st.day + dt * 2 * st.speed) % SYNODIC_MONTH;
      }
      if (st.moveEarth) {
        st.earthAngle = (st.earthAngle + dt * 2 * st.speed) % 360;
      }
      updatePositions();
    };

    return { onFrame, dispose: () => {} };
  }, []);

  // ---------- Handler ----------
  const setDay = (v: number) => {
    simRef.current.day = v;
    simRef.current.playing = false;
    setPlayingState(false);
    setDayState(v);
  };
  const togglePlay = () => {
    simRef.current.playing = !simRef.current.playing;
    setPlayingState(simRef.current.playing);
    sounds.click();
  };
  const changeSpeed = (v: number) => {
    simRef.current.speed = v;
    sounds.click();
  };
  const toggleEarth = () => {
    simRef.current.moveEarth = !simRef.current.moveEarth;
    sounds.click();
  };
  const reset = () => {
    simRef.current.day = 0;
    simRef.current.earthAngle = 0;
    simRef.current.playing = false;
    setPlayingState(false);
    setDayState(0);
    sounds.click();
  };
  const jumpPhase = (dir: 1 | -1) => {
    const st = simRef.current;
    const idx = Math.round(
      (((moonAngleFromDay(st.day) - 180) % 360) + 360) % 360 / 45
    ) % 8;
    const next = (idx + dir + 8) % 8;
    st.day = PHASES[next].day;
    st.playing = false;
    setPlayingState(false);
    setDayState(PHASES[next].day);
    sounds.phase();
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Area 3D */}
      <div className="relative h-[55vh] lg:h-[calc(100vh-10rem)] lg:flex-1 lg:min-h-0 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950/60">
        <ThreeCanvas className="absolute inset-0" onSetup={onSetup} />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <Badge tone="amber">Model skematis — tidak berskala</Badge>
          <Badge tone="cyan">
            <Sun size={11} className="mr-1" /> Matahari sebagai sumber cahaya
          </Badge>
        </div>
        {/* Legenda garis bantu */}
        <div className="absolute bottom-3 left-3 rounded-xl bg-slate-900/85 border border-slate-700 p-2.5 text-[11px] space-y-1 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-amber-400 inline-block" />
            <span className="text-slate-300">Garis bantu Matahari → Bumi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-cyan-400 inline-block" />
            <span className="text-slate-300">Garis bantu Bumi → Bulan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0 w-5 border-t-2 border-dashed border-white inline-block" />
            <span className="text-slate-300">Garis pandang pengamat</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-pink-400 inline-block" />
            <span className="text-slate-300">Sudut memanjang (Matahari–Bumi–Bulan)</span>
          </div>
        </div>
      </div>

      {/* Panel kontrol */}
      <div className="w-full lg:w-80 space-y-3 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto pr-1">
        {/* Fase saat ini */}
        <Panel title="Fase Bulan Saat Ini">
          <div className="flex items-center gap-3">
            <MoonDisk
              elongationUnsigned={display.elongation}
              waxing={display.waxing}
              size={104}
            />
            <div className="flex-1">
              <div className="text-lg font-bold text-amber-300">
                {display.phaseName}
              </div>
              <div className="text-xs text-slate-400">
                {display.waxing ? 'Sabit mengembang' : 'Sabit mengecil'}
              </div>
              <div className="mt-1 text-xs text-slate-300">
                Hari ke-{' '}
                <span className="font-mono text-cyan-300">
                  {display.day.toFixed(1).replace('.', ',')}
                </span>{' '}
                dari {SYNODIC_MONTH.toFixed(1).replace('.', ',')}
              </div>
              <div className="text-xs text-slate-300">
                Iluminasi:{' '}
                <span className="font-mono text-cyan-300">
                  {Math.round(display.illumination * 100)}%
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
        </Panel>

        {/* Slider hari */}
        <Panel title="Posisi Bulan dalam Siklus">
          <Slider
            label="Hari dalam siklus fase"
            value={Number(day.toFixed(1))}
            min={0}
            max={Number(SYNODIC_MONTH.toFixed(1))}
            step={0.1}
            onChange={setDay}
          />
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => jumpPhase(-1)}>
              <ChevronLeft size={14} /> Fase Sebelumnya
            </Button>
            <Button size="sm" variant="secondary" onClick={() => jumpPhase(1)}>
              Fase Berikutnya <ChevronRight size={14} />
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="primary" onClick={togglePlay}>
              {playing ? <Pause size={14} /> : <Play size={14} />}
              {playing ? 'Jeda' : 'Putar Orbit Bulan'}
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw size={14} /> Reset
            </Button>
          </div>
          <div className="mt-3">
            <div className="mb-1 text-xs text-slate-400">Kecepatan</div>
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
          <div className="mt-3">
            <Toggle
              checked={moveEarth}
              onChange={toggleEarth}
              label="Gerakkan Bumi (revolusi)"
            />
          </div>
        </Panel>

        {/* Delapan fase */}
        <Panel title="Delapan Fase Bulan">
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {PHASES.map((p) => (
              <div
                key={p.index}
                className={cn(
                  'rounded-lg px-2 py-1.5 border',
                  display.phaseIndex === p.index
                    ? 'border-amber-400/60 bg-amber-500/10 text-amber-200'
                    : 'border-slate-700/60 bg-slate-800/40 text-slate-400'
                )}
              >
                <div className="font-semibold">{p.name}</div>
                <div className="text-[10px] opacity-75">
                  Hari {p.day.toFixed(1).replace('.', ',')}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Penjelasan */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 text-[11px] text-slate-400 space-y-2">
          <div className="flex gap-2">
            <Info size={12} className="mt-0.5 shrink-0 text-cyan-300" />
            <span>
              <strong className="text-slate-200">Siklus fase</strong> dari Bulan
              baru ke Bulan baru berikutnya ≈{' '}
              <strong className="text-amber-300">29,5 hari</strong> (periode
              sinodis).
            </span>
          </div>
          <div className="flex gap-2">
            <Globe size={12} className="mt-0.5 shrink-0 text-cyan-300" />
            <span>
              Revolusi Bulan terhadap bintang ≈{' '}
              <strong className="text-amber-300">27,3 hari</strong>. Selisihnya
              terjadi karena selama Bulan mengorbit Bumi, Bumi juga bergerak
              mengelilingi Matahari.
            </span>
          </div>
          <div className="flex gap-2">
            <Eye size={12} className="mt-0.5 shrink-0 text-pink-300" />
            <span>
              Fase dihitung dari <strong className="text-slate-200">sudut
              memanjang</strong> Matahari–Bumi–Bulan. Garis bantu kuning
              (Matahari→Bumi) dan biru (Bumi→Bulan) memperlihatkan sudut
              pandang pengamat di Bumi.
            </span>
          </div>
          <div className="flex gap-2">
            <Moon size={12} className="mt-0.5 shrink-0 text-slate-300" />
            <span>
              Orbit Bulan sedikit miring terhadap orbit Bumi, sehingga fase
              Bulan biasanya <strong className="text-slate-200">tidak</strong>{' '}
              menghasilkan gerhana setiap bulan.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
