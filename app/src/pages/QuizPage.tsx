import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, RotateCcw, Shuffle } from "lucide-react";
import type {
  ApostilaArea,
  OptionLetter,
  Question,
  QuestionAttempt,
  StudyProgress,
} from "../types/enade";
import { QuestionCard } from "../components/QuestionCard";

interface QuizPageProps {
  areas: ApostilaArea[];
  questions: Question[];
  progress: StudyProgress;
  initialAreaFilter: string;
  onRecordAttempt: (attempt: QuestionAttempt) => void;
  onToggleFavorite: (questionId: string) => void;
  onOpenApostila: (areaId: string) => void;
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
  const [statusFilter, setStatusFilter] = useState<"all" | "unanswered" | "wrong" | "favorites">("all");
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Estado local da sessão atual do Quiz
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
  }, [questions, areaFilter, sourceFilter, typeFilter, statusFilter, progress.attemptsByQuestion, progress.favorites, shuffleSeed]);

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

  const resetSessionView = () => {
    setAnswersMap({});
    setSelfScoresMap({});
    setCurrentIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Barra de filtros */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
            <Filter className="h-4 w-4 text-blue-600" />
            Quiz Direcionado por Área
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setShuffleSeed((s) => s + 1);
                setCurrentIndex(0);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Shuffle className="h-3.5 w-3.5" /> Embaralhar
            </button>
            <button
              type="button"
              onClick={resetSessionView}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Limpar respostas da sessão
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={areaFilter}
            onChange={(e) => {
              setAreaFilter(e.target.value);
              setCurrentIndex(0);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="all">Todas as áreas ({questions.length})</option>
            {areas.map((a) => (
              <option key={a.areaId} value={a.areaId}>
                {a.shortTitle}
              </option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value as "all" | "oficial" | "inedita");
              setCurrentIndex(0);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="all">Todas as fontes</option>
            <option value="oficial">Provas Oficiais (2014–2021)</option>
            <option value="inedita">Questões Inéditas</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as "all" | "objetiva" | "discursiva");
              setCurrentIndex(0);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="all">Objetivas e Discursivas</option>
            <option value="objetiva">Apenas Objetivas</option>
            <option value="discursiva">Apenas Discursivas</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "all" | "unanswered" | "wrong" | "favorites");
              setCurrentIndex(0);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="all">Qualquer status</option>
            <option value="unanswered">Ainda não respondidas</option>
            <option value="wrong">Questões que errei</option>
            <option value="favorites">Favoritas</option>
          </select>
        </div>
      </div>

      {/* Questão ativa ou estado vazio */}
      {!activeQuestion ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
            Nenhuma questão encontrada para os filtros selecionados.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Ajuste os filtros acima para continuar praticando.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Navegação superior */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Questão {safeIndex + 1} de {filteredQuestions.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safeIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
              <button
                type="button"
                disabled={safeIndex >= filteredQuestions.length - 1}
                onClick={() => setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1))}
                className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40 hover:bg-blue-500"
              >
                Próxima <ChevronRight className="h-4 w-4" />
              </button>
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
