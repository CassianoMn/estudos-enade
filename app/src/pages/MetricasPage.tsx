import React, { useRef, useState } from "react";
import { Download, Eye, RotateCcw, Trash2, Upload } from "lucide-react";
import type { ApostilaArea, Question, StudyProgress } from "../types/enade";
import { computeAreaMetrics, formatDuration } from "../utils/scoring";
import { exportProgressJson, parseImportedProgressJson } from "../store/progressStore";
import { Button } from "../components/ui/Button";
import { Tag } from "../components/ui/Tag";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

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
  const [feedbackMsg, setFeedbackMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

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
    setFeedbackMsg({ kind: "ok", text: "Backup exportado em JSON." });
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseImportedProgressJson(text);
      onImportProgress(parsed);
      setFeedbackMsg({ kind: "ok", text: "Progresso restaurado com sucesso." });
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
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-5 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
            Diagnóstico & Dados Locais
          </span>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Métricas de Desempenho e Backup
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Todo o progresso é salvo localmente no navegador. Exporte um arquivo JSON para
            transferir para outro dispositivo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Exportar JSON
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Importar JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            className="hidden"
          />
          <Button
            variant="danger"
            size="sm"
            onClick={() => setConfirmResetOpen(true)}
            leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Resetar
          </Button>
        </div>
      </div>

      {feedbackMsg && (
        <div
          role="status"
          className={`rounded-lg border px-4 py-2.5 text-xs font-medium ${
            feedbackMsg.kind === "ok"
              ? "border-emerald-200 bg-emerald-50/70 text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "border-rose-200 bg-rose-50/70 text-rose-800 dark:border-rose-800/70 dark:bg-rose-950/30 dark:text-rose-300"
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="border-b border-[var(--border-subtle)] px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Matriz de Desempenho por Área
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-4 py-2.5">Área de Conhecimento</th>
                <th className="px-3 py-2.5">Apostila</th>
                <th className="px-3 py-2.5">Respondidas</th>
                <th className="px-3 py-2.5">Aproveitamento</th>
                <th className="px-3 py-2.5">Tempo Médio</th>
                <th className="px-4 py-2.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {metrics.map((m) => (
                <tr key={m.areaId} className="transition-colors hover:bg-[var(--bg-hover)]">
                  <td className="px-4 py-2.5 font-medium text-[var(--text-primary)]">
                    {m.areaName}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[var(--text-secondary)] tabular-nums">
                    {m.topicsCompleted}/{m.topicsTotal}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[var(--text-secondary)] tabular-nums">
                    {m.answeredUnique}/{m.totalInBank}
                  </td>
                  <td className="px-3 py-2.5">
                    <Tag
                      tone={
                        m.answeredUnique === 0
                          ? "neutral"
                          : m.accuracyPercent >= 70
                          ? "success"
                          : m.accuracyPercent >= 50
                          ? "warning"
                          : "danger"
                      }
                      mono
                    >
                      {m.answeredUnique > 0 ? `${m.accuracyPercent}%` : "—"}
                    </Tag>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[var(--text-secondary)] tabular-nums">
                    {m.avgTimeSeconds > 0 ? formatDuration(m.avgTimeSeconds) : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => onTrainArea(m.areaId)}
                      leftIcon={<RotateCcw className="h-3 w-3" aria-hidden="true" />}
                    >
                      Treinar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Histórico de Simulados
          </h2>
          <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
            {progress.simulados.length} registro(s)
          </span>
        </div>

        {progress.simulados.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-[var(--text-muted)]">
            Nenhum simulado concluído até o momento.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]">
            {progress.simulados.map((sim) => (
              <div
                key={sim.id}
                className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-[var(--bg-hover)]"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{sim.title}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                    {new Date(sim.finishedAt).toLocaleString("pt-BR")} ·{" "}
                    {formatDuration(sim.elapsedSeconds)} · {sim.correctCount}/{sim.totalQuestions}{" "}
                    acertos
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
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
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => onReviewSimulado(sim.id)}
                    leftIcon={<Eye className="h-3.5 w-3.5" aria-hidden="true" />}
                  >
                    Revisar gabarito
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={confirmResetOpen}
        title="Apagar todo o progresso?"
        description="Essa ação remove seu histórico de questões resolvidas, módulos concluídos, favoritos e simulados salvos neste navegador. Recomendamos exportar um backup JSON antes."
        confirmLabel="Apagar Tudo"
        destructive
        onConfirm={() => {
          onResetProgress();
          setConfirmResetOpen(false);
          setFeedbackMsg({ kind: "ok", text: "Progresso reiniciado." });
        }}
        onCancel={() => setConfirmResetOpen(false)}
      />
    </div>
  );
};
