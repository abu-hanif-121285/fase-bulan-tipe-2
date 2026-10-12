export type View =
  | 'home'
  | 'materi'
  | 'lab'
  | 'fase'
  | 'kuis'
  | 'hasil';

export interface Progress {
  materi: number; // bab terakhir yang dibuka
  lab: boolean;
  fase: boolean;
  kuis: boolean;
}

export interface QuizAnswer {
  question: string;
  topic: string;
  chosen: number;
  correct: number;
  explanation: string;
}

export interface QuizResult {
  name: string;
  score: number; // 0-100
  correct: number;
  wrong: number;
  percent: number;
  timeSec: number;
  date: string;
  answers: QuizAnswer[];
}
