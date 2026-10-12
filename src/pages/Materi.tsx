import { useState } from 'react';
import { BAB } from '../data/content';
import { PHASES, formatDay } from '../lib/core';
import MoonDisk from '../components/MoonDisk';
import { Button, Badge } from '../components/UI';
import { cn } from '../utils/cn';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Lightbulb,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

export default function Materi({
  onSeePhase,
  onMarkProgress,
}: {
  onSeePhase: (day: number) => void;
  onMarkProgress: (chapter: number) => void;
}) {
  const [chapter, setChapter] = useState(1);
  const bab = BAB.find((b) => b.id === chapter)!;

  const goTo = (id: number) => {
    setChapter(id);
    onMarkProgress(id);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Pemilih bab */}
      <div className="flex flex-wrap gap-2">
        {BAB.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => goTo(b.id)}
            className={cn(
              'rounded-xl border px-3 py-2 text-xs font-semibold transition',
              chapter === b.id
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:bg-slate-700/60'
            )}
          >
            Bab {b.id}
          </button>
        ))}
      </div>

      <article className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 backdrop-blur-sm">
        <Badge tone="cyan">Bab {bab.id}</Badge>
        <h2 className="mt-2 text-2xl font-extrabold text-white">
          {bab.title}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{bab.subtitle}</p>

        <div className="mt-5 space-y-6">
          {bab.sections.map((sec, i) => (
            <section key={i}>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-cyan-300">
                <BookOpen size={18} />
                {sec.heading}
              </h3>
              {sec.paragraphs.map((p, j) => (
                <p key={j} className="mb-2 text-sm leading-relaxed text-slate-300">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {/* Tabel ringkasan (Bab 2) */}
          {bab.table && (
            <section>
              <h3 className="mb-2 text-lg font-bold text-cyan-300">
                Tabel Ringkasan
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-700/60">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-800 text-cyan-300">
                      {bab.table!.headers.map((h) => (
                        <th key={h} className="px-3 py-2 font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bab.table!.rows.map((row, i) => (
                      <tr
                        key={i}
                        className={cn(
                          'border-t border-slate-700/50',
                          i % 2 === 0 ? 'bg-slate-800/40' : 'bg-slate-900/40'
                        )}
                      >
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 text-slate-300">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Delapan fase (Bab 5) */}
          {bab.id === 5 && (
            <section>
              <h3 className="mb-2 text-lg font-bold text-cyan-300">
                Ilustrasi Delapan Fase Bulan
              </h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {PHASES.map((p) => {
                  const unsigned = Math.min(p.elongation, 360 - p.elongation);
                  const waxing = p.elongation <= 180;
                  return (
                    <div
                      key={p.index}
                      className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-3 text-center"
                    >
                      <MoonDisk
                        elongationUnsigned={unsigned}
                        waxing={waxing}
                        size={84}
                        className="mx-auto"
                      />
                      <div className="mt-2 text-sm font-bold text-amber-300">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Hari ke-{formatDay(p.day)}
                      </div>
                      <p className="mt-1 text-[11px] leading-snug text-slate-300">
                        {p.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => onSeePhase(p.day)}
                        className="mt-2 inline-flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2 py-1 text-[11px] font-semibold text-cyan-300 transition hover:bg-cyan-500/30"
                      >
                        <Play size={11} /> Lihat dalam Simulasi
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Poin penting */}
          <section className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-300">
              <Lightbulb size={16} /> Poin Penting
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
              {bab.keyPoints.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </section>

          {/* Refleksi */}
          <section className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-cyan-300">
              <HelpCircle size={16} /> Pertanyaan Refleksi
            </h3>
            <ul className="list-inside list-decimal space-y-1 text-sm text-slate-300">
              {bab.reflection.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      {/* Navigasi bab */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => goTo(chapter - 1)}
          disabled={chapter === 1}
        >
          <ChevronLeft size={16} /> Bab Sebelumnya
        </Button>
        <span className="text-xs text-slate-400">
          Bab {chapter} dari 5
        </span>
        <Button
          variant="secondary"
          onClick={() => goTo(chapter + 1)}
          disabled={chapter === 5}
        >
          Bab Berikutnya <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
