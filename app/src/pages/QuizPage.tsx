import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react";
import type {
  ApostilaArea,
  OptionLetter,
  Question,
  QuestionAttempt,
  StudyProgress,
} from "../types/enade";
import { QuestionCard } from "../components/QuestionCard";
import { Button } from "../components/ui/Button";

interface QuizPageProps {
  areas: ApostilaArea[];
  questions: Question[];
  progress: StudyProgress;
  initialAreaFilter: string;
  onRecordAttempt: (attempt: QuestionAttempt) => void;
  onToggleFavorite: (questionId: string) => void;
  onOpenApostila: (areaId: string) => void;
}

const OPTION_LETTERS: OptionLetter[] = ["A", "B", "C", "D", "E"];

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export const QuizPage: React.FC<QuizPageProps> = ({
  areas,
  questions,
  progress,
  initialAreaFilter,
  onRecordAttempt,
  onToggleFavorite,
  onOpenApostila,
}) => {
  const [areaFilter, setAreaFilter] = useState<string>(initialAreaFilter || "all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "oficial" | "inedita">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "objetiva" | "discursiva">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "unanswered" | "wrong" | "favorites">(
    "all"
  );
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answersMap, setAnswersMap] = useState<Record<string, OptionLetter | null>>({});
  const [draftsMap, setDraftsMap] = useState<Record<string, string>>({});
  const [selfScoresMap, setSelfScoresMap] = useState<Record<string, 0 | 0.5 | 1 | null>>({});
  const questionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    if (initialAreaFilter) {
      setAreaFilter(initialAreaFilter);
      setCurrentIndex(0);
    }
  }, [initialAreaFilter]);

  const filteredQuestions = useMemo(() => {
    const base = questions.filter((q) => {
      if (areaFilter !== "all" && q.areaId !== areaFilter) return false;
      if (sourceFilter !== "all" && q.source !== sourceFilter) return false;
      if (typeFilter !== "all" && q.type !== typeFilter) return false;
      if (statusFilter === "unanswered" && progress.attemptsByQuestion[q.id]) return false;
      if (statusFilter === "wrong") {
        const att = progress.attemptsByQuestion[q.id];
        if (!att || att.isCorrect) return false;
      }
      if (statusFilter === "favorites" && !progress.favorites[q.id]) return false;
      return true;
    });

    if (shuffleSeed === 0) return base;
    const copy = [...base];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = (i * 7 + shuffleSeed * 13) % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [
    questions,
    areaFilter,
    sourceFilter,
    typeFilter,
    statusFilter,
    progress.attemptsByQuestion,
    progress.favorites,
    shuffleSeed,
  ]);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredQuestions.length - 1));
  const activeQuestion = filteredQuestions[safeIndex];

  useEffect(() => {
    questionStartRef.current = Date.now();
  }, [activeQuestion?.id]);

  const handleSelectOption = (letter: OptionLetter) => {
    if (!activeQuestion) return;
    if (answersMap[activeQuestion.id]) return;
    const elapsed = Math.max(1, Math.round((Date.now() - questionStartRef.current) / 1000));
    setAnswersMap((prev) => ({ ...prev, [activeQuestion.id]: letter }));

    onRecordAttempt({
      questionId: activeQuestion.id,
      areaId: activeQuestion.areaId,
      source: activeQuestion.source,
      type: "objetiva",
      selectedOption: letter,
      isCorrect: activeQuestion.annulled || letter === activeQuestion.correctAnswer,
      timeSpentSeconds: elapsed,
      answeredAt: new Date().toISOString(),
    });
  };

  const handleDiscursiveScore = (score: 0 | 0.5 | 1) => {
    if (!activeQuestion) return;
    const elapsed = Math.max(1, Math.round((Date.now() - questionStartRef.current) / 1000));
    setSelfScoresMap((prev) => ({ ...prev, [activeQuestion.id]: score }));

    onRecordAttempt({
      questionId: activeQuestion.id,
      areaId: activeQuestion.areaId,
      source: activeQuestion.source,
      type: "discursiva",
      discursiveDraft: draftsMap[activeQuestion.id] ?? "",
      discursiveSelfScore: score,
      isCorrect: score >= 0.5,
      timeSpentSeconds: elapsed,
      answeredAt: new Date().toISOString(),
    });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isTypingTarget(e.target)) return;
      if (!activeQuestion) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1));
        return;
      }
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        onToggleFavorite(activeQuestion.id);
        return;
      }

      if (activeQuestion.type === "objetiva" && !answersMap[activeQuestion.id]) {
        const upper = e.key.toUpperCase() as OptionLetter;
        if (OPTION_LETTERS.includes(upper)) {
          e.preventDefault();
          handleSelectOption(upper);
          return;
        }
        const numIdx = Number(e.key) - 1;
        if (numIdx >= 0 && numIdx < OPTION_LETTERS.length) {
          e.preventDefault();
          handleSelectOption(OPTION_LETTERS[numIdx]);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const resetSessionView = () => {
    setAnswersMap({});
    setSelfScoresMap({});
    setCurrentIndex(0);
  };

  const resetFilters = () => {
    setAreaFilter("all");
    setSourceFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
    setCurrentIndex(0);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
            Treino Direcionado
          </span>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Quiz por Áreas de Conhecimento
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setShuffleSeed((s) => s + 1);
              setCurrentIndex(0);
            }}
            leftIcon={<Shuffle className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Embaralhar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={resetSessionView}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Limpar sessão
          </Button>
        </div>
      </div>

      <section
        aria-label="Filtros de questões"
        className="grid grid-cols-1 gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div>
          <label
            htmlFor="quiz-filter-area"
            className="mb-1 block text-[11px] font-medium text-[var(--text-muted)]"
          >
            Área
          </label>
          <select
            id="quiz-filter-area"
            value={areaFilter}
            onChange={(e) => {
              setAreaFilter(e.target.value);
              setCurrentIndex(0);
            }}
            className="h-8 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 text-xs text-[var(--text-primary)] focus:border-blue-600 focus:outline-none"
          >
            <option value="all">Todas as áreas ({questions.length})</option>
            {areas.map((a) => (
              <option key={a.areaId} value={a.areaId}>
                {a.shortTitle}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="quiz-filter-source"
            className="mb-1 block text-[11px] font-medium text-[var(--text-muted)]"
          >
            Origem
          </label>
          <select
            id="quiz-filter-source"
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value as "all" | "oficial" | "inedita");
              setCurrentIndex(0);
            }}
            className="h-8 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 text-xs text-[var(--text-primary)] focus:border-blue-600 focus:outline-none"
          >
            <option value="all">Todas as fontes</option>
            <option value="oficial">Provas Oficiais (2014–2021)</option>
            <option value="inedita">Questões Inéditas</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="quiz-filter-type"
            className="mb-1 block text-[11px] font-medium text-[var(--text-muted)]"
          >
            Formato
          </label>
          <select
            id="quiz-filter-type"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as "all" | "objetiva" | "discursiva");
              setCurrentIndex(0);
            }}
            className="h-8 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 text-xs text-[var(--text-primary)] focus:border-blue-600 focus:outline-none"
          >
            <option value="all">Objetivas e Discursivas</option>
            <option value="objetiva">Apenas Objetivas</option>
            <option value="discursiva">Apenas Discursivas</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="quiz-filter-status"
            className="mb-1 block text-[11px] font-medium text-[var(--text-muted)]"
          >
            Status
          </label>
          <select
            id="quiz-filter-status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(
                e.target.value as "all" | "unanswered" | "wrong" | "favorites"
              );
              setCurrentIndex(0);
            }}
            className="h-8 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 text-xs text-[var(--text-primary)] focus:border-blue-600 focus:outline-none"
          >
            <option value="all">Qualquer status</option>
            <option value="unanswered">Ainda não respondidas</option>
            <option value="wrong">Questões que errei</option>
            <option value="favorites">Salvas / Favoritas</option>
          </select>
        </div>
      </section>

      {!activeQuestion ? (
        <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] px-6 py-12 text-center">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Nenhuma questão corresponde aos filtros atuais.
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Limpe ou ajuste os filtros para continuar treinando.
          </p>
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              Restaurar todos os filtros
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-medium text-[var(--text-primary)] tabular-nums">
                Questão {safeIndex + 1} / {filteredQuestions.length}
              </span>
              <span className="hidden text-[11px] text-[var(--text-muted)] sm:inline">
                Atalhos: <kbd className="font-mono">A–E</kbd> responder ·{" "}
                <kbd className="font-mono">←/→</kbd> navegar ·{" "}
                <kbd className="font-mono">F</kbd> salvar
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={safeIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                leftIcon={<ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />}
              >
                Anterior
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={safeIndex >= filteredQuestions.length - 1}
                onClick={() =>
                  setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1))
                }
                rightIcon={<ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
              >
                Próxima
              </Button>
            </div>
          </div>

          <QuestionCard
            question={activeQuestion}
            mode="quiz"
            selectedOption={answersMap[activeQuestion.id] ?? null}
            discursiveDraft={draftsMap[activeQuestion.id] ?? ""}
            discursiveSelfScore={selfScoresMap[activeQuestion.id] ?? null}
            showFeedback={Boolean(answersMap[activeQuestion.id])}
            isFavorite={Boolean(progress.favorites[activeQuestion.id])}
            onSelectOption={handleSelectOption}
            onChangeDiscursiveDraft={(val) =>
              setDraftsMap((prev) => ({ ...prev, [activeQuestion.id]: val }))
            }
            onSetDiscursiveScore={handleDiscursiveScore}
            onToggleFavorite={() => onToggleFavorite(activeQuestion.id)}
            onOpenApostila={onOpenApostila}
          />
        </div>
      )}
    </div>
  );
};
