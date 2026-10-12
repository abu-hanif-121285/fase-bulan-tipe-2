import { useEffect, useState } from 'react';
import { QUIZ } from '../data/content';
import type { QuizQuestion } from '../data/content';
import { Button, Panel, Badge } from '../components/UI';
import { cn } from '../utils/cn';
import { sounds } from '../lib/core';
import type { QuizResult } from '../lib/types';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Brain,
  Timer,
  HelpCircle,
  Play,
} from 'lucide-react';

interface Prepared extends QuizQuestion {
  options: string[];
  correctIndex: number;
}

function prepareQuestions(): Prepared[] {
  const shuffled = [...QUIZ].sort(() => Math.random() - 0.5);
  return shuffled.map((q) => {
    const order = q.options
      .map((_, i) => i)
      .sort(() => Math.random() - 0.5);
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      correctIndex: order.indexOf(q.correctIndex),
    };
  });
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Kuis({
  studentName,
  setStudentName,
  onFinish,
  onViewResult,
}: {
  studentName: string;
  setStudentName: (n: string) => void;
  onFinish: (r: QuizResult) => void;
  onViewResult: () => void;
}) {
  const [questions, setQuestions] = useState<Prepared[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'done'>('intro');
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [nameInput, setNameInput] = useState(studentName);

  // Timer
  useEffect(() => {
    if (phase !== 'quiz') return;
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - startTime) / 1000)),
      1000
    );
    return () => clearInterval(id);
  }, [phase, startTime]);

  const start = () => {
    const name = nameInput.trim() || 'Penjelajah';
    setStudentName(name);
    setQuestions(prepareQuestions());
    setAnswers(Array(QUIZ.length).fill(null));
    setChecked(Array(QUIZ.length).fill(false));
    setCurrent(0);
    setStartTime(Date.now());
    setElapsed(0);
    setPhase('quiz');
    sounds.success();
  };

  const q = questions[current];
  const chosen = answers[current];
  const isChecked = checked[current];

  const choose = (i: number) => {
    if (isChecked) return;
    setAnswers((a) => {
      const n = [...a];
      n[current] = i;
      return n;
    });
    sounds.click();
  };

  const submit = () => {
    if (chosen == null) return;
    setChecked((c) => {
      const n = [...c];
      n[current] = true;
      return n;
    });
    if (chosen === q.correctIndex) sounds.correct();
    else sounds.wrong();
  };

  const finish = () => {
    const correctCount = questions.reduce(
      (acc, qq, i) => acc + (answers[i] === qq.correctIndex ? 1 : 0),
      0
    );
    const score = Math.round((correctCount / questions.length) * 100);
    const result: QuizResult = {
      name: studentName,
      score,
      correct: correctCount,
      wrong: questions.length - correctCount,
      percent: score,
      timeSec: elapsed,
      date: new Date().toISOString(),
      answers: questions.map((qq, i) => ({
        question: qq.question,
        topic: qq.topic,
        chosen: answers[i] ?? -1,
        correct: qq.correctIndex,
        explanation: qq.explanation,
      })),
    };
    onFinish(result);
    setPhase('done');
    sounds.success();
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      sounds.click();
    } else {
      finish();
    }
  };

  // Keyboard
  useEffect(() => {
    if (phase !== 'quiz') return;
    const onKey = (e: KeyboardEvent) => {
      if (!isChecked && ['1', '2', '3', '4'].includes(e.key)) {
        choose(Number(e.key) - 1);
      } else if (e.key === 'Enter') {
        if (!isChecked) submit();
        else next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, current, isChecked, chosen, questions]);

  // ---------- Intro ----------
  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-8 text-center backdrop-blur-sm">
          <Badge tone="amber">Kuis Interaktif · 20 Soal</Badge>
          <h2 className="mt-3 text-3xl font-extrabold text-white">
            Uji Pemahamanmu
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Jawab 20 soal pilihan ganda tentang Matahari, Bumi, Bulan,
            rotasi, revolusi, dan fase Bulan. Setiap soal diberi umpan
            balik dan penjelasan.
          </p>
          <div className="mx-auto mt-6 max-w-sm">
            <label className="mb-1 block text-left text-xs font-semibold text-slate-300">
              Nama Siswa
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Tulis namamu"
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
            <div className="rounded-xl bg-slate-800/60 p-3">
              <Brain size={18} className="mx-auto text-cyan-300" />
              <div className="mt-1 font-semibold text-slate-200">
                Konsep
              </div>
              <div>Pemahaman & penerapan</div>
            </div>
            <div className="rounded-xl bg-slate-800/60 p-3">
              <Timer size={18} className="mx-auto text-amber-300" />
              <div className="mt-1 font-semibold text-slate-200">
                Waktu
              </div>
              <div>Dihitung otomatis</div>
            </div>
            <div className="rounded-xl bg-slate-800/60 p-3">
              <HelpCircle size={18} className="mx-auto text-emerald-300" />
              <div className="mt-1 font-semibold text-slate-200">
                Umpan Balik
              </div>
              <div>Penjelasan setiap soal</div>
            </div>
          </div>
          <button
            type="button"
            onClick={start}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-lg font-bold text-slate-900 shadow-lg shadow-orange-500/25 transition hover:from-amber-300 hover:to-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Play size={20} /> MULAI KUIS
          </button>
          <p className="mt-3 text-[11px] text-slate-500">
            Tips: tekan tombol 1–4 untuk memilih, Enter untuk mengirim.
          </p>
        </div>
      </div>
    );
  }

  // ---------- Selesai ----------
  if (phase === 'done') {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-8 backdrop-blur-sm">
          <CheckCircle2 size={48} className="mx-auto text-emerald-400" />
          <h2 className="mt-3 text-2xl font-extrabold text-white">
            Kuis Selesai!
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Kerja bagus, {studentName}. Mari lihat hasil belajarmu.
          </p>
          <button
            type="button"
            onClick={onViewResult}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3 text-base font-bold text-slate-900 shadow-lg shadow-orange-500/25 transition hover:from-amber-300 hover:to-orange-400"
          >
            LIHAT HASIL <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ---------- Soal ----------
  const progress = ((current + 1) / questions.length) * 100;
  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
        <span>
          Soal {current + 1} dari {questions.length}
        </span>
        <span className="flex items-center gap-1">
          <Timer size={12} /> {formatTime(elapsed)}
        </span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Panel>
        <div className="mb-3 flex items-center justify-between">
          <Badge tone="cyan">{q.topic}</Badge>
          <span className="text-[11px] text-slate-500">
            Pilih satu jawaban paling tepat
          </span>
        </div>
        <h3 className="mb-4 text-base font-semibold leading-relaxed text-white">
          {q.question}
        </h3>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isChosen = chosen === i;
            const isCorrect = q.correctIndex === i;
            let cls =
              'border-slate-700 bg-slate-800/60 text-slate-200 hover:border-cyan-400/50 hover:bg-slate-700/60';
            if (isChecked) {
              if (isCorrect)
                cls = 'border-emerald-400 bg-emerald-500/15 text-emerald-200';
              else if (isChosen)
                cls = 'border-rose-400 bg-rose-500/15 text-rose-200';
              else cls = 'border-slate-700 bg-slate-800/40 text-slate-500';
            } else if (isChosen) {
              cls = 'border-cyan-400 bg-cyan-500/15 text-cyan-100';
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                disabled={isChecked}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-default',
                  cls
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    isChecked && isCorrect
                      ? 'bg-emerald-500 text-white'
                      : isChecked && isChosen
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-700 text-slate-300'
                  )}
                >
                  {isChecked && isCorrect ? (
                    <CheckCircle2 size={14} />
                  ) : isChecked && isChosen ? (
                    <XCircle size={14} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Umpan balik */}
        {isChecked && (
          <div
            className={cn(
              'mt-4 rounded-xl border p-4 text-sm',
              chosen === q.correctIndex
                ? 'border-emerald-400/40 bg-emerald-500/10'
                : 'border-rose-400/40 bg-rose-500/10'
            )}
          >
            <div
              className={cn(
                'flex items-center gap-2 font-bold',
                chosen === q.correctIndex
                  ? 'text-emerald-300'
                  : 'text-rose-300'
              )}
            >
              {chosen === q.correctIndex ? (
                <>
                  <CheckCircle2 size={16} /> Jawaban Benar!
                </>
              ) : (
                <>
                  <XCircle size={16} /> Jawaban Belum Tepat
                </>
              )}
            </div>
            <p className="mt-2 text-slate-300">{q.explanation}</p>
          </div>
        )}

        {/* Aksi */}
        <div className="mt-5 flex justify-end">
          {!isChecked ? (
            <Button
              variant="primary"
              onClick={submit}
              disabled={chosen == null}
            >
              Kirim Jawaban
            </Button>
          ) : (
            <Button variant="primary" onClick={next}>
              {current < questions.length - 1 ? (
                <>
                  Lanjutkan <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Selesai <CheckCircle2 size={16} />
                </>
              )}
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );
}
