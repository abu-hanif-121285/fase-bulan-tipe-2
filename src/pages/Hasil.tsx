import { Button, Panel, Badge } from '../components/UI';
import type { QuizResult } from '../lib/types';
import {
  Trophy,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  XCircle,
  Timer,
  TrendingUp,
} from 'lucide-react';

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m} menit ${s} detik`;
}

export default function Hasil({
  result,
  onRetake,
  onToMateri,
}: {
  result: QuizResult | null;
  onRetake: () => void;
  onToMateri: () => void;
}) {
  if (!result) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-8 backdrop-blur-sm">
          <Trophy size={48} className="mx-auto text-slate-500" />
          <h2 className="mt-3 text-2xl font-extrabold text-white">
            Belum Ada Hasil
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Kerjakan kuis terlebih dahulu untuk melihat hasil
            belajarmu.
          </p>
          <Button variant="primary" className="mt-6" onClick={onRetake}>
            <RotateCcw size={16} /> Mulai Kuis
          </Button>
        </div>
      </div>
    );
  }

  // Penguasaan per topik
  const topics = new Map<string, { correct: number; total: number }>();
  result.answers.forEach((a) => {
    const t = topics.get(a.topic) || { correct: 0, total: 0 };
    t.total += 1;
    if (a.chosen === a.correct) t.correct += 1;
    topics.set(a.topic, t);
  });
  const mastered = [...topics.entries()].filter(
    ([, v]) => v.correct === v.total
  );
  const weak = [...topics.entries()].filter(
    ([, v]) => v.correct < v.total
  );

  const grade =
    result.percent >= 90
      ? 'Sangat Baik'
      : result.percent >= 75
        ? 'Baik'
        : result.percent >= 60
          ? 'Cukup'
          : 'Perlu Belajar Lagi';

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Kartu skor */}
      <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6 text-center backdrop-blur-sm">
        <Badge tone="amber">Hasil Belajar</Badge>
        <h2 className="mt-2 text-xl font-extrabold text-white">
          {result.name}
        </h2>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div>
            <div className="text-5xl font-extrabold text-amber-300">
              {result.score}
            </div>
            <div className="text-xs text-slate-400">Skor / 100</div>
          </div>
          <div className="h-14 w-px bg-slate-700" />
          <div className="text-left">
            <div className="text-lg font-bold text-emerald-300">
              {grade}
            </div>
            <div className="text-xs text-slate-400">
              {result.correct} benar · {result.wrong} salah
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <Timer size={12} /> {formatTime(result.timeSec)}
            </div>
          </div>
        </div>
        {/* Bar skor */}
        <div className="mx-auto mt-5 max-w-md">
          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all"
              style={{ width: `${result.percent}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {result.percent}% berhasil
          </div>
        </div>
      </div>

      {/* Penguasaan materi */}
      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Materi yang Dikuasai">
          {mastered.length === 0 ? (
            <p className="text-xs text-slate-500">
              Belum ada materi yang sepenuhnya dikuasai.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {mastered.map(([t]) => (
                <li
                  key={t}
                  className="flex items-center gap-2 text-sm text-emerald-300"
                >
                  <CheckCircle2 size={14} /> {t}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Saran Belajar">
          {weak.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-emerald-300">
              <TrendingUp size={14} /> Luar biasa! Semua materi
              dikuasai.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {weak.map(([t, v]) => (
                <li
                  key={t}
                  className="flex items-center gap-2 text-sm text-rose-300"
                >
                  <XCircle size={14} /> {t} ({v.correct}/{v.total})
                </li>
              ))}
            </ul>
          )}
          {weak.length > 0 && (
            <p className="mt-2 text-[11px] text-slate-500">
              Ulangi materi terkait dan coba lagi kuisnya.
            </p>
          )}
        </Panel>
      </div>

      {/* Aksi */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="primary" onClick={onRetake}>
          <RotateCcw size={16} /> Ulangi Kuis
        </Button>
        <Button variant="secondary" onClick={onToMateri}>
          <BookOpen size={16} /> Kembali ke Materi
        </Button>
      </div>

      <p className="text-center text-[11px] text-slate-500">
        Skor = (jawaban benar / 20) × 100. Disimpan di perangkat
        ini.
      </p>
    </div>
  );
}
