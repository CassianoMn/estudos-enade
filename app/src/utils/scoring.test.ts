import { describe, expect, it } from "vitest";
import type { ApostilaArea, Question } from "../types/enade";
import {
  buildSimuladoQuestions,
  computeAreaMetrics,
  computeStudyStreak,
  evaluateSimulado,
  formatDuration,
} from "./scoring";
import { createInitialProgress, recordQuestionAttempt } from "../store/progressStore";

const sampleQuestions: Question[] = [
  {
    id: "q-fg-1",
    label: "FG 1",
    source: "oficial",
    year: 2021,
    examNumber: 1,
    component: "formacao_geral",
    areaId: "00-formacao-geral",
    areaName: "Formação Geral",
    type: "objetiva",
    difficulty: "media",
    annulled: false,
    stem: "Enunciado FG",
    options: [
      { letter: "A", text: "A" },
      { letter: "B", text: "B" },
      { letter: "C", text: "C" },
      { letter: "D", text: "D" },
      { letter: "E", text: "E" },
    ],
    correctAnswer: "C",
    explanation: "C está certa",
    discursiveRubric: null,
    imageUrls: [],
    topics: [],
  },
  {
    id: "q-bd-1",
    label: "BD 1",
    source: "inedita",
    year: 2026,
    examNumber: 1,
    component: "especifico",
    areaId: "01-banco-de-dados",
    areaName: "Banco de Dados",
    type: "objetiva",
    difficulty: "media",
    annulled: false,
    stem: "Enunciado BD",
    options: [
      { letter: "A", text: "A" },
      { letter: "B", text: "B" },
      { letter: "C", text: "C" },
      { letter: "D", text: "D" },
      { letter: "E", text: "E" },
    ],
    correctAnswer: "A",
    explanation: "A está certa",
    discursiveRubric: null,
    imageUrls: [],
    topics: [],
  },
  {
    id: "q-bd-anul",
    label: "BD Anulada",
    source: "oficial",
    year: 2021,
    examNumber: 33,
    component: "especifico",
    areaId: "01-banco-de-dados",
    areaName: "Banco de Dados",
    type: "objetiva",
    difficulty: "dificil",
    annulled: true,
    stem: "Enunciado Anulada",
    options: [
      { letter: "A", text: "A" },
      { letter: "B", text: "B" },
      { letter: "C", text: "C" },
      { letter: "D", text: "D" },
      { letter: "E", text: "E" },
    ],
    correctAnswer: null,
    explanation: "Anulada",
    discursiveRubric: null,
    imageUrls: [],
    topics: [],
  },
];

describe("scoring utilities", () => {
  it("formats duration cleanly", () => {
    expect(formatDuration(65)).toBe("01:05");
    expect(formatDuration(4 * 3600 + 5)).toBe("04:00:05");
  });

  it("computes consecutive study streak", () => {
    const today = new Date(2026, 10, 17);
    expect(computeStudyStreak(["2026-11-15", "2026-11-16", "2026-11-17"], today)).toBe(3);
    expect(computeStudyStreak(["2026-11-14", "2026-11-16"], today)).toBe(1);
    expect(computeStudyStreak(["2026-11-10"], today)).toBe(0);
  });

  it("evaluates simulado counting annulled questions as valid", () => {
    const rec = evaluateSimulado(
      sampleQuestions,
      {
        "q-fg-1": { selectedOption: "C" },
        "q-bd-1": { selectedOption: "B" },
      },
      {
        id: "sim-1",
        mode: "simulado-rapido",
        title: "Teste",
        startedAt: "2026-11-17T10:00:00Z",
        finishedAt: "2026-11-17T10:15:00Z",
        durationSeconds: 5400,
        elapsedSeconds: 900,
      }
    );

    expect(rec.correctCount).toBe(2); // q-fg-1 + q-bd-anul
    expect(rec.scorePercent).toBe(67);
    expect(rec.areaBreakdown["00-formacao-geral"]).toEqual({ total: 1, correct: 1 });
    expect(rec.areaBreakdown["01-banco-de-dados"]).toEqual({ total: 2, correct: 1 });
  });

  it("computes area metrics and topic progress", () => {
    const areas: ApostilaArea[] = [
      {
        areaId: "01-banco-de-dados",
        title: "Banco de Dados",
        shortTitle: "Banco de Dados",
        component: "especifico",
        hasDriveMaterial: true,
        sourceFiles: [],
        videoRefs: [],
        estimatedMinutes: 20,
        wordCount: 3000,
        topics: [
          { id: "t1", title: "Módulo 1" },
          { id: "t2", title: "Módulo 2" },
        ],
        markdownPath: "",
        pdfPath: "",
        publicPdfUrl: "",
        pdfBytes: 1000,
        content: "",
      },
    ];

    let progress = createInitialProgress();
    progress.completedTopics["t1"] = true;
    progress = recordQuestionAttempt(progress, {
      questionId: "q-bd-1",
      areaId: "01-banco-de-dados",
      source: "inedita",
      type: "objetiva",
      selectedOption: "A",
      isCorrect: true,
      timeSpentSeconds: 45,
      answeredAt: "2026-11-17T12:00:00Z",
    });

    const metrics = computeAreaMetrics(areas, sampleQuestions, progress);
    expect(metrics[0].accuracyPercent).toBe(100);
    expect(metrics[0].topicsCompleted).toBe(1);
    expect(metrics[0].avgTimeSeconds).toBe(45);
  });

  it("builds official simulado in canonical exam order", () => {
    const built = buildSimuladoQuestions("oficial-2021", sampleQuestions);
    expect(built.durationSeconds).toBe(4 * 3600);
    expect(built.questions.map((q) => q.id)).toEqual(["q-fg-1", "q-bd-anul"]);
  });
});
