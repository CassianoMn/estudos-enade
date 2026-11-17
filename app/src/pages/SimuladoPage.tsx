import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Play,
  Send,
} from "lucide-react";
import type {
  ActiveSimulado,
  OptionLetter,
  Question,
  QuestionAttempt,
  SimuladoMode,
  SimuladoRecord,
  StudyProgress,
} from "../types/enade";
import {
  buildSimuladoQuestions,
  evaluateSimulado,
  formatDuration,
  isSimuladoAnswerCorrect,
} from "../utils/scoring";
import { QuestionCard } from "../components/QuestionCard";

interface SimuladoPageProps {
  questions: Question[];
  progress: StudyProgress;
  selectedReviewRecordId: string | null;
  onClearReviewRecord: () => void;
  onUpdateActive: (active: ActiveSimulado | null) => void;
  onTickTimer: () => void;
  onFinishSimulado: (record: SimuladoRecord, attempts: QuestionAttempt[]) => void;
  onUpdateHistoricalSimulado: (updated: SimuladoRecord) => void;
  onToggleFavorite: (questionId: string) => void;
  onOpenApostila: (areaId: string) => void;
}

const MODE_CARDS: Array<{
  mode: SimuladoMode;
  title: string;
  subtitle: string;
  badge: string;
  duration: string;
  questionsInfo: string;
}> = [
  {
    mode: "oficial-2021",
    title: "ENADE Oficial 2021",
    subtitle: "Prova completa de Sistemas de Informação aplicada pelo INEP em 2021.",
    badge: "Oficial INEP",
    duration: "4h 00min",
    questionsInfo: "40 questões (FG + CE)",
  },
  {
    mode: "oficial-2017",
    title: "ENADE Oficial 2017",
    subtitle: "Prova completa de Sistemas de Informação aplicada pelo INEP em 2017.",
    badge: "Oficial INEP",
    duration: "4h 00min",
    questionsInfo: "40 questões (FG + CE)",
  },
  {
    mode: "oficial-2014",
    title: "ENADE Oficial 2014",
    subtitle: "Prova completa de Sistemas de Informação aplicada pelo INEP em 2014.",
    badge: "Oficial INEP",
    duration: "4h 00min",
    questionsInfo: "40 questões (FG + CE)",
  },
  {
    mode: "inedito-completo",
    title: "Simulado Inédito Completo",
    subtitle: "40 questões inéditas balanceadas no padrão ENADE (8 FG + 32 Específicas).",
    badge: "Inédito 2026",
    duration: "4h 00min",
    questionsInfo: "40 questões inéditas",
  },
  {
    mode: "simulado-rapido",
    title: "Simulado Rápido",
    subtitle: "Treino cronometrado enxuto misturando provas oficiais e inéditas.",
    badge: "Treino Ágil",
    duration: "1h 30min",
    questionsInfo: "15 questões",
  },
];

export const SimuladoPage: React.FC<SimuladoPageProps> = ({
  questions,
  progress,
  selectedReviewRecordId,
  onClearReviewRecord,
  onUpdateActive,
  onTickTimer,
  onFinishSimulado,
  onUpdateHistoricalSimulado,
  onToggleFavorite,
  onOpenApostila,
}) => {
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [reviewRecord, setReviewRecord] = useState<SimuladoRecord | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  const questionsById = useMemo(() => {
    const map = new Map<string, Question>();
    for (const q of questions) map.set(q.id, q);
    return map;
  }, [questions]);

  useEffect(() => {
    if (selectedReviewRecordId) {
      const found = progress.simulados.find((s) => s.id === selectedReviewRecordId) ?? null;
      setReviewRecord(found);
      setReviewIndex(0);
    }
  }, [selectedReviewRecordId, progress.simulados]);

  const active = progress.activeSimulado;

  // Cronômetro regressivo com atualização funcional (sem sobrescrever respostas)
  useEffect(() => {
    if (!active?.id) return;
    const timer = window.setInterval(() => {
      onTickTimer();
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  // Entrega automática quando o tempo zera
  useEffect(() => {
    if (active && active.remainingSeconds <= 0) {
      handleSubmitActive(active);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.remainingSeconds]);

  const startSimulado = (mode: SimuladoMode) => {
    const built = buildSimuladoQuestions(mode, questions);
    const nextActive: ActiveSimulado = {
      id: `sim-${Date.now()}`,
      mode,
      title: built.title,
      questionIds: built.questions.map((q) => q.id),
      durationSeconds: built.durationSeconds,
      remainingSeconds: built.durationSeconds,
      startedAt: new Date().toISOString(),
      currentIndex: 0,
      answers: {},
    };
    setReviewRecord(null);
    onClearReviewRecord();
    setConfirmFinish(false);
    onUpdateActive(nextActive);
  };

  const handleSubmitActive = (snapshot: ActiveSimulado) => {
    const simQuestions = snapshot.questionIds
      .map((id) => questionsById.get(id))
      .filter((q): q is Question => Boolean(q));
    const finishedAt = new Date().toISOString();
    const elapsed = Math.max(1, snapshot.durationSeconds - snapshot.remainingSeconds);

    const record = evaluateSimulado(simQuestions, snapshot.answers, {
      id: snapshot.id,
      mode: snapshot.mode,
      title: snapshot.title,
      startedAt: snapshot.startedAt,
      finishedAt,
      durationSeconds: snapshot.durationSeconds,
      elapsedSeconds: elapsed,
    });

    const avgPerQ = Math.max(1, Math.round(elapsed / Math.max(1, simQuestions.length)));
    const attempts: QuestionAttempt[] = simQuestions
      .filter((q) => {
        const ans = snapshot.answers[q.id];
        return q.type === "objetiva" ? Boolean(ans?.selectedOption) : Boolean(ans?.discursiveDraft?.trim());
      })
      .map((q) => {
        const ans = snapshot.answers[q.id];
        return {
          questionId: q.id,
          areaId: q.areaId,
          source: q.source,
          type: q.type,
          selectedOption: ans?.selectedOption ?? null,
          discursiveDraft: ans?.discursiveDraft,
          discursiveSelfScore: ans?.discursiveSelfScore ?? null,
          isCorrect: isSimuladoAnswerCorrect(q, ans),
          timeSpentSeconds: avgPerQ,
          answeredAt: finishedAt,
        };
      });

    setConfirmFinish(false);
    setReviewRecord(record);
    setReviewIndex(0);
    onFinishSimulado(record, attempts);
  };

  // Tela 1: Revisão pós-entrega ou histórica
  if (reviewRecord && !active) {
    const simQuestions = reviewRecord.questionIds
      .map((id) => questionsById.get(id))
      .filter((q): q is Question => Boolean(q));
    const activeQ = simQuestions[reviewIndex];

    const handleUpdateReviewDiscursive = (qId: string, score: 0 | 0.5 | 1) => {
      const updatedAnswers = {
        ...reviewRecord.answers,
        [qId]: {
          ...reviewRecord.answers[qId],
          discursiveSelfScore: score,
        },
      };
      const recalculated = evaluateSimulado(simQuestions, updatedAnswers, {
        id: reviewRecord.id,
        mode: reviewRecord.mode,
        title: reviewRecord.title,
        startedAt: reviewRecord.startedAt,
        finishedAt: reviewRecord.finishedAt,
        durationSeconds: reviewRecord.durationSeconds,
        elapsedSeconds: reviewRecord.elapsedSeconds,
      });
      setReviewRecord(recalculated);
      onUpdateHistoricalSimulado(recalculated);
    };

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Award className="h-3.5 w-3.5" /> Resultado do Simulado
              </span>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {reviewRecord.title}
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Concluído em {new Date(reviewRecord.finishedAt).toLocaleString("pt-BR")} • Tempo
                utilizado: {formatDuration(reviewRecord.elapsedSeconds)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  {reviewRecord.scorePercent}%
                </div>
                <div className="text-xs text-slate-500">
                  {reviewRecord.correctCount}/{reviewRecord.totalQuestions} acertos
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReviewRecord(null);
                  onClearReviewRecord();
                }}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Voltar aos Modos
              </button>
            </div>
          </div>
        </div>

        {activeQ && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Gabarito da Prova
                </h2>
                <div className="grid grid-cols-5 gap-2">
                  {simQuestions.map((q, idx) => {
                    const ans = reviewRecord.answers[q.id];
                    const ok = isSimuladoAnswerCorrect(q, ans);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setReviewIndex(idx)}
                        className={`rounded-lg py-2 text-xs font-bold transition ${
                          idx === reviewIndex ? "ring-2 ring-blue-600 ring-offset-1" : ""
                        } ${
                          ok
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-8 xl:col-span-9">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Revisão {reviewIndex + 1} de {simQuestions.length}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={reviewIndex === 0}
                    onClick={() => setReviewIndex((i) => Math.max(0, i - 1))}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <ChevronLeft className="h-4 w-4" /> Anterior
                  </button>
                  <button
                    type="button"
                    disabled={reviewIndex >= simQuestions.length - 1}
                    onClick={() => setReviewIndex((i) => Math.min(simQuestions.length - 1, i + 1))}
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                  >
                    Próxima <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <QuestionCard
                question={activeQ}
                mode="simulado-review"
                selectedOption={reviewRecord.answers[activeQ.id]?.selectedOption ?? null}
                discursiveDraft={reviewRecord.answers[activeQ.id]?.discursiveDraft ?? ""}
                discursiveSelfScore={reviewRecord.answers[activeQ.id]?.discursiveSelfScore ?? null}
                isFavorite={Boolean(progress.favorites[activeQ.id])}
                onSetDiscursiveScore={(score) => handleUpdateReviewDiscursive(activeQ.id, score)}
                onToggleFavorite={() => onToggleFavorite(activeQ.id)}
                onOpenApostila={onOpenApostila}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Tela 2: Simulado em andamento
  if (active) {
    const simQuestions = active.questionIds
      .map((id) => questionsById.get(id))
      .filter((q): q is Question => Boolean(q));
    const activeQ = simQuestions[active.currentIndex] ?? simQuestions[0];
    const answeredCount = simQuestions.filter((q) => {
      const a = active.answers[q.id];
      return q.type === "objetiva" ? Boolean(a?.selectedOption) : Boolean(a?.discursiveDraft?.trim());
    }).length;
    const isLowTime = active.remainingSeconds < 15 * 60;

    const updateAnswer = (qId: string, patch: Partial<{ selectedOption: OptionLetter; discursiveDraft: string; flagged: boolean }>) => {
      onUpdateActive({
        ...active,
        answers: {
          ...active.answers,
          [qId]: {
            ...active.answers[qId],
            ...patch,
          },
        },
      });
    };

    return (
      <div className="space-y-5">
        {/* Barra de controle e cronômetro */}
        <div className="sticky top-16 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">{active.title}</h1>
            <p className="text-xs text-slate-500">
              {answeredCount} de {simQuestions.length} respondidas • Salvamento automático ativo
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-mono text-sm font-bold ${
                isLowTime
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                  : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
              }`}
            >
              <Clock className="h-4 w-4" />
              {formatDuration(active.remainingSeconds)}
            </div>

            {!confirmFinish ? (
              <button
                type="button"
                onClick={() => setConfirmFinish(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
              >
                <Send className="h-3.5 w-3.5" /> Entregar Simulado
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 dark:border-amber-700 dark:bg-amber-950/40">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  Confirmar entrega?
                </span>
                <button
                  type="button"
                  onClick={() => handleSubmitActive(active)}
                  className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white"
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmFinish(false)}
                  className="rounded-lg bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-800"
                >
                  Não
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Cartão de respostas lateral */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                Cartão de Questões
              </h2>
              <div className="grid grid-cols-5 gap-2">
                {simQuestions.map((q, idx) => {
                  const ans = active.answers[q.id];
                  const isAnswered =
                    q.type === "objetiva"
                      ? Boolean(ans?.selectedOption)
                      : Boolean(ans?.discursiveDraft?.trim());
                  const isFlagged = Boolean(ans?.flagged);
                  const isCurrent = idx === active.currentIndex;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => onUpdateActive({ ...active, currentIndex: idx })}
                      className={`relative rounded-lg py-2 text-xs font-bold transition ${
                        isCurrent ? "ring-2 ring-blue-600 ring-offset-1" : ""
                      } ${
                        isFlagged
                          ? "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200"
                          : isAnswered
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <Flag className="absolute top-0.5 right-0.5 h-2.5 w-2.5 text-amber-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500 dark:border-slate-800">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded bg-blue-600" /> Respondida
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded bg-amber-300" /> Revisar
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded bg-slate-200 dark:bg-slate-700" /> Em branco
                </span>
              </div>

              <button
                type="button"
                onClick={() => onUpdateActive(null)}
                className="mt-4 w-full rounded-xl border border-rose-200 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
              >
                Abandonar Simulado
              </button>
            </div>
          </aside>

          {/* Questão atual */}
          {activeQ && (
            <div className="space-y-4 lg:col-span-8 xl:col-span-9">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Questão {active.currentIndex + 1} de {simQuestions.length}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={active.currentIndex === 0}
                    onClick={() =>
                      onUpdateActive({
                        ...active,
                        currentIndex: Math.max(0, active.currentIndex - 1),
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <ChevronLeft className="h-4 w-4" /> Anterior
                  </button>
                  <button
                    type="button"
                    disabled={active.currentIndex >= simQuestions.length - 1}
                    onClick={() =>
                      onUpdateActive({
                        ...active,
                        currentIndex: Math.min(simQuestions.length - 1, active.currentIndex + 1),
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                  >
                    Próxima <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <QuestionCard
                question={activeQ}
                mode="simulado-active"
                selectedOption={active.answers[activeQ.id]?.selectedOption ?? null}
                discursiveDraft={active.answers[activeQ.id]?.discursiveDraft ?? ""}
                flagged={Boolean(active.answers[activeQ.id]?.flagged)}
                isFavorite={Boolean(progress.favorites[activeQ.id])}
                onSelectOption={(letter) => updateAnswer(activeQ.id, { selectedOption: letter })}
                onChangeDiscursiveDraft={(val) =>
                  updateAnswer(activeQ.id, { discursiveDraft: val })
                }
                onToggleFlag={() =>
                  updateAnswer(activeQ.id, { flagged: !active.answers[activeQ.id]?.flagged })
                }
                onToggleFavorite={() => onToggleFavorite(activeQ.id)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tela 3: Escolha de modo do simulado
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Simulados Cronometrados ENADE
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Reproduza as condições reais da prova (4 horas, gabarito revelado somente após a entrega)
          ou faça um treino rápido cronometrado. Seu andamento é salvo automaticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MODE_CARDS.map((card) => (
          <div
            key={card.mode}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                {card.badge}
              </span>
              <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{card.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {card.subtitle}
              </p>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {card.duration}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {card.questionsInfo}
                </span>
              </div>
              <button
                type="button"
                onClick={() => startSimulado(card.mode)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
              >
                <Play className="h-4 w-4" /> Iniciar Simulado
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
