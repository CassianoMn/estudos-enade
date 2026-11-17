import type {
  ApostilaArea,
  Question,
  QuestionAttempt,
  SimuladoAnswerState,
  SimuladoMode,
  SimuladoRecord,
  StudyProgress,
} from "../types/enade";

export interface AreaMetric {
  areaId: string;
  areaName: string;
  totalInBank: number;
  answeredUnique: number;
  correctUnique: number;
  accuracyPercent: number;
  avgTimeSeconds: number;
  topicsTotal: number;
  topicsCompleted: number;
}

export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function getTodayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function computeStudyStreak(studyDates: string[], today = new Date()): number {
  if (studyDates.length === 0) return 0;
  const set = new Set(studyDates);
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!set.has(getTodayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(getTodayKey(cursor))) return 0;
  }
  let streak = 0;
  while (set.has(getTodayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function isSimuladoAnswerCorrect(
  question: Question,
  answer: SimuladoAnswerState | undefined
): boolean {
  if (question.annulled) return true;
  if (!answer) return false;
  if (question.type === "objetiva") {
    return Boolean(answer.selectedOption && answer.selectedOption === question.correctAnswer);
  }
  return (answer.discursiveSelfScore ?? 0) >= 0.5;
}

export function evaluateSimulado(
  questions: Question[],
  answers: Record<string, SimuladoAnswerState>,
  meta: {
    id: string;
    mode: SimuladoMode;
    title: string;
    startedAt: string;
    finishedAt: string;
    durationSeconds: number;
    elapsedSeconds: number;
  }
): SimuladoRecord {
  let answeredCount = 0;
  let correctCount = 0;
  const areaBreakdown: Record<string, { total: number; correct: number }> = {};

  for (const q of questions) {
    const ans = answers[q.id];
    const hasAnswered =
      q.type === "objetiva"
        ? Boolean(ans?.selectedOption)
        : Boolean(ans?.discursiveDraft?.trim() || ans?.discursiveSelfScore !== undefined);
    if (hasAnswered || q.annulled) {
      answeredCount += 1;
    }

    const correct = isSimuladoAnswerCorrect(q, ans);
    if (correct) correctCount += 1;

    if (!areaBreakdown[q.areaId]) {
      areaBreakdown[q.areaId] = { total: 0, correct: 0 };
    }
    areaBreakdown[q.areaId].total += 1;
    if (correct) areaBreakdown[q.areaId].correct += 1;
  }

  const totalQuestions = questions.length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    ...meta,
    questionIds: questions.map((q) => q.id),
    answers,
    totalQuestions,
    answeredCount,
    correctCount,
    scorePercent,
    areaBreakdown,
  };
}

export function computeAreaMetrics(
  areas: ApostilaArea[],
  questions: Question[],
  progress: StudyProgress
): AreaMetric[] {
  const attemptsList = Object.values(progress.attemptsByQuestion);
  const attemptsByArea = new Map<string, QuestionAttempt[]>();
  for (const att of attemptsList) {
    const arr = attemptsByArea.get(att.areaId) ?? [];
    arr.push(att);
    attemptsByArea.set(att.areaId, arr);
  }

  return areas.map((area) => {
    const areaQuestions = questions.filter((q) => q.areaId === area.areaId);
    const areaAttempts = attemptsByArea.get(area.areaId) ?? [];
    const correctUnique = areaAttempts.filter((a) => a.isCorrect).length;
    const answeredUnique = areaAttempts.length;
    const accuracyPercent =
      answeredUnique > 0 ? Math.round((correctUnique / answeredUnique) * 100) : 0;
    const totalTime = areaAttempts.reduce((acc, a) => acc + (a.timeSpentSeconds || 0), 0);
    const avgTimeSeconds = answeredUnique > 0 ? Math.round(totalTime / answeredUnique) : 0;
    const topicsCompleted = area.topics.filter((t) => progress.completedTopics[t.id]).length;

    return {
      areaId: area.areaId,
      areaName: area.shortTitle || area.title,
      totalInBank: areaQuestions.length,
      answeredUnique,
      correctUnique,
      accuracyPercent,
      avgTimeSeconds,
      topicsTotal: area.topics.length,
      topicsCompleted,
    };
  });
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildSimuladoQuestions(
  mode: SimuladoMode,
  allQuestions: Question[]
): { title: string; durationSeconds: number; questions: Question[] } {
  if (mode === "oficial-2021" || mode === "oficial-2017" || mode === "oficial-2014") {
    const year = Number(mode.split("-")[1]);
    const official = allQuestions
      .filter((q) => q.source === "oficial" && q.year === year)
      .sort((a, b) => {
        if (a.component !== b.component) {
          return a.component === "formacao_geral" ? -1 : 1;
        }
        if (a.type !== b.type) {
          return a.type === "discursiva" ? -1 : 1;
        }
        return (a.examNumber ?? 0) - (b.examNumber ?? 0);
      });
    return {
      title: `Simulado ENADE Oficial ${year}`,
      durationSeconds: 4 * 3600,
      questions: official,
    };
  }

  if (mode === "inedito-completo") {
    const inedFG = shuffleArray(
      allQuestions.filter((q) => q.source === "inedita" && q.component === "formacao_geral")
    ).slice(0, 8);
    const inedCE = shuffleArray(
      allQuestions.filter((q) => q.source === "inedita" && q.component === "especifico")
    ).slice(0, 32);
    return {
      title: "Simulado Inédito Completo (40 questões)",
      durationSeconds: 4 * 3600,
      questions: [...inedFG, ...inedCE],
    };
  }

  // simulado-rapido: 15 questões balanceadas (3 FG + 12 CE)
  const fg = shuffleArray(allQuestions.filter((q) => q.component === "formacao_geral")).slice(0, 3);
  const ce = shuffleArray(allQuestions.filter((q) => q.component === "especifico")).slice(0, 12);
  return {
    title: "Simulado Rápido ENADE (15 questões)",
    durationSeconds: 90 * 60,
    questions: [...fg, ...ce],
  };
}
