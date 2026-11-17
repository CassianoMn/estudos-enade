import React, { useRef, useState } from "react";
import {
  BarChart3,
  Download,
  Eye,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";
import type { ApostilaArea, Question, StudyProgress } from "../types/enade";
import { computeAreaMetrics, formatDuration } from "../utils/scoring";
import { exportProgressJson, parseImportedProgressJson } from "../store/progressStore";

interface MetricasPageProps {
  areas: ApostilaArea[];
  questions: Question[];
  progress: StudyProgress;
  onImportProgress: (imported: StudyProgress) => void;
  onResetProgress: () => void;
  onTrainArea: (areaId: string) => void;
  onReviewSimulado: (simuladoId: string) => void;
}

export const MetricasPage: React.FC<MetricasPageProps> = ({
  areas,
  questions,
  progress,
  onImportProgress,
  onResetProgress,
  onTrainArea,
  onReviewSimulado,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const metrics = computeAreaMetrics(areas, questions, progress);

  const handleExport = () => {
    const json = exportProgressJson(progress);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `progresso-enade-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedbackMsg({ kind: "ok", text: "Backup exportado com sucesso!" });
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseImportedProgressJson(text);
      onImportProgress(parsed);
      setFeedbackMsg({ kind: "ok", text: "Progresso importado e restaurado com sucesso!" });
    } catch (err) {
      setFeedbackMsg({
        kind: "err",
        text: err instanceof Error ? err.message : "Erro ao importar arquivo JSON.",
      });
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Backup e Salvamento de Progresso */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Métricas de Desempenho & Salvamento de Progresso
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Seu progresso é salvo automaticamente no navegador. Exporte um arquivo JSON sempre que
              quiser transferir seus estudos para outro computador.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500"
            >
              <Download className="h-4 w-4" /> Exportar JSON
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Upload className="h-4 w-4" /> Importar JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="hidden"
            />
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400"
              >
                <Trash2 className="h-4 w-4" /> Resetar Tudo
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs">
                <span className="font-semibold text-rose-800">Apagar progresso?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                    setFeedbackMsg({ kind: "ok", text: "Progresso reiniciado." });
                  }}
                  className="rounded bg-rose-600 px-2 py-1 font-bold text-white"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded bg-slate-200 px-2 py-1 font-semibold text-slate-800"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        {feedbackMsg && (
          <div
            className={`mt-4 rounded-xl px-4 py-2.5 text-xs font-semibold ${
              feedbackMsg.kind === "ok"
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
            }`}
          >
            {feedbackMsg.text}
          </div>
        )}
      </div>

      {/* Tabela por Área */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Matriz de Desempenho por Área
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800">
                <th className="py-2.5 pr-4">Área de Conhecimento</th>
                <th className="px-3 py-2.5">Apostila</th>
                <th className="px-3 py-2.5">Respondidas</th>
                <th className="px-3 py-2.5">Acertos</th>
                <th className="px-3 py-2.5">Tempo Médio</th>
                <th className="py-2.5 pl-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {metrics.map((m) => (
                <tr key={m.areaId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-slate-100">
                    {m.areaName}
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400">
                    {m.topicsCompleted}/{m.topicsTotal} módulos
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400">
                    {m.answeredUnique}/{m.totalInBank}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        m.answeredUnique === 0
                          ? "bg-slate-100 text-slate-500 dark:bg-slate-800"
                          : m.accuracyPercent >= 70
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : m.accuracyPercent >= 50
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                      }`}
                    >
                      {m.answeredUnique > 0 ? `${m.accuracyPercent}%` : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400">
                    {m.avgTimeSeconds > 0 ? formatDuration(m.avgTimeSeconds) : "—"}
                  </td>
                  <td className="py-3 pl-3 text-right">
                    <button
                      type="button"
                      onClick={() => onTrainArea(m.areaId)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-200"
                    >
                      <RotateCcw className="h-3 w-3" /> Treinar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histórico de Simulados */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
          Histórico de Simulados Realizados ({progress.simulados.length})
        </h2>
        {progress.simulados.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum simulado concluído até o momento.
          </p>
        ) : (
          <div className="space-y-3">
            {progress.simulados.map((sim) => (
              <div
                key={sim.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{sim.title}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(sim.finishedAt).toLocaleString("pt-BR")} • Duração:{" "}
                    {formatDuration(sim.elapsedSeconds)} • {sim.correctCount}/{sim.totalQuestions}{" "}
                    acertos
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-blue-50 px-3 py-1.5 text-sm font-extrabold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    {sim.scorePercent}%
                  </span>
                  <button
                    type="button"
                    onClick={() => onReviewSimulado(sim.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
                  >
                    <Eye className="h-3.5 w-3.5" /> Revisar Gabarito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
