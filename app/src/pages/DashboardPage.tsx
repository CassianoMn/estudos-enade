import React from "react";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Play,
  Search,
} from "lucide-react";
import type { ApostilaArea, Question, StudyProgress } from "../types/enade";
import { computeAreaMetrics, computeStudyStreak, formatDuration } from "../utils/scoring";
import { Button } from "../components/ui/Button";
import { Tag } from "../components/ui/Tag";

interface DashboardPageProps {
  areas: ApostilaArea[];
  questions: Question[];
  progress: StudyProgress;
  onNavigate: (
    tab: "dashboard" | "apostilas" | "quiz" | "simulado" | "metricas",
    opts?: { areaId?: string }
  ) => void;
  onOpenCommandPalette: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  areas,
  questions,
  progress,
  onNavigate,
  onOpenCommandPalette,
}) => {
  const metrics = computeAreaMetrics(areas, questions, progress);
  const totalTopics = areas.reduce((acc, a) => acc + a.topics.length, 0);
  const completedTopicsCount = areas.reduce(
    (acc, a) => acc + a.topics.filter((t) => progress.completedTopics[t.id]).length,
    0
  );
  const topicPercent = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

  const attempts = Object.values(progress.attemptsByQuestion);
  const totalAnswered = attempts.length;
  const totalCorrect = attempts.filter((a) => a.isCorrect).length;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const streak = computeStudyStreak(progress.studyDates);

  const officialCount = questions.filter((q) => q.source === "oficial").length;
  const ineditaCount = questions.filter((q) => q.source === "inedita").length;
  const lastArea = areas.find((a) => a.areaId === progress.lastReadAreaId) ?? areas[0];

  const priorityAreas = [...metrics]
    .sort((a, b) => {
      if (a.answeredUnique === 0 && b.answeredUnique > 0) return -1;
      if (b.answeredUnique === 0 && a.answeredUnique > 0) return 1;
      return a.accuracyPercent - b.accuracyPercent;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Cabeçalho utilitário */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="font-mono uppercase tracking-wider">ENADE · Sistemas de Informação</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {areas.length} apostilas · {questions.length} questões ({officialCount} INEP +{" "}
              {ineditaCount} inéditas)
            </span>
          </div>
          <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">
            Visão Geral dos Estudos
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenCommandPalette}
            leftIcon={<Search className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />}
          >
            <span>Ir para...</span>
            <kbd className="ml-1 hidden rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-1 font-mono text-[10px] text-[var(--text-muted)] sm:inline">
              Ctrl K
            </kbd>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate("apostilas", { areaId: lastArea?.areaId })}
            leftIcon={<BookOpen className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            {progress.lastReadAreaId ? `Continuar: ${lastArea?.shortTitle}` : "Abrir Apostilas"}
          </Button>
          {progress.activeSimulado ? (
            <Button
              variant="accent"
              size="sm"
              onClick={() => onNavigate("simulado")}
              leftIcon={<Clock className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Retomar Simulado ({formatDuration(progress.activeSimulado.remainingSeconds)})
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate("simulado")}
              leftIcon={<Play className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Iniciar Simulado
            </Button>
          )}
        </div>
      </div>

      {/* Faixa compacta de métricas (grid unido por divisórias 1px) */}
      <section
        aria-label="Indicadores principais"
        className="grid grid-cols-2 divide-y divide-[var(--border-subtle)] overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] sm:divide-y-0 sm:divide-x lg:grid-cols-4"
      >
        <div className="p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Apostilas Lidas
          </div>
          <div className="mt-1.5 flex items-baseline gap-2 tabular-nums">
            <span className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
              {topicPercent}%
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {completedTopicsCount}/{totalTopics} módulos
            </span>
          </div>
          <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]">
            <div
              className="h-full bg-zinc-900 transition-all dark:bg-zinc-200"
              style={{ width: `${topicPercent}%` }}
            />
          </div>
        </div>

        <div className="p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Questões Únicas
          </div>
          <div className="mt-1.5 flex items-baseline gap-2 tabular-nums">
            <span className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
              {totalAnswered}
            </span>
            <span className="text-xs text-[var(--text-muted)]">de {questions.length}</span>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)] tabular-nums">
            {progress.attemptHistory.length} resoluções registradas
          </p>
        </div>

        <div className="p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Taxa de Acerto
          </div>
          <div className="mt-1.5 flex items-baseline gap-2 tabular-nums">
            <span className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
              {totalAnswered > 0 ? `${accuracy}%` : "—"}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {totalAnswered > 0 ? `${totalCorrect}/${totalAnswered} acertos` : "sem registros"}
            </span>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)] tabular-nums">
            {progress.simulados.length} simulado(s) finalizado(s)
          </p>
        </div>

        <div className="p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Consistência
          </div>
          <div className="mt-1.5 flex items-baseline gap-2 tabular-nums">
            <span className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
              {streak} {streak === 1 ? "dia" : "dias"}
            </span>
            <span className="text-xs text-[var(--text-muted)]">seguidos</span>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)] tabular-nums">
            {progress.studyDates.length} dia(s) ativo(s) no total
          </p>
        </div>
      </section>

      {/* Conteúdo principal: Tabela de Áreas + Coluna lateral */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Tabela densa das 15 áreas */}
        <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] lg:col-span-8">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Cobertura por Área de Conhecimento
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Progresso nas apostilas e taxa de acerto no banco de questões
              </p>
            </div>
            <Button variant="ghost" size="xs" onClick={() => onNavigate("metricas")}>
              Ver matriz completa
            </Button>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            {metrics.map((m) => {
              const barColor =
                m.answeredUnique === 0
                  ? "bg-zinc-300 dark:bg-zinc-700"
                  : m.accuracyPercent >= 70
                  ? "bg-emerald-600 dark:bg-emerald-500"
                  : m.accuracyPercent >= 50
                  ? "bg-amber-500"
                  : "bg-rose-500";

              return (
                <div
                  key={m.areaId}
                  className="group flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--bg-hover)]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigate("apostilas", { areaId: m.areaId })}
                        className="truncate text-left text-[13px] font-medium text-[var(--text-primary)] hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:text-blue-400"
                      >
                        {m.areaName}
                      </button>
                      <span className="shrink-0 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                        {m.topicsCompleted}/{m.topicsTotal} mód.
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2.5">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                        <div
                          className={`h-full rounded-full transition-all ${barColor}`}
                          style={{
                            width: `${m.answeredUnique > 0 ? Math.max(m.accuracyPercent, 4) : 0}%`,
                          }}
                        />
                      </div>
                      <span className="w-24 shrink-0 text-right font-mono text-[11px] text-[var(--text-secondary)] tabular-nums">
                        {m.answeredUnique > 0
                          ? `${m.accuracyPercent}% (${m.correctUnique}/${m.answeredUnique})`
                          : `0/${m.totalInBank} q.`}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onNavigate("apostilas", { areaId: m.areaId })}
                    >
                      Ler
                    </Button>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => onNavigate("quiz", { areaId: m.areaId })}
                    >
                      Treinar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Rail lateral: Fila de prioridade e Simulados recentes */}
        <aside className="space-y-6 lg:col-span-4">
          <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="border-b border-[var(--border-subtle)] px-4 py-3">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Próximos Focos Sugeridos
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Áreas não iniciadas ou com menor aproveitamento
              </p>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {priorityAreas.map((m) => (
                <div
                  key={m.areaId}
                  className="flex items-center justify-between gap-3 px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                      {m.areaName}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] tabular-nums">
                      {m.answeredUnique === 0
                        ? `${m.totalInBank} questões disponíveis`
                        : `${m.accuracyPercent}% de acerto · ${m.topicsCompleted}/${m.topicsTotal} módulos`}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => onNavigate("quiz", { areaId: m.areaId })}
                    rightIcon={<ArrowRight className="h-3 w-3" aria-hidden="true" />}
                  >
                    Quiz
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Simulados Recentes
              </h2>
              <Button variant="ghost" size="xs" onClick={() => onNavigate("simulado")}>
                Ver modos
              </Button>
            </div>
            {progress.simulados.length === 0 ? (
              <div className="px-4 py-5 text-xs leading-relaxed text-[var(--text-muted)]">
                Nenhum simulado finalizado ainda. Escolha uma prova oficial do INEP ou o modo
                rápido para registrar seu primeiro diagnóstico.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-subtle)]">
                {progress.simulados.slice(0, 4).map((sim) => (
                  <div
                    key={sim.id}
                    className="flex items-center justify-between gap-3 px-4 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                        {sim.title}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] tabular-nums">
                        {new Date(sim.finishedAt).toLocaleDateString("pt-BR")} ·{" "}
                        {sim.correctCount}/{sim.totalQuestions} acertos
                      </p>
                    </div>
                    <Tag
                      tone={
                        sim.scorePercent >= 70
                          ? "success"
                          : sim.scorePercent >= 50
                          ? "warning"
                          : "danger"
                      }
                      mono
                    >
                      {sim.scorePercent}%
                    </Tag>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};
