import type { ActiveSimulado, QuestionAttempt, SimuladoRecord, StudyProgress } from "../types/enade";
import { getTodayKey } from "../utils/scoring";

export const STORAGE_KEY = "estudos_enade_progress_v1";
export const CURRENT_SCHEMA_VERSION = 1;

export function createInitialProgress(): StudyProgress {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    theme: "light",
    completedTopics: {},
    lastReadAreaId: null,
    favorites: {},
    attemptsByQuestion: {},
    attemptHistory: [],
    simulados: [],
    activeSimulado: null,
    studyDates: [],
  };
}

export function loadProgress(): StudyProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw) as Partial<StudyProgress>;
    return migrateProgress(parsed);
  } catch {
    return createInitialProgress();
  }
}

export function migrateProgress(raw: Partial<StudyProgress>): StudyProgress {
  const base = createInitialProgress();
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    theme: raw.theme === "dark" ? "dark" : "light",
    completedTopics: raw.completedTopics && typeof raw.completedTopics === "object" ? raw.completedTopics : base.completedTopics,
    lastReadAreaId: typeof raw.lastReadAreaId === "string" ? raw.lastReadAreaId : null,
    favorites: raw.favorites && typeof raw.favorites === "object" ? raw.favorites : base.favorites,
    attemptsByQuestion:
      raw.attemptsByQuestion && typeof raw.attemptsByQuestion === "object"
        ? raw.attemptsByQuestion
        : base.attemptsByQuestion,
    attemptHistory: Array.isArray(raw.attemptHistory) ? raw.attemptHistory : base.attemptHistory,
    simulados: Array.isArray(raw.simulados) ? raw.simulados : base.simulados,
    activeSimulado: raw.activeSimulado ?? null,
    studyDates: Array.isArray(raw.studyDates) ? raw.studyDates : base.studyDates,
  };
}

export function saveProgress(progress: StudyProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignora caso armazenamento esteja indisponível ou cheio
  }
}

export function touchStudyDate(studyDates: string[], date = new Date()): string[] {
  const today = getTodayKey(date);
  if (studyDates.includes(today)) return studyDates;
  return [...studyDates, today].sort();
}

export function recordQuestionAttempt(
  prev: StudyProgress,
  attempt: QuestionAttempt
): StudyProgress {
  return {
    ...prev,
    attemptsByQuestion: {
      ...prev.attemptsByQuestion,
      [attempt.questionId]: attempt,
    },
    attemptHistory: [attempt, ...prev.attemptHistory].slice(0, 1000),
    studyDates: touchStudyDate(prev.studyDates),
  };
}

export function finalizeSimuladoInProgress(
  prev: StudyProgress,
  record: SimuladoRecord,
  attempts: QuestionAttempt[]
): StudyProgress {
  const nextAttempts = { ...prev.attemptsByQuestion };
  for (const att of attempts) {
    nextAttempts[att.questionId] = att;
  }
  return {
    ...prev,
    attemptsByQuestion: nextAttempts,
    attemptHistory: [...attempts, ...prev.attemptHistory].slice(0, 1000),
    simulados: [record, ...prev.simulados],
    activeSimulado: null,
    studyDates: touchStudyDate(prev.studyDates),
  };
}

export function updateActiveSimulado(
  prev: StudyProgress,
  active: ActiveSimulado | null
): StudyProgress {
  return {
    ...prev,
    activeSimulado: active,
  };
}

export function exportProgressJson(progress: StudyProgress): string {
  return JSON.stringify(progress, null, 2);
}

export function parseImportedProgressJson(jsonText: string): StudyProgress {
  const parsed = JSON.parse(jsonText) as Partial<StudyProgress>;
  if (!parsed || typeof parsed !== "object" || typeof parsed.schemaVersion !== "number") {
    throw new Error("Arquivo de backup inválido: formato não reconhecido.");
  }
  return migrateProgress(parsed);
}
