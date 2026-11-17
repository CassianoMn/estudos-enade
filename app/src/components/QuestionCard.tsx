import React, { useState } from "react";
import {
  AlertTriangle,
  Bookmark,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  Flag,
  X,
} from "lucide-react";
import type { OptionLetter, Question } from "../types/enade";
import { Button } from "./ui/Button";
import { Tag } from "./ui/Tag";

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

const DIFFICULTY_LABEL: Record<string, string> = {
  facil: "Fácil",
  media: "Média",
  dificil: "Difícil",
};

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
  const optionsLocked = mode === "simulado-review" || (mode === "quiz" && showFeedback);

  const estimatedLines = discursiveDraft
    ? Math.max(
        discursiveDraft.split("\n").length,
        Math.ceil(discursiveDraft.length / 82)
      )
    : 0;

  return (
    <article className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      {/* Barra superior de metadados */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] px-5 py-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Tag tone={question.source === "oficial" ? "accent" : "success"} mono>
            {question.source === "oficial" ? `INEP ${question.year}` : "INÉDITA"}
          </Tag>
          <span className="font-medium text-[var(--text-primary)]">{question.areaName}</span>
          <span className="text-[var(--text-muted)]" aria-hidden="true">
            ·
          </span>
          <span className="text-[var(--text-secondary)]">
            {question.type === "discursiva" ? "Discursiva" : "Objetiva"}
          </span>
          <span className="text-[var(--text-muted)]" aria-hidden="true">
            ·
          </span>
          <span className="text-[var(--text-muted)]">
            {DIFFICULTY_LABEL[question.difficulty] ?? question.difficulty}
          </span>
          {question.annulled && (
            <Tag tone="danger">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              Anulada
            </Tag>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleFlag && mode === "simulado-active" && (
            <Button
              variant={flagged ? "secondary" : "ghost"}
              size="xs"
              onClick={onToggleFlag}
              aria-pressed={flagged}
              className={
                flagged
                  ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-700/70 dark:bg-amber-950/40 dark:text-amber-300"
                  : ""
              }
              leftIcon={<Flag className="h-3.5 w-3.5" aria-hidden="true" />}
              title="Marcar para revisar antes de entregar"
            >
              {flagged ? "Marcada" : "Revisar"}
            </Button>
          )}
          {onToggleFavorite && (
            <Button
              variant={isFavorite ? "secondary" : "ghost"}
              size="xs"
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
              className={
                isFavorite
                  ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800/70 dark:bg-blue-950/40 dark:text-blue-300"
                  : ""
              }
              leftIcon={
                <Bookmark
                  className={`h-3.5 w-3.5 ${isFavorite ? "fill-current" : ""}`}
                  aria-hidden="true"
                />
              }
              title="Favoritar questão (atalho F)"
            >
              {isFavorite ? "Salva" : "Salvar"}
            </Button>
          )}
        </div>
      </div>

      {/* Corpo da questão */}
      <div className="p-5 sm:p-6">
        <div className="mb-2 font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          {question.label}
        </div>

        <div className="mb-6 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--text-primary)]">
          {question.stem}
        </div>

        {/* Imagens / Diagramas da prova original */}
        {question.imageUrls.length > 0 && (
          <div className="mb-6 space-y-3">
            {question.imageUrls.map((url) => (
              <figure
                key={url}
                className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-white p-3"
              >
                <img
                  src={resolveAssetUrl(url)}
                  alt={`Figura referente a ${question.label}`}
                  className="mx-auto max-h-[540px] w-auto object-contain"
                  loading="lazy"
                />
                <figcaption className="mt-2 text-center text-[11px] text-zinc-500">
                  Recorte da prova original com figura de apoio
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {/* Alternativas (Objetivas) */}
        {question.type === "objetiva" && (
          <div className="space-y-2" role="radiogroup" aria-label="Alternativas da questão">
            {question.options.map((opt) => {
              const isSelected = selectedOption === opt.letter;
              const isCorrect = question.correctAnswer === opt.letter;

              let rowClass =
                "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)]";
              let keyClass =
                "border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]";

              if (isRevealed) {
                if (isCorrect) {
                  rowClass =
                    "border-emerald-500/70 bg-emerald-50/50 dark:border-emerald-600/70 dark:bg-emerald-950/25";
                  keyClass = "border-emerald-600 bg-emerald-600 text-white";
                } else if (isSelected && !isCorrect) {
                  rowClass =
                    "border-rose-400/80 bg-rose-50/50 dark:border-rose-600/70 dark:bg-rose-950/25";
                  keyClass = "border-rose-600 bg-rose-600 text-white";
                } else {
                  rowClass =
                    "border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-70";
                }
              } else if (isSelected) {
                rowClass =
                  "border-blue-600 bg-[var(--accent-soft)] dark:border-blue-500";
                keyClass = "border-blue-600 bg-blue-600 text-white";
              }

              return (
                <button
                  key={opt.letter}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={optionsLocked}
                  onClick={() => onSelectOption?.(opt.letter)}
                  className={`group w-full rounded-lg border px-3.5 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-default ${rowClass}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border font-mono text-xs font-semibold transition-colors ${keyClass}`}
                    >
                      {opt.letter}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                        {opt.text}
                      </p>
                      {isRevealed && opt.explanation && (
                        <p className="mt-2 border-t border-[var(--border-subtle)] pt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                    {isRevealed && isCorrect && (
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                        aria-label="Alternativa correta"
                      />
                    )}
                    {isRevealed && isSelected && !isCorrect && (
                      <X
                        className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400"
                        aria-label="Alternativa incorreta"
                      />
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
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor={`discursive-${question.id}`}
                  className="text-xs font-medium text-[var(--text-secondary)]"
                >
                  Sua resposta discursiva
                </label>
                <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                  ~{estimatedLines}/15 linhas · {discursiveDraft.length} chars
                </span>
              </div>
              <textarea
                id={`discursive-${question.id}`}
                rows={6}
                value={discursiveDraft}
                disabled={mode === "simulado-review"}
                onChange={(e) => onChangeDiscursiveDraft?.(e.target.value)}
                placeholder="Estruture sua resposta de forma objetiva cobrindo cada item pedido no enunciado..."
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-sm leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-blue-600 focus:bg-[var(--bg-surface)] focus:outline-none disabled:opacity-75"
              />
            </div>

            {mode === "quiz" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRevealRubric((v) => !v)}
                leftIcon={
                  revealRubric ? (
                    <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  )
                }
              >
                {revealRubric ? "Ocultar padrão de resposta" : "Ver padrão de resposta"}
              </Button>
            )}

            {(revealRubric || isRevealed) && question.discursiveRubric && (
              <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/40 p-4 dark:border-emerald-900/70 dark:bg-emerald-950/20">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                  Padrão de Resposta Oficial / Rubrica
                </h4>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]">
                  {question.discursiveRubric}
                </div>

                {onSetDiscursiveScore && mode !== "simulado-active" && (
                  <div className="mt-4 border-t border-emerald-200/70 pt-3 dark:border-emerald-800/60">
                    <p className="mb-2 text-xs font-medium text-[var(--text-secondary)]">
                      Autoavaliação (contabiliza nas métricas):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { val: 0 as const, label: "Não atendi (0%)" },
                        { val: 0.5 as const, label: "Parcial (50%)" },
                        { val: 1 as const, label: "Completo (100%)" },
                      ].map((btn) => {
                        const selected = discursiveSelfScore === btn.val;
                        return (
                          <Button
                            key={btn.val}
                            variant={selected ? "primary" : "secondary"}
                            size="xs"
                            aria-pressed={selected}
                            onClick={() => onSetDiscursiveScore(btn.val)}
                          >
                            {btn.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Comentário / Gabarito */}
        {isRevealed && question.type === "objetiva" && (
          <div className="mt-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-primary)]">
                Comentário do Gabarito
              </h4>
              {onOpenApostila && (
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => onOpenApostila(question.areaId)}
                  leftIcon={<BookOpen className="h-3.5 w-3.5" aria-hidden="true" />}
                >
                  Revisar {question.areaName}
                </Button>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {question.explanation}
            </p>
          </div>
        )}
      </div>
    </article>
  );
};
