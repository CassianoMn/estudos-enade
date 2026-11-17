import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Download,
  FileText,
  Maximize2,
  Minimize2,
  Play,
  Search,
  Video,
  X,
} from "lucide-react";
import type { ApostilaArea, StudyProgress } from "../types/enade";
import { MarkdownViewer, type ReaderFontSize } from "../components/MarkdownViewer";
import { Button } from "../components/ui/Button";
import { Tag } from "../components/ui/Tag";

interface ApostilasPageProps {
  areas: ApostilaArea[];
  selectedAreaId: string;
  progress: StudyProgress;
  onSelectArea: (areaId: string) => void;
  onToggleTopic: (topicId: string, areaId: string) => void;
  onPracticeArea: (areaId: string) => void;
}

export const ApostilasPage: React.FC<ApostilasPageProps> = ({
  areas,
  selectedAreaId,
  progress,
  onSelectArea,
  onToggleTopic,
  onPracticeArea,
}) => {
  const [areaMenuOpen, setAreaMenuOpen] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState("");
  const [contentSearch, setContentSearch] = useState("");
  const [fontSize, setFontSize] = useState<ReaderFontSize>("md");
  const [wideMode, setWideMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const activeArea = useMemo(
    () => areas.find((a) => a.areaId === selectedAreaId) ?? areas[0],
    [areas, selectedAreaId]
  );

  const filteredAreas = useMemo(() => {
    const q = catalogFilter.trim().toLowerCase();
    if (!q) return areas;
    return areas.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.shortTitle.toLowerCase().includes(q) ||
        a.topics.some((t) => t.title.toLowerCase().includes(q))
    );
  }, [areas, catalogFilter]);

  const matchingParagraphs = useMemo(() => {
    const q = contentSearch.trim().toLowerCase();
    if (!q || !activeArea) return [];
    return activeArea.content
      .split(/\n{2,}/)
      .filter((p) => p.toLowerCase().includes(q))
      .slice(0, 8);
  }, [activeArea, contentSearch]);

  useEffect(() => {
    if (!areaMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAreaMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAreaMenuOpen(false);
    };
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [areaMenuOpen]);

  if (!activeArea) return null;

  const doneCount = activeArea.topics.filter((t) => progress.completedTopics[t.id]).length;
  const totalCount = activeArea.topics.length;
  const areaPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setAreaMenuOpen((v) => !v)}
            aria-expanded={areaMenuOpen}
            aria-haspopup="listbox"
            className="inline-flex items-center gap-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                Apostila Selecionada
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <span>{activeArea.shortTitle}</span>
                <span className="font-mono text-xs font-normal text-[var(--text-muted)] tabular-nums">
                  {doneCount}/{totalCount}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-[var(--text-muted)] transition-transform ${
                areaMenuOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {areaMenuOpen && (
            <div className="absolute left-0 z-30 mt-2 w-[min(92vw,380px)] overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl">
              <div className="border-b border-[var(--border-subtle)] p-2.5">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-2.5 left-2.5 h-3.5 w-3.5 text-[var(--text-muted)]"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    autoFocus
                    value={catalogFilter}
                    onChange={(e) => setCatalogFilter(e.target.value)}
                    placeholder="Filtrar entre as 15 áreas..."
                    className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-1.5 pr-3 pl-8 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div className="max-h-80 divide-y divide-[var(--border-subtle)] overflow-y-auto" role="listbox">
                {filteredAreas.map((area) => {
                  const completed = area.topics.filter((t) => progress.completedTopics[t.id]).length;
                  const pct =
                    area.topics.length > 0
                      ? Math.round((completed / area.topics.length) * 100)
                      : 0;
                  const isActive = area.areaId === activeArea.areaId;

                  return (
                    <button
                      key={area.areaId}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        onSelectArea(area.areaId);
                        setContentSearch("");
                        setAreaMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-xs transition-colors ${
                        isActive
                          ? "bg-[var(--accent-soft)] text-[var(--text-primary)]"
                          : "hover:bg-[var(--bg-hover)]"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-[var(--text-primary)]">
                          {area.shortTitle}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--text-muted)] tabular-nums">
                          <span>
                            {completed}/{area.topics.length} módulos
                          </span>
                          <span>·</span>
                          <span>{area.hasDriveMaterial ? "Drive + ENADE" : "Base ENADE"}</span>
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-[11px] font-medium text-[var(--text-secondary)] tabular-nums">
                        {pct}%
                      </span>
                    </button>
                  );
                })}
                {filteredAreas.length === 0 && (
                  <div className="px-4 py-6 text-center text-xs text-[var(--text-muted)]">
                    Nenhuma área encontrada.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex items-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5"
            role="group"
            aria-label="Tamanho da fonte"
          >
            {(
              [
                { id: "sm", label: "P" },
                { id: "md", label: "M" },
                { id: "lg", label: "G" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFontSize(opt.id)}
                aria-pressed={fontSize === opt.id}
                title={`Tamanho de leitura ${opt.label}`}
                className={`rounded px-2 py-1 font-mono text-[11px] font-medium transition-colors ${
                  fontSize === opt.id
                    ? "bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setWideMode((w) => !w)}
            aria-pressed={wideMode}
            className="hidden sm:inline-flex"
            leftIcon={
              wideMode ? (
                <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
              )
            }
          >
            {wideMode ? "Largura padrão" : "Expandir"}
          </Button>

          <a
            href={`./${activeArea.publicPdfUrl}`}
            download={`${activeArea.areaId}-apostila.pdf`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            PDF
          </a>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onPracticeArea(activeArea.areaId)}
            leftIcon={<Play className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Treinar Questões
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div
          className={`space-y-5 ${
            wideMode ? "xl:col-span-9" : "xl:col-span-8 xl:col-start-1"
          }`}
        >
          <header className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <Tag tone="accent">
                {activeArea.component === "formacao_geral"
                  ? "Formação Geral"
                  : "Componente Específico"}
              </Tag>
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />~
                {activeArea.estimatedMinutes} min
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 tabular-nums">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                {activeArea.wordCount.toLocaleString("pt-BR")} palavras
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{areaPercent}% concluído</span>
            </div>

            <h1 className="mt-2.5 text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">
              {activeArea.title}
            </h1>

            <p className="mt-1.5 text-xs text-[var(--text-muted)]">
              Fontes: {activeArea.sourceFiles.join(" · ")}
            </p>

            <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-2.5 left-3 h-3.5 w-3.5 text-[var(--text-muted)]"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={contentSearch}
                  onChange={(e) => setContentSearch(e.target.value)}
                  placeholder={`Buscar termo em ${activeArea.shortTitle} (ex: 3FN, deadlock, Scrum...)`}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-1.5 pr-8 pl-9 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-blue-600 focus:bg-[var(--bg-surface)] focus:outline-none"
                />
                {contentSearch && (
                  <button
                    type="button"
                    onClick={() => setContentSearch("")}
                    aria-label="Limpar busca na apostila"
                    className="absolute top-2 right-2.5 rounded p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {contentSearch.trim() && (
                <div className="mt-3 space-y-1.5">
                  <p className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                    {matchingParagraphs.length} ocorrência(s) encontrada(s)
                  </p>
                  {matchingParagraphs.map((p, idx) => (
                    <div
                      key={idx}
                      className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-2 text-xs leading-relaxed text-[var(--text-secondary)]"
                    >
                      {p.slice(0, 240)}
                      {p.length > 240 ? "..." : ""}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {activeArea.videoRefs.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-3 text-xs">
                <span className="inline-flex items-center gap-1 font-medium text-[var(--text-secondary)]">
                  <Video className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                  Vídeos Enade DSI:
                </span>
                {activeArea.videoRefs.map((v) => (
                  <a
                    key={v.label}
                    href="https://enade.itatechjr.com.br/#videos"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-primary)] hover:border-[var(--border-strong)]"
                  >
                    {v.label}
                  </a>
                ))}
              </div>
            )}
          </header>

          <details className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] xl:hidden">
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-xs font-semibold text-[var(--text-primary)]">
              <span>
                Sumário e Módulos ({doneCount}/{totalCount})
              </span>
              <span className="font-mono text-[var(--text-muted)] tabular-nums">
                {areaPercent}%
              </span>
            </summary>
            <div className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
              {activeArea.topics.map((topic) => {
                const done = Boolean(progress.completedTopics[topic.id]);
                return (
                  <div key={topic.id} className="flex items-center gap-2.5 px-4 py-2 text-xs">
                    <button
                      type="button"
                      onClick={() => onToggleTopic(topic.id, activeArea.areaId)}
                      aria-label={
                        done ? `Desmarcar ${topic.title}` : `Concluir ${topic.title}`
                      }
                      className="shrink-0 text-[var(--text-muted)] hover:text-emerald-600"
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>
                    <a
                      href={`#${topic.id}`}
                      className="flex-1 truncate text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      {topic.title}
                    </a>
                  </div>
                );
              })}
            </div>
          </details>

          <article className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-6 sm:px-8 sm:py-8">
            <div className={wideMode ? "max-w-none" : "mx-auto max-w-[68ch]"}>
              <MarkdownViewer
                content={activeArea.content}
                areaId={activeArea.areaId}
                fontSize={fontSize}
              />
            </div>
          </article>
        </div>

        <aside className={`hidden xl:block ${wideMode ? "xl:col-span-3" : "xl:col-span-4"}`}>
          <div className="sticky top-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="border-b border-[var(--border-subtle)] px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Nesta Apostila
                </h2>
                <span className="font-mono text-xs font-medium text-[var(--text-primary)] tabular-nums">
                  {doneCount}/{totalCount}
                </span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                <div
                  className="h-full bg-emerald-600 transition-all dark:bg-emerald-500"
                  style={{ width: `${areaPercent}%` }}
                />
              </div>
            </div>

            <nav
              aria-label="Módulos da apostila"
              className="max-h-[72vh] divide-y divide-[var(--border-subtle)] overflow-y-auto"
            >
              {activeArea.topics.map((topic) => {
                const done = Boolean(progress.completedTopics[topic.id]);
                return (
                  <div
                    key={topic.id}
                    className="flex items-start gap-2.5 px-4 py-2.5 text-xs transition-colors hover:bg-[var(--bg-hover)]"
                  >
                    <button
                      type="button"
                      onClick={() => onToggleTopic(topic.id, activeArea.areaId)}
                      aria-label={
                        done ? `Desmarcar ${topic.title}` : `Concluir ${topic.title}`
                      }
                      className="mt-0.5 shrink-0 text-[var(--text-muted)] hover:text-emerald-600 focus-visible:outline-2 focus-visible:outline-blue-600"
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>
                    <a
                      href={`#${topic.id}`}
                      className={`leading-snug transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                        done
                          ? "text-[var(--text-muted)] line-through decoration-zinc-400/50"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {topic.title}
                    </a>
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
};
