import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import { QuestionCard } from "./QuestionCard";
import type { Question } from "../types/enade";

const sampleObjectiveQuestion: Question = {
  id: "q-test-1",
  label: "Questão Teste 01",
  source: "inedita",
  year: 2026,
  examNumber: null,
  component: "especifico",
  areaId: "01-banco-de-dados",
  areaName: "Banco de Dados",
  type: "objetiva",
  difficulty: "media",
  annulled: false,
  stem: "Qual propriedade ACID garante que uma transação concluída persista mesmo após falha?",
  options: [
    { letter: "A", text: "Atomicidade" },
    { letter: "B", text: "Consistência" },
    { letter: "C", text: "Isolamento" },
    { letter: "D", text: "Durabilidade", explanation: "Correto: após o commit, os dados persistem." },
    { letter: "E", text: "Normalização" },
  ],
  correctAnswer: "D",
  explanation: "Durabilidade garante persistência permanente após o commit.",
  discursiveRubric: null,
  imageUrls: [],
  topics: ["ACID"],
};

describe("App shell and UI components", () => {
  it("renders dashboard and navigates across main views", () => {
    window.scrollTo = vi.fn();
    localStorage.clear();
    render(<App />);

    expect(screen.getByText("Visão Geral dos Estudos")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /Simulado/i })[0]);
    expect(screen.getByText("Simulados Cronometrados ENADE")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /Métricas/i })[0]);
    expect(screen.getByText("Métricas de Desempenho e Backup")).toBeInTheDocument();
  }, 15000);

  it("opens command palette with Ctrl+K and closes on Escape", () => {
    window.scrollTo = vi.fn();
    render(<App />);

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getByRole("dialog", { name: "Busca rápida" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Busca rápida" })).not.toBeInTheDocument();
  });

  it("renders QuestionCard options and shows explanation when revealed", () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <QuestionCard
        question={sampleObjectiveQuestion}
        mode="quiz"
        selectedOption={null}
        showFeedback={false}
        onSelectOption={onSelect}
      />
    );

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(5);

    fireEvent.click(radios[3]);
    expect(onSelect).toHaveBeenCalledWith("D");

    rerender(
      <QuestionCard
        question={sampleObjectiveQuestion}
        mode="quiz"
        selectedOption="D"
        showFeedback={true}
        onSelectOption={onSelect}
      />
    );

    expect(screen.getByText("Comentário do Gabarito")).toBeInTheDocument();
    expect(screen.getByText("Durabilidade garante persistência permanente após o commit.")).toBeInTheDocument();
  });

  it("renders Markdown tables, code blocks, and paragraphs in QuestionCard", () => {
    const markdownQuestion: Question = {
      ...sampleObjectiveQuestion,
      id: "q-test-md",
      stem: "Primeiro parágrafo.\n\n| Questão | Métrica |\n| :--- | :--- |\n| Prazo | Lead time |\n\n```sql\nSELECT * FROM Tabela;\n```",
    };

    const { container } = render(
      <QuestionCard question={markdownQuestion} mode="quiz" showFeedback={false} />
    );

    expect(container.querySelector("table")).not.toBeNull();
    expect(screen.getByText("Lead time")).toBeInTheDocument();
    expect(container.querySelector("pre code")).not.toBeNull();
    expect(screen.getByText("Primeiro parágrafo.")).toBeInTheDocument();
  });
});
