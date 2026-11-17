import { describe, expect, it } from "vitest";
import apostilasRaw from "./apostilas-bundle.json";
import questionsRaw from "./banco-unificado.json";
import type { ApostilasBundle, QuestionBankBundle } from "../types/enade";

describe("bundled study data integrity", () => {
  const apostilas = apostilasRaw as ApostilasBundle;
  const bank = questionsRaw as QuestionBankBundle;

  it("contains all 15 unified areas with non-empty topics and markdown", () => {
    expect(apostilas.areas).toHaveLength(15);
    for (const area of apostilas.areas) {
      expect(area.topics.length).toBeGreaterThanOrEqual(5);
      expect(area.content.length).toBeGreaterThan(1000);
      expect(area.pdfBytes).toBeGreaterThan(5000);
    }
  });

  it("contains 270 questions (120 official + 150 inéditas) matching areaIds", () => {
    const areaSet = new Set(apostilas.areas.map((a) => a.areaId));
    expect(bank.totalQuestions).toBe(270);
    expect(bank.officialCount).toBe(120);
    expect(bank.ineditaCount).toBe(150);
    expect(bank.questions).toHaveLength(270);

    for (const q of bank.questions) {
      expect(areaSet.has(q.areaId)).toBe(true);
      if (q.type === "objetiva") {
        expect(q.options).toHaveLength(5);
      } else {
        expect(q.discursiveRubric).toBeTruthy();
      }
    }
  });
});
