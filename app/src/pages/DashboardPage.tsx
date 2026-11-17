import React from "react";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Play,
  Target,
} from "lucide-react";
import type { ApostilaArea, Question, StudyProgress } from "../types/enade";
import { computeAreaMetrics, computeStudyStreak } from "../utils/scoring";

interface DashboardPageProps {
  areas: ApostilaArea[];
  questions: Question[];
  progress: StudyProgress;
  onNavigate: (tab: "dashboard" | "apostilas" | "quiz" | "simulado" | "metricas", opts?: { areaId?: string }) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  areas,
  questions,
  progress,
  onNavigate,
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

  const lastArea = areas.find((a) => a.areaId === progress.lastReadAreaId) ?? areas[0];

  // Priorizar áreas com menor taxa de acerto (dentre respondidas) ou ainda não iniciadas
  const priorityAreas = [...metrics]
    .sort((a, b) => {
      if (a.answeredUnique === 0 && b.answeredUnique > 0) return -1;
      if (b.answeredUnique === 0 && a.answeredUnique > 0) return 1;
      return a.accuracyPercent - b.accuracyPercent;
    })
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              ENADE • Sistemas de Informação
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Central de Estudos Unificada
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-blue-100 sm:text-base">
              {areas.length} apostilas consolidadas ({totalTopics} módulos) e {questions.length}{" "}
              questões no banco ({questions.filter((q) => q.source === "oficial").length} oficiais
              2014–2021 + {questions.filter((q) => q.source === "inedita").length} inéditas estilo INEP).
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {progress.activeSimulado ? (
              <button
                type="button"
                onClick={() => onNavigate("simulado")}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow hover:bg-amber-300"
              >
                <Clock className="h-4 w-4" />
                Retomar Simulado em Andamento
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate("simulado")}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-900 shadow hover:bg-blue-50"
              >
                <Play className="h-4 w-4" />
                Iniciar Simulado Cronometrado
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate("apostilas", { areaId: lastArea?.areaId })}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
            >
              <BookOpen className="h-4 w-4" />
              {progress.lastReadAreaId ? `Continuar: ${lastArea?.shortTitle}` : "Explorar Apostilas"}
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wide">Apostilas Lidas</span>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{topicPercent}%</span>
            <span className="text-xs text-slate-500">
              ({completedTopicsCount}/{totalTopics} módulos)
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${topicPercent}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wide">Questões Resolvidas</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalAnswered}</span>
            <span className="text-xs text-slate-500">de {questions.length} únicas</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {progress.attemptHistory.length} resoluções totais no histórico
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wide">Taxa de Acerto</span>
            <Target className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{accuracy}%</span>
            <span className="text-xs text-slate-500">
              ({totalCorrect}/{totalAnswered} acertos)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {progress.simulados.length} simulado(s) concluído(s)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wide">Sequência de Estudos</span>
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {streak} {streak === 1 ? "dia" : "dias"}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {progress.studyDates.length} dia(s) ativo(s) no total
          </p>
        </div>
      </div>

      {/* Áreas prioritárias + Mapa de desempenho */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Desempenho por Área de Conhecimento
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Clique em qualquer área para treinar questões direcionadas no Quiz
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("metricas")}
              className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Ver relatório completo
            </button>
          </div>
          <div className="space-y-3">
            {metrics.map((m) => (
              <button
                key={m.areaId}
                type="button"
                onClick={() => onNavigate("quiz", { areaId: m.areaId })}
                className="group block w-full rounded-xl p-2 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
                    {m.areaName}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {m.answeredUnique > 0
                      ? `${m.accuracyPercent}% (${m.correctUnique}/${m.answeredUnique})`
                      : `0/${m.totalInBank} questões`}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      m.answeredUnique === 0
                        ? "bg-slate-300 dark:bg-slate-700"
                        : m.accuracyPercent >= 70
                        ? "bg-emerald-500"
                        : m.accuracyPercent >= 50
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${m.answeredUnique > 0 ? m.accuracyPercent : 0}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Coluna direita: Prioridades & Últimos simulados */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Áreas para Priorizar
              </h2>
            </div>
            <div className="space-y-2.5">
              {priorityAreas.map((m) => (
                <div
                  key={m.areaId}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {m.areaName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {m.answeredUnique === 0
                        ? "Ainda não praticada"
                        : `${m.accuracyPercent}% de acerto • ${m.topicsCompleted}/${m.topicsTotal} tópicos`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate("quiz", { areaId: m.areaId })}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    Treinar <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Últimos Simulados
              </h2>
            </div>
            {progress.simulados.length === 0 ? (
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Você ainda não finalizou nenhum simulado cronometrado. Faça um simulado completo ou
                rápido para acompanhar sua evolução!
              </p>
            ) : (
              <div className="space-y-2">
                {progress.simulados.slice(0, 3).map((sim) => (
                  <div
                    key={sim.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-2.5 text-xs dark:border-slate-800"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{sim.title}</p>
                      <p className="text-slate-500">
                        {new Date(sim.finishedAt).toLocaleDateString("pt-BR")} • {sim.correctCount}/
                        {sim.totalQuestions} acertos
                      </p>
                    </div>
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {sim.scorePercent}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
