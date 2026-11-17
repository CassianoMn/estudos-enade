import { beforeEach, describe, expect, it } from "vitest";
import {
  createInitialProgress,
  exportProgressJson,
  finalizeSimuladoInProgress,
  loadProgress,
  parseImportedProgressJson,
  recordQuestionAttempt,
  saveProgress,
} from "./progressStore";

describe("progressStore persistence and backup", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists and restores progress from localStorage", () => {
    let p = createInitialProgress();
    p.completedTopics["01-banco-de-dados__mod-1"] = true;
    p = recordQuestionAttempt(p, {
      questionId: "bd-1",
      areaId: "01-banco-de-dados",
      source: "inedita",
      type: "objetiva",
      selectedOption: "B",
      isCorrect: true,
      timeSpentSeconds: 30,
      answeredAt: "2026-11-17T10:00:00Z",
    });

    saveProgress(p);
    const loaded = loadProgress();
    expect(loaded.completedTopics["01-banco-de-dados__mod-1"]).toBe(true);
    expect(loaded.attemptsByQuestion["bd-1"].isCorrect).toBe(true);
  });

  it("exports and re-imports valid progress JSON", () => {
    const p = createInitialProgress();
    p.theme = "dark";
    const json = exportProgressJson(p);
    const imported = parseImportedProgressJson(json);
    expect(imported.theme).toBe("dark");
    expect(() => parseImportedProgressJson('{"invalid": true}')).toThrow();
  });

  it("finalizes simulado and merges attempts into attemptsByQuestion", () => {
    const p = createInitialProgress();
    const updated = finalizeSimuladoInProgress(
      p,
      {
        id: "sim-1",
        mode: "simulado-rapido",
        title: "Simulado Rápido",
        startedAt: "2026-11-17T10:00:00Z",
        finishedAt: "2026-11-17T10:10:00Z",
        durationSeconds: 5400,
        elapsedSeconds: 600,
        questionIds: ["q1"],
        answers: { q1: { selectedOption: "A" } },
        totalQuestions: 1,
        answeredCount: 1,
        correctCount: 1,
        scorePercent: 100,
        areaBreakdown: { "00-formacao-geral": { total: 1, correct: 1 } },
      },
      [
        {
          questionId: "q1",
          areaId: "00-formacao-geral",
          source: "oficial",
          type: "objetiva",
          selectedOption: "A",
          isCorrect: true,
          timeSpentSeconds: 60,
          answeredAt: "2026-11-17T10:10:00Z",
        },
      ]
    );
    expect(updated.simulados).toHaveLength(1);
    expect(updated.attemptsByQuestion["q1"].isCorrect).toBe(true);
    expect(updated.activeSimulado).toBeNull();
  });
});
