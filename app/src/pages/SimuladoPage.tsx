import React, { useEffect, useMemo, useRef, useState } from "react";
import {
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
import { Button } from "../components/ui/Button";
import { Tag } from "../components/ui/Tag";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

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

const OPTION_LETTERS: OptionLetter[] = ["A", "B", "C", "D", "E"];

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

const MODE_CARDS: Array<{
  mode: SimuladoMode;
  title: string;
  subtitle: string;
  badge: string;
  tone: "accent" | "success" | "neutral";
  duration: string;
  questionsInfo: string;
}> = [
  {
    mode: "oficial-2021",
    title: "ENADE Oficial 2021",
    subtitle: "Prova completa de Sistemas de Informação aplicada pelo INEP em 2021.",
    badge: "INEP 2021",
    tone: "accent",
    duration: "04:00:00",
    questionsInfo: "40 questões (FG + CE)",
  },
  {
    mode: "oficial-2017",
    title: "ENADE Oficial 2017",
    subtitle: "Prova completa de Sistemas de Informação aplicada pelo INEP em 2017.",
    badge: "INEP 2017",
    tone: "accent",
    duration: "04:00:00",
    questionsInfo: "40 questões (FG + CE)",
  },
  {
    mode: "oficial-2014",
    title: "ENADE Oficial 2014",
    subtitle: "Prova completa de Sistemas de Informação aplicada pelo INEP em 2014.",
    badge: "INEP 2014",
    tone: "accent",
    duration: "04:00:00",
    questionsInfo: "40 questões (FG + CE)",
  },
  {
    mode: "inedito-completo",
    title: "Simulado Inédito Completo",
    subtitle: "40 questões inéditas balanceadas no padrão ENADE (8 FG + 32 Específicas).",
    badge: "INÉDITO",
    tone: "success",
    duration: "04:00:00",
    questionsInfo: "40 questões inéditas",
  },
  {
    mode: "simulado-rapido",
    title: "Simulado Rápido",
    subtitle: "Treino cronometrado enxuto combinando provas oficiais e questões inéditas.",
    badge: "TREINO ÁGIL",
    tone: "neutral",
    duration: "01:30:00",
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
  const [confirmFinishOpen, setConfirmFinishOpen] = useState(false);
  const [confirmAbandonOpen, setConfirmAbandonOpen] = useState(false);
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
  const onTickTimerRef = useRef(onTickTimer);
  onTickTimerRef.current = onTickTimer;

  const handleSubmitRef = useRef<(snapshot: ActiveSimulado) => void>(() => {});

  useEffect(() => {
    if (!active?.id) return;
    const timer = window.setInterval(() => {
      onTickTimerRef.current();
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active?.id]);

  useEffect(() => {
    if (active && active.remainingSeconds <= 0) {
      handleSubmitRef.current(active);
    }
  }, [active]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isTypingTarget(e.target)) return;
      if (confirmFinishOpen || confirmAbandonOpen) return;

      if (active) {
        const simQuestions = active.questionIds
          .map((id) => questionsById.get(id))
          .filter((q): q is Question => Boolean(q));
        const activeQ = simQuestions[active.currentIndex];
        if (!activeQ) return;

        if (e.key === "ArrowLeft") {
          e.preventDefault();
          onUpdateActive({
            ...active,
            currentIndex: Math.max(0, active.currentIndex - 1),
          });
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          onUpdateActive({
            ...active,
            currentIndex: Math.min(simQuestions.length - 1, active.currentIndex + 1),
          });
        } else if (activeQ.type === "objetiva") {
          const upper = e.key.toUpperCase() as OptionLetter;
          const numIdx = Number(e.key) - 1;
          const chosen = OPTION_LETTERS.includes(upper)
            ? upper
            : numIdx >= 0 && numIdx < OPTION_LETTERS.length
            ? OPTION_LETTERS[numIdx]
            : null;
          if (chosen) {
            e.preventDefault();
            onUpdateActive({
              ...active,
              answers: {
                ...active.answers,
                [activeQ.id]: {
                  ...active.answers[activeQ.id],
                  selectedOption: chosen,
                },
              },
            });
          }
        }
      } else if (reviewRecord) {
        const len = reviewRecord.questionIds.length;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setReviewIndex((i) => Math.max(0, i - 1));
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          setReviewIndex((i) => Math.min(len - 1, i + 1));
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

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
    setConfirmFinishOpen(false);
    setConfirmAbandonOpen(false);
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
        return q.type === "objetiva"
          ? Boolean(ans?.selectedOption)
          : Boolean(ans?.discursiveDraft?.trim());
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

    setConfirmFinishOpen(false);
    setReviewRecord(record);
    setReviewIndex(0);
    onFinishSimulado(record, attempts);
  };

  handleSubmitRef.current = handleSubmitActive;

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
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Tag tone="success">CONCLUÍDO</Tag>
              <span className="text-xs text-[var(--text-muted)] tabular-nums">
                {new Date(reviewRecord.finishedAt).toLocaleString("pt-BR")} · Tempo:{" "}
                {formatDuration(reviewRecord.elapsedSeconds)}
              </span>
            </div>
            <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
              {reviewRecord.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right tabular-nums">
              <div className="font-mono text-2xl font-semibold text-[var(--text-primary)]">
                {reviewRecord.scorePercent}%
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {reviewRecord.correctCount}/{reviewRecord.totalQuestions} acertos
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setReviewRecord(null);
                onClearReviewRecord();
              }}
            >
              Voltar aos modos
            </Button>
          </div>
        </div>

        {activeQ && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Gabarito ({simQuestions.length})
                </h2>
                <div className="grid grid-cols-5 gap-1.5">
                  {simQuestions.map((q, idx) => {
                    const ans = reviewRecord.answers[q.id];
                    const ok = isSimuladoAnswerCorrect(q, ans);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setReviewIndex(idx)}
                        className={`rounded-md border py-1.5 font-mono text-xs font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                          idx === reviewIndex
                            ? "ring-2 ring-blue-600 ring-offset-1 ring-offset-[var(--bg-surface)]"
                            : ""
                        } ${
                          ok
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-300"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <div className="space-y-4 lg:col-span-8 xl:col-span-9">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-[var(--text-secondary)] tabular-nums">
                  Revisão {reviewIndex + 1} / {simQuestions.length}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={reviewIndex === 0}
                    onClick={() => setReviewIndex((i) => Math.max(0, i - 1))}
                    leftIcon={<ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={reviewIndex >= simQuestions.length - 1}
                    onClick={() =>
                      setReviewIndex((i) => Math.min(simQuestions.length - 1, i + 1))
                    }
                    rightIcon={<ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
                  >
                    Próxima
                  </Button>
                </div>
              </div>

              <QuestionCard
                question={activeQ}
                mode="simulado-review"
                selectedOption={reviewRecord.answers[activeQ.id]?.selectedOption ?? null}
                discursiveDraft={reviewRecord.answers[activeQ.id]?.discursiveDraft ?? ""}
                discursiveSelfScore={
                  reviewRecord.answers[activeQ.id]?.discursiveSelfScore ?? null
                }
                isFavorite={Boolean(progress.favorites[activeQ.id])}
                onSetDiscursiveScore={(score) =>
                  handleUpdateReviewDiscursive(activeQ.id, score)
                }
                onToggleFavorite={() => onToggleFavorite(activeQ.id)}
                onOpenApostila={onOpenApostila}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (active) {
    const simQuestions = active.questionIds
      .map((id) => questionsById.get(id))
      .filter((q): q is Question => Boolean(q));
    const activeQ = simQuestions[active.currentIndex] ?? simQuestions[0];
    const answeredCount = simQuestions.filter((q) => {
      const a = active.answers[q.id];
      return q.type === "objetiva"
        ? Boolean(a?.selectedOption)
        : Boolean(a?.discursiveDraft?.trim());
    }).length;
    const unansweredCount = simQuestions.length - answeredCount;
    const isLowTime = active.remainingSeconds < 15 * 60;

    const updateAnswer = (
      qId: string,
      patch: Partial<{ selectedOption: OptionLetter; discursiveDraft: string; flagged: boolean }>
    ) => {
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
        <header className="sticky top-2 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 px-4 py-3 backdrop-blur">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Tag tone="accent">MODO PROVA</Tag>
              <h1 className="truncate text-sm font-semibold text-[var(--text-primary)]">
                {active.title}
              </h1>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
              {answeredCount}/{simQuestions.length} respondidas · salvamento automático
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex h-8 items-center gap-2 rounded-md border px-3 font-mono text-xs font-semibold tabular-nums ${
                isLowTime
                  ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                  : "border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-primary)]"
              }`}
              aria-label={`Tempo restante: ${formatDuration(active.remainingSeconds)}`}
            >
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDuration(active.remainingSeconds)}
            </div>

            <Button
              variant="accent"
              size="sm"
              onClick={() => setConfirmFinishOpen(true)}
              leftIcon={<Send className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Entregar Prova
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-20 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Cartão de Questões
              </h2>
              <div className="grid grid-cols-5 gap-1.5">
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
                      className={`relative rounded-md border py-1.5 font-mono text-xs font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                        isCurrent
                          ? "ring-2 ring-blue-600 ring-offset-1 ring-offset-[var(--bg-surface)]"
                          : ""
                      } ${
                        isFlagged
                          ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700/70 dark:bg-amber-950/50 dark:text-amber-200"
                          : isAnswered
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                          : "border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <Flag
                          className="absolute top-0.5 right-0.5 h-2 w-2 text-amber-600 dark:text-amber-400"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 border-t border-[var(--border-subtle)] pt-3 text-[11px] text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-zinc-900 dark:bg-zinc-100" />{" "}
                  Respondida
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm border border-amber-400 bg-amber-100 dark:bg-amber-900" />{" "}
                  Revisar
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm border border-[var(--border-subtle)] bg-[var(--bg-subtle)]" />{" "}
                  Aberta
                </span>
              </div>

              <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full"
                  onClick={() => setConfirmAbandonOpen(true)}
                >
                  Abandonar Simulado
                </Button>
              </div>
            </div>
          </aside>

          {activeQ && (
            <div className="space-y-4 lg:col-span-8 xl:col-span-9">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-medium text-[var(--text-primary)] tabular-nums">
                    Questão {active.currentIndex + 1} / {simQuestions.length}
                  </span>
                  <span className="hidden text-[11px] text-[var(--text-muted)] sm:inline">
                    <kbd className="font-mono">A–E</kbd> marcar ·{" "}
                    <kbd className="font-mono">←/→</kbd> navegar
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={active.currentIndex === 0}
                    onClick={() =>
                      onUpdateActive({
                        ...active,
                        currentIndex: Math.max(0, active.currentIndex - 1),
                      })
                    }
                    leftIcon={<ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={active.currentIndex >= simQuestions.length - 1}
                    onClick={() =>
                      onUpdateActive({
                        ...active,
                        currentIndex: Math.min(
                          simQuestions.length - 1,
                          active.currentIndex + 1
                        ),
                      })
                    }
                    rightIcon={<ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
                  >
                    Próxima
                  </Button>
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
                  updateAnswer(activeQ.id, {
                    flagged: !active.answers[activeQ.id]?.flagged,
                  })
                }
                onToggleFavorite={() => onToggleFavorite(activeQ.id)}
              />
            </div>
          )}
        </div>

        <ConfirmDialog
          open={confirmFinishOpen}
          title="Entregar simulado?"
          description={
            unansweredCount > 0
              ? `Você respondeu ${answeredCount} de ${simQuestions.length} questões (${unansweredCount} em branco). Ao entregar, o gabarito comentado será liberado e o resultado salvo no histórico.`
              : `Todas as ${simQuestions.length} questões foram respondidas. Deseja finalizar e corrigir a prova agora?`
          }
          confirmLabel="Entregar e Corrigir"
          onConfirm={() => handleSubmitActive(active)}
          onCancel={() => setConfirmFinishOpen(false)}
        />

        <ConfirmDialog
          open={confirmAbandonOpen}
          title="Abandonar simulado em andamento?"
          description="As respostas marcadas nesta tentativa serão descartadas e não entrarão nas suas métricas."
          confirmLabel="Abandonar"
          destructive
          onConfirm={() => {
            setConfirmAbandonOpen(false);
            onUpdateActive(null);
          }}
          onCancel={() => setConfirmAbandonOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
          Ambiente de Prova
        </span>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          Simulados Cronometrados ENADE
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
          Reproduza as condições oficiais de prova (4 horas, gabarito liberado apenas após a
          entrega) ou realize um treino rápido. O andamento é salvo automaticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MODE_CARDS.map((card) => (
          <div
            key={card.mode}
            className="flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-colors hover:border-[var(--border-strong)]"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <Tag tone={card.tone} mono>
                  {card.badge}
                </Tag>
                <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                  {card.duration}
                </span>
              </div>
              <h2 className="mt-3 text-base font-semibold text-[var(--text-primary)]">
                {card.title}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                {card.subtitle}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3.5">
              <span className="text-xs text-[var(--text-muted)] tabular-nums">
                {card.questionsInfo}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => startSimulado(card.mode)}
                leftIcon={<Play className="h-3.5 w-3.5" aria-hidden="true" />}
              >
                Iniciar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
