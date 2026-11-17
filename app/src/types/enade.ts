export type QuestionSource = "oficial" | "inedita";
export type QuestionComponent = "formacao_geral" | "especifico";
export type QuestionType = "objetiva" | "discursiva";
export type QuestionDifficulty = "facil" | "media" | "dificil";
export type OptionLetter = "A" | "B" | "C" | "D" | "E";

export interface QuestionOption {
  letter: OptionLetter;
  text: string;
  explanation?: string;
}

export interface Question {
  id: string;
  label: string;
  source: QuestionSource;
  year: number;
  examNumber: number | null;
  component: QuestionComponent;
  areaId: string;
  areaName: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  annulled: boolean;
  stem: string;
  options: QuestionOption[];
  correctAnswer: OptionLetter | null;
  explanation: string;
  discursiveRubric: string | null;
  imageUrls: string[];
  topics: string[];
}

export interface QuestionBankBundle {
  version: string;
  totalQuestions: number;
  officialCount: number;
  ineditaCount: number;
  questions: Question[];
}

export interface ApostilaTopic {
  id: string;
  title: string;
}

export interface VideoReference {
  label: string;
  exam: string;
}

export interface ApostilaArea {
  areaId: string;
  title: string;
  shortTitle: string;
  component: QuestionComponent;
  hasDriveMaterial: boolean;
  sourceFiles: string[];
  videoRefs: VideoReference[];
  estimatedMinutes: number;
  wordCount: number;
  topics: ApostilaTopic[];
  markdownPath: string;
  pdfPath: string;
  publicPdfUrl: string;
  pdfBytes: number;
  content: string;
}

export interface ApostilasBundle {
  areas: ApostilaArea[];
}

export interface QuestionAttempt {
  questionId: string;
  areaId: string;
  source: QuestionSource;
  type: QuestionType;
  selectedOption?: OptionLetter | null;
  discursiveDraft?: string;
  discursiveSelfScore?: 0 | 0.5 | 1 | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  answeredAt: string;
}

export type SimuladoMode =
  | "oficial-2021"
  | "oficial-2017"
  | "oficial-2014"
  | "inedito-completo"
  | "simulado-rapido";

export interface SimuladoAnswerState {
  selectedOption?: OptionLetter | null;
  discursiveDraft?: string;
  discursiveSelfScore?: 0 | 0.5 | 1 | null;
  flagged?: boolean;
}

export interface ActiveSimulado {
  id: string;
  mode: SimuladoMode;
  title: string;
  questionIds: string[];
  durationSeconds: number;
  remainingSeconds: number;
  startedAt: string;
  currentIndex: number;
  answers: Record<string, SimuladoAnswerState>;
}

export interface SimuladoRecord {
  id: string;
  mode: SimuladoMode;
  title: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  elapsedSeconds: number;
  questionIds: string[];
  answers: Record<string, SimuladoAnswerState>;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  scorePercent: number;
  areaBreakdown: Record<string, { total: number; correct: number }>;
}

export interface StudyProgress {
  schemaVersion: number;
  theme: "light" | "dark";
  completedTopics: Record<string, boolean>;
  lastReadAreaId: string | null;
  favorites: Record<string, boolean>;
  attemptsByQuestion: Record<string, QuestionAttempt>;
  attemptHistory: QuestionAttempt[];
  simulados: SimuladoRecord[];
  activeSimulado: ActiveSimulado | null;
  studyDates: string[];
}
