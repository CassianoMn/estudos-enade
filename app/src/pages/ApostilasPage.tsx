import React, { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  Play,
  Search,
  Video,
} from "lucide-react";
import type { ApostilaArea, StudyProgress } from "../types/enade";
import { MarkdownViewer } from "../components/MarkdownViewer";

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
  const [catalogFilter, setCatalogFilter] = useState("");
  const [contentSearch, setContentSearch] = useState("");

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

  if (!activeArea) return null;

  const doneCount = activeArea.topics.filter((t) => progress.completedTopics[t.id]).length;
  const totalCount = activeArea.topics.length;
  const areaPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Sidebar esquerda: Lista das 15 áreas */}
      <aside className="lg:col-span-4 xl:col-span-3">
        <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Áreas de Conhecimento ({areas.length})
          </h2>
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={catalogFilter}
              onChange={(e) => setCatalogFilter(e.target.value)}
              placeholder="Filtrar área ou tópico..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="max-h-[65vh] space-y-1.5 overflow-y-auto pr-1">
            {filteredAreas.map((area) => {
              const completed = area.topics.filter((t) => progress.completedTopics[t.id]).length;
              const pct = area.topics.length > 0 ? Math.round((completed / area.topics.length) * 100) : 0;
              const isActive = area.areaId === activeArea.areaId;

              return (
                <button
                  key={area.areaId}
                  type="button"
                  onClick={() => {
                    onSelectArea(area.areaId);
                    setContentSearch("");
                  }}
                  className={`w-full rounded-xl border p-2.5 text-left transition ${
                    isActive
                      ? "border-blue-500 bg-blue-50/70 dark:border-blue-600 dark:bg-blue-950/40"
                      : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {area.shortTitle}
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {pct}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {completed}/{area.topics.length} módulos
                    </span>
                    <span>{area.hasDriveMaterial ? "Drive + ENADE" : "Base ENADE"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Painel principal: Apostila + Sumário interativo */}
      <div className="space-y-6 lg:col-span-8 xl:col-span-9">
        {/* Cabeçalho da Apostila */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {activeArea.component === "formacao_geral"
                    ? "Formação Geral"
                    : "Componente Específico"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="h-3.5 w-3.5" /> ~{activeArea.estimatedMinutes} min de leitura
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <FileText className="h-3.5 w-3.5" /> {activeArea.wordCount} palavras
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {activeArea.title}
              </h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Fontes unificadas: {activeArea.sourceFiles.join(" • ")}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={`./${activeArea.publicPdfUrl}`}
                download={`${activeArea.areaId}-apostila.pdf`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Download className="h-4 w-4" /> Baixar PDF
              </a>
              <button
                type="button"
                onClick={() => onPracticeArea(activeArea.areaId)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <Play className="h-4 w-4" /> Treinar Questões desta Área
              </button>
            </div>
          </div>

          {/* Checklist de módulos / Sumário clicável */}
          <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>Progresso nos Módulos ({doneCount}/{totalCount})</span>
              <span>{areaPercent}% concluído</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {activeArea.topics.map((topic) => {
                const done = Boolean(progress.completedTopics[topic.id]);
                return (
                  <div
                    key={topic.id}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${
                      done
                        ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20"
                        : "border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleTopic(topic.id, activeArea.areaId)}
                      className="shrink-0 text-emerald-600 dark:text-emerald-400"
                      title={done ? "Marcar como pendente" : "Marcar módulo como concluído"}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                    <a
                      href={`#${topic.id}`}
                      className="flex-1 truncate font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
                    >
                      {topic.title}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Referências em vídeo do portal Enade DSI */}
          {activeArea.videoRefs.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                <Video className="h-3.5 w-3.5 text-rose-500" /> Discussões Enade DSI:
              </span>
              {activeArea.videoRefs.map((v) => (
                <a
                  key={v.label}
                  href="https://enade.itatechjr.com.br/#videos"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-rose-50 px-2 py-0.5 font-medium text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300"
                >
                  {v.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Busca dentro da apostila */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="relative">
            <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={contentSearch}
              onChange={(e) => setContentSearch(e.target.value)}
              placeholder={`Buscar termo dentro de ${activeArea.shortTitle} (ex: 3FN, pipeline, deadlock...)`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          {contentSearch.trim() && (
            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-500">
                {matchingParagraphs.length} trecho(s) encontrado(s):
              </p>
              {matchingParagraphs.map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-amber-50/60 p-2.5 text-xs text-slate-700 dark:bg-amber-950/30 dark:text-slate-300"
                >
                  {p.slice(0, 260)}
                  {p.length > 260 ? "..." : ""}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conteúdo completo da apostila */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
            <BookOpen className="h-4 w-4" /> Conteúdo Unificado
          </div>
          <MarkdownViewer content={activeArea.content} areaId={activeArea.areaId} />
        </article>
      </div>
    </div>
  );
};
