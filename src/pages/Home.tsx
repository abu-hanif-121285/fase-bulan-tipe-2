import { useCallback } from 'react';
import * as THREE from 'three';
import ThreeCanvas from '../components/ThreeCanvas';
import { Badge } from '../components/UI';
import { cn } from '../utils/cn';
import {
  makeEarthTexture,
  makeMoonTexture,
  makeGlowTexture,
  makeOrbitRing,
  SUN_RADIUS,
  EARTH_ORBIT,
  EARTH_RADIUS,
  MOON_ORBIT,
  MOON_RADIUS,
} from '../components/threeUtils';
import { sounds } from '../lib/core';
import type { Progress } from '../lib/types';
import {
  Rocket,
  BookOpen,
  FlaskConical,
  Moon,
  Sun,
  Globe,
  ChevronRight,
} from 'lucide-react';

export default function Home({
  onStart,
  progress,
}: {
  onStart: () => void;
  progress: Progress;
}) {
  const homeScene = useCallback(({ scene }: any) => {
    scene.add(new THREE.AmbientLight(0x334455, 0.8));
    const sunLight = new THREE.PointLight(0xffffff, 3, 0, 0);
    scene.add(sunLight);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(SUN_RADIUS, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffcc33 })
    );
    scene.add(sun);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: makeGlowTexture(),
        color: 0xffaa33,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    glow.scale.set(24, 24, 1);
    scene.add(glow);

    scene.add(makeOrbitRing(EARTH_ORBIT, 0x94a3b8));
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS, 48, 48),
      new THREE.MeshStandardMaterial({
        map: makeEarthTexture(),
        roughness: 0.9,
      })
    );
    earthGroup.add(earth);
    earthGroup.add(makeOrbitRing(MOON_ORBIT, 0x67e8f9));
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(MOON_RADIUS, 32, 32),
      new THREE.MeshStandardMaterial({
        map: makeMoonTexture(),
        roughness: 1,
      })
    );
    earthGroup.add(moon);

    let t = 0;
    return {
      onFrame: (dt: number) => {
        t += dt;
        earthGroup.position.set(
          Math.cos(t * 0.25) * EARTH_ORBIT,
          0,
          -Math.sin(t * 0.25) * EARTH_ORBIT
        );
        moon.position.set(
          Math.cos(t * 1.1) * MOON_ORBIT,
          0,
          -Math.sin(t * 1.1) * MOON_ORBIT
        );
        earth.rotation.y += dt * 0.5;
      },
      dispose: () => {},
    };
  }, []);

  const activities = [
    {
      icon: BookOpen,
      title: 'Pelajari',
      desc: 'Baca lima bab materi singkat tentang Matahari, Bumi, Bulan, rotasi, revolusi, dan fase Bulan.',
      tone: 'text-cyan-300',
      bg: 'from-cyan-500/20 to-cyan-500/5',
    },
    {
      icon: FlaskConical,
      title: 'Simulasikan',
      desc: 'Jelajahi laboratorium 3D: ubah orbit Bumi dan Bulan, amati siang-malam, dan lihat fase Bulan dari Bumi.',
      tone: 'text-amber-300',
      bg: 'from-amber-500/20 to-amber-500/5',
    },
    {
      icon: Moon,
      title: 'Uji Pemahaman',
      desc: 'Kerjakan 20 soal kuis interaktif dengan umpan balik dan penjelasan, lalu lihat hasil belajarmu.',
      tone: 'text-emerald-300',
      bg: 'from-emerald-500/20 to-emerald-500/5',
    },
  ];

  const progressItems = [
    { label: 'Materi', done: progress.materi >= 5, value: `${Math.min(progress.materi, 5)}/5 bab` },
    { label: 'Laboratorium 3D', done: progress.lab, value: progress.lab ? 'Sudah' : 'Belum' },
    { label: 'Fase Bulan', done: progress.fase, value: progress.fase ? 'Sudah' : 'Belum' },
    { label: 'Kuis', done: progress.kuis, value: progress.kuis ? 'Selesai' : 'Belum' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col justify-center rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 backdrop-blur-sm">
          <Badge tone="cyan">IPAS · Kelas VI SD · Kurikulum Merdeka</Badge>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
            MISI{' '}
            <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">
              TATA SURYA
            </span>
          </h1>
          <p className="mt-2 text-lg font-semibold text-cyan-300">
            Rahasia Matahari, Bumi, Bulan, dan Fase-Fasenya
          </p>
          <p className="mt-4 text-slate-300">
            Siap menjadi penjelajah luar angkasa? Ayo pelajari hubungan
            Matahari, Bumi, dan Bulan melalui materi, simulasi 3D, eksplorasi
            fase Bulan, dan kuis interaktif.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                sounds.success();
                onStart();
              }}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-bold text-slate-900 shadow-lg shadow-orange-500/25 transition hover:from-amber-300 hover:to-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <Rocket size={22} className="transition-transform group-hover:-translate-y-0.5" />
              MULAI MISI
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <Badge tone="amber">
              <Sun size={11} className="mr-1" /> Matahari
            </Badge>
            <Badge tone="cyan">
              <Globe size={11} className="mr-1" /> Bumi
            </Badge>
            <Badge tone="slate">
              <Moon size={11} className="mr-1" /> Bulan
            </Badge>
          </div>
        </div>

        {/* Ilustrasi 3D */}
        <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950/60">
          <ThreeCanvas className="absolute inset-0" onSetup={homeScene} />
          <div className="pointer-events-none absolute bottom-3 left-3 text-[11px] text-slate-400">
            Model skematis — tidak berskala
          </div>
        </div>
      </div>

      {/* Tiga aktivitas */}
      <div className="grid gap-4 md:grid-cols-3">
        {activities.map((a) => (
          <div
            key={a.title}
            className={cn(
              'rounded-2xl border border-slate-700/60 bg-gradient-to-b p-5 backdrop-blur-sm',
              a.bg
            )}
          >
            <a.icon size={28} className={a.tone} />
            <h3 className="mt-3 text-lg font-bold text-white">{a.title}</h3>
            <p className="mt-1 text-sm text-slate-300">{a.desc}</p>
          </div>
        ))}
      </div>

      {/* Progres belajar */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5 backdrop-blur-sm">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-cyan-300">
          Progres Belajarmu
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {progressItems.map((p) => (
            <div
              key={p.label}
              className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-3"
            >
              <div className="text-xs text-slate-400">{p.label}</div>
              <div
                className={cn(
                  'mt-1 text-sm font-bold',
                  p.done ? 'text-emerald-300' : 'text-slate-300'
                )}
              >
                {p.value}
              </div>
              <div
                className={cn(
                  'mt-2 h-1.5 rounded-full',
                  p.done ? 'bg-emerald-500' : 'bg-slate-700'
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
