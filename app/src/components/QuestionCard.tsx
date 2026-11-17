import React, { useState } from "react";
import {
  AlertTriangle,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Flag,
  HelpCircle,
  XCircle,
} from "lucide-react";
import type { OptionLetter, Question } from "../types/enade";

interface QuestionCardProps {
  question: Question;
  mode: "quiz" | "simulado-active" | "simulado-review";
  selectedOption?: OptionLetter | null;
  discursiveDraft?: string;
  discursiveSelfScore?: 0 | 0.5 | 1 | null;
  flagged?: boolean;
  isFavorite?: boolean;
  showFeedback?: boolean;
  onSelectOption?: (letter: OptionLetter) => void;
  onChangeDiscursiveDraft?: (draft: string) => void;
  onSetDiscursiveScore?: (score: 0 | 0.5 | 1) => void;
  onToggleFlag?: () => void;
  onToggleFavorite?: () => void;
  onOpenApostila?: (areaId: string) => void;
}

function resolveAssetUrl(url: string): string {
  return url.startsWith("/") ? `.${url}` : url;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  mode,
  selectedOption,
  discursiveDraft = "",
  discursiveSelfScore,
  flagged = false,
  isFavorite = false,
  showFeedback = false,
  onSelectOption,
  onChangeDiscursiveDraft,
  onSetDiscursiveScore,
  onToggleFlag,
  onToggleFavorite,
  onOpenApostila,
}) => {
  const [revealRubric, setRevealRubric] = useState(mode === "simulado-review");
  const isRevealed = mode === "simulado-review" || (mode === "quiz" && showFeedback);

  const difficultyLabel: Record<string, string> = {
    facil: "Fácil",
    media: "Média",
    dificil: "Difícil",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {/* Cabeçalho com metadados */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              question.source === "oficial"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
            }`}
          >
            {question.source === "oficial" ? `Oficial ${question.year}` : "Inédita ENADE"}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {question.areaName}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {question.type === "discursiva" ? "Discursiva" : "Objetiva"}
          </span>
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            {difficultyLabel[question.difficulty] ?? question.difficulty}
          </span>
          {question.annulled && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              <AlertTriangle className="h-3.5 w-3.5" /> Anulada pelo INEP
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleFlag && mode === "simulado-active" && (
            <button
              type="button"
              onClick={onToggleFlag}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                flagged
                  ? "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
              title="Marcar para revisar antes de entregar"
            >
              <Flag className="h-3.5 w-3.5" />
              {flagged ? "Marcada" : "Revisar"}
            </button>
          )}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                isFavorite
                  ? "border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-950/50 dark:text-blue-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
              title="Salvar questão nos favoritos"
            >
              <Bookmark className="h-3.5 w-3.5" />
              {isFavorite ? "Favorita" : "Favoritar"}
            </button>
          )}
        </div>
      </div>

      {/* Título / Identificador */}
      <div className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
        {question.label}
      </div>

      {/* Enunciado */}
      <div className="mb-5 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
        {question.stem}
      </div>

      {/* Imagens / Diagramas da prova original */}
      {question.imageUrls.length > 0 && (
        <div className="mb-5 space-y-3">
          {question.imageUrls.map((url) => (
            <div
              key={url}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700"
            >
              <img
                src={resolveAssetUrl(url)}
                alt={`Figura referente a ${question.label}`}
                className="mx-auto max-h-[540px] w-auto object-contain"
                loading="lazy"
              />
              <p className="mt-1.5 text-center text-xs text-slate-500">
                Página original da prova com diagrama/figura de apoio
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Alternativas (Objetivas) */}
      {question.type === "objetiva" && (
        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.letter;
            const isCorrect = question.correctAnswer === opt.letter;

            let cardStyle =
              "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-slate-800/80";
            let badgeStyle =
              "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

            if (isRevealed) {
              if (isCorrect) {
                cardStyle =
                  "border-emerald-500 bg-emerald-50/70 dark:border-emerald-600 dark:bg-emerald-950/30";
                badgeStyle = "bg-emerald-600 text-white";
              } else if (isSelected && !isCorrect) {
                cardStyle =
                  "border-rose-400 bg-rose-50/70 dark:border-rose-600 dark:bg-rose-950/30";
                badgeStyle = "bg-rose-600 text-white";
              } else {
                cardStyle =
                  "border-slate-200 bg-slate-50/50 opacity-85 dark:border-slate-800 dark:bg-slate-900/50";
              }
            } else if (isSelected) {
              cardStyle =
                "border-blue-600 bg-blue-50/70 ring-1 ring-blue-600/20 dark:border-blue-500 dark:bg-blue-950/40";
              badgeStyle = "bg-blue-600 text-white";
            }

            return (
              <button
                key={opt.letter}
                type="button"
                disabled={mode === "simulado-review" || (mode === "quiz" && showFeedback)}
                onClick={() => onSelectOption?.(opt.letter)}
                className={`w-full rounded-xl border p-3.5 text-left transition ${cardStyle}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${badgeStyle}`}
                  >
                    {opt.letter}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                      {opt.text}
                    </p>
                    {isRevealed && opt.explanation && (
                      <p className="mt-2 border-t border-slate-200/70 pt-1.5 text-xs leading-relaxed text-slate-600 dark:border-slate-700/70 dark:text-slate-400">
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                  {isRevealed && isCorrect && (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {isRevealed && isSelected && !isCorrect && (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Área de resposta (Discursivas) */}
      {question.type === "discursiva" && (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Sua Resposta (Rascunho / Treino — limite sugerido 15 linhas no ENADE)
            </label>
            <textarea
              rows={6}
              value={discursiveDraft}
              disabled={mode === "simulado-review"}
              onChange={(e) => onChangeDiscursiveDraft?.(e.target.value)}
              placeholder="Estruture sua resposta abordando todos os itens solicitados no enunciado..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          {mode === "quiz" && (
            <button
              type="button"
              onClick={() => setRevealRubric((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <HelpCircle className="h-4 w-4" />
              {revealRubric ? "Ocultar Espelho Oficial" : "Ver Espelho / Padrão de Resposta"}
            </button>
          )}

          {(revealRubric || isRevealed) && question.discursiveRubric && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
              <h4 className="mb-2 text-sm font-bold text-emerald-900 dark:text-emerald-300">
                Padrão de Resposta / Critérios de Correção
              </h4>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">
                {question.discursiveRubric}
              </div>

              {onSetDiscursiveScore && mode !== "simulado-active" && (
                <div className="mt-4 border-t border-emerald-200 pt-3 dark:border-emerald-800">
                  <p className="mb-2 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                    Autoavaliação (registra nas métricas):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { val: 0 as const, label: "Não atendi (0%)" },
                      { val: 0.5 as const, label: "Parcialmente (50%)" },
                      { val: 1 as const, label: "Atendi totalmente (100%)" },
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        type="button"
                        onClick={() => onSetDiscursiveScore(btn.val)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                          discursiveSelfScore === btn.val
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-slate-900 dark:text-emerald-200"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Explicação / Resumo + Atalho para Apostila */}
      {isRevealed && question.type === "objetiva" && (
        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/30">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
              Comentário / Gabarito
            </h4>
            {onOpenApostila && (
              <button
                type="button"
                onClick={() => onOpenApostila(question.areaId)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Revisar Apostila de {question.areaName}
              </button>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-blue-950 dark:text-blue-100">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
