import { useEffect, useState } from 'react';
import Starfield from './components/Starfield';
import Home from './pages/Home';
import Materi from './pages/Materi';
import Lab from './pages/Lab';
import Fase from './pages/Fase';
import Kuis from './pages/Kuis';
import Hasil from './pages/Hasil';
import { storage, sounds, setSoundEnabled, setVolumeLevel } from './lib/core';
import type { View, Progress, QuizResult } from './lib/types';
import { cn } from './utils/cn';
import {
  Home as HomeIcon,
  BookOpen,
  FlaskConical,
  Moon,
  Brain,
  Trophy,
  Volume2,
  VolumeX,
  Star,
  User,
} from 'lucide-react';

const NAV: { id: View; label: string; icon: typeof HomeIcon }[] = [
  { id: 'home', label: 'Beranda', icon: HomeIcon },
  { id: 'materi', label: 'Materi', icon: BookOpen },
  { id: 'lab', label: 'Laboratorium 3D', icon: FlaskConical },
  { id: 'fase', label: 'Fase Bulan', icon: Moon },
  { id: 'kuis', label: 'Kuis', icon: Brain },
  { id: 'hasil', label: 'Hasil Belajar', icon: Trophy },
];

export default function App() {
  const [view, setView] = useState<View>(() =>
    storage.get('mts_view', 'home' as View)
  );
  const [studentName, setStudentName] = useState<string>(() =>
    storage.get('mts_name', '')
  );
  const [progress, setProgress] = useState<Progress>(() =>
    storage.get('mts_progress', {
      materi: 0,
      lab: false,
      fase: false,
      kuis: false,
    })
  );
  const [lastResult, setLastResult] = useState<QuizResult | null>(() =>
    storage.get('mts_result', null)
  );
  const [soundOn, setSoundOn] = useState<boolean>(() =>
    storage.get('mts_sound', true)
  );
  const [volume, setVolume] = useState<number>(() =>
    storage.get('mts_volume', 0.5)
  );
  const [faseJump, setFaseJump] = useState<{
    day: number | null;
    nonce: number;
  }>({ day: null, nonce: 0 });

  // Persistensi
  useEffect(() => {
    storage.set('mts_view', view);
  }, [view]);
  useEffect(() => {
    storage.set('mts_name', studentName);
  }, [studentName]);
  useEffect(() => {
    storage.set('mts_progress', progress);
  }, [progress]);
  useEffect(() => {
    storage.set('mts_result', lastResult);
  }, [lastResult]);
  useEffect(() => {
    storage.set('mts_sound', soundOn);
    setSoundEnabled(soundOn);
  }, [soundOn]);
  useEffect(() => {
    storage.set('mts_volume', volume);
    setVolumeLevel(volume);
  }, [volume]);

  // Tandai lab/fase sudah dikunjungi
  useEffect(() => {
    if (view === 'lab') setProgress((p) => ({ ...p, lab: true }));
    if (view === 'fase') setProgress((p) => ({ ...p, fase: true }));
  }, [view]);

  const navigate = (v: View) => {
    setView(v);
    sounds.click();
  };

  const markMateri = (ch: number) =>
    setProgress((p) => ({ ...p, materi: Math.max(p.materi, ch) }));

  const seePhase = (day: number) => {
    setFaseJump({ day, nonce: Date.now() });
    navigate('fase');
  };

  const finishQuiz = (r: QuizResult) => {
    setLastResult(r);
    setProgress((p) => ({ ...p, kuis: true }));
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Starfield className="pointer-events-none fixed inset-0" />

      {/* Sidebar desktop */}
      <aside className="relative z-10 hidden w-64 shrink-0 flex-col border-r border-slate-800/80 bg-slate-900/70 backdrop-blur lg:flex">
        <div className="border-b border-slate-800 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
              <Star size={18} className="text-slate-900" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-wide text-white">
                MISI TATA SURYA
              </div>
              <div className="text-[10px] text-slate-400">
                IPAS · Kelas VI SD
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => navigate(n.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                view === n.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-amber-500/10 text-cyan-200'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              )}
            >
              <n.icon size={18} />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="space-y-3 border-t border-slate-800 p-4">
          <div className="flex items-center gap-2">
            <User size={14} className="text-slate-400" />
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nama siswa"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Suara</span>
            <button
              type="button"
              onClick={() => setSoundOn(!soundOn)}
              className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
              aria-label="Aktifkan/nonaktifkan suara"
            >
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
            aria-label="Volume"
          />
        </div>
      </aside>

      {/* Area utama */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile */}
        <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
              <Star size={14} className="text-slate-900" />
            </div>
            <span className="text-sm font-extrabold text-white">
              MISI TATA SURYA
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSoundOn(!soundOn)}
            className="rounded-lg bg-slate-800 p-2 text-slate-300"
            aria-label="Suara"
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </header>

        {/* Konten */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4">
          {view === 'home' && (
            <Home onStart={() => navigate('materi')} progress={progress} />
          )}
          {view === 'materi' && (
            <Materi
              onSeePhase={seePhase}
              onMarkProgress={markMateri}
            />
          )}
          {view === 'lab' && <Lab />}
          {view === 'fase' && (
            <Fase jumpDay={faseJump.day} jumpNonce={faseJump.nonce} />
          )}
          {view === 'kuis' && (
            <Kuis
              studentName={studentName}
              setStudentName={setStudentName}
              onFinish={finishQuiz}
              onViewResult={() => navigate('hasil')}
            />
          )}
          {view === 'hasil' && (
            <Hasil
              result={lastResult}
              onRetake={() => navigate('kuis')}
              onToMateri={() => navigate('materi')}
            />
          )}
        </main>

        {/* Navigasi bawah mobile */}
        <nav className="grid grid-cols-6 gap-1 border-t border-slate-800/80 bg-slate-900/80 px-1 py-1.5 backdrop-blur lg:hidden">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => navigate(n.id)}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-[9px] font-semibold transition',
                view === n.id
                  ? 'text-cyan-300'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <n.icon size={18} />
              {n.label.split(' ')[0]}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
