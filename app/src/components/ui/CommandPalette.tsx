import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Clock,
  CornerDownLeft,
  LayoutDashboard,
  ListChecks,
  Search,
  X,
} from "lucide-react";
import type { ApostilaArea } from "../../types/enade";

export type NavTab = "dashboard" | "apostilas" | "quiz" | "simulado" | "metricas";

interface CommandItem {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  action: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  areas: ApostilaArea[];
  onClose: () => void;
  onNavigate: (tab: NavTab, opts?: { areaId?: string }) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  areas,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const items = useMemo<CommandItem[]>(() => {
    const base: CommandItem[] = [
      {
        id: "nav-dashboard",
        group: "Navegação",
        label: "Ir para Visão Geral",
        hint: "Início",
        icon: <LayoutDashboard className="h-3.5 w-3.5" />,
        action: () => onNavigate("dashboard"),
      },
      {
        id: "nav-apostilas",
        group: "Navegação",
        label: "Abrir Apostilas Unificadas",
        hint: "15 áreas",
        icon: <BookOpen className="h-3.5 w-3.5" />,
        action: () => onNavigate("apostilas"),
      },
      {
        id: "nav-quiz",
        group: "Navegação",
        label: "Praticar Quiz por Áreas",
        hint: "270 questões",
        icon: <ListChecks className="h-3.5 w-3.5" />,
        action: () => onNavigate("quiz"),
      },
      {
        id: "nav-simulado",
        group: "Navegação",
        label: "Simulados Cronometrados",
        hint: "Provas INEP",
        icon: <Clock className="h-3.5 w-3.5" />,
        action: () => onNavigate("simulado"),
      },
      {
        id: "nav-metricas",
        group: "Navegação",
        label: "Métricas e Backup JSON",
        hint: "Desempenho",
        icon: <BarChart3 className="h-3.5 w-3.5" />,
        action: () => onNavigate("metricas"),
      },
    ];

    const apostilaItems: CommandItem[] = areas.map((area) => ({
      id: `ap-${area.areaId}`,
      group: "Apostilas",
      label: area.title,
      hint: `${area.topics.length} módulos · ~${area.estimatedMinutes}m`,
      icon: <BookOpen className="h-3.5 w-3.5" />,
      action: () => onNavigate("apostilas", { areaId: area.areaId }),
    }));

    const quizItems: CommandItem[] = areas.map((area) => ({
      id: `qz-${area.areaId}`,
      group: "Treinar no Quiz",
      label: `Questões: ${area.shortTitle}`,
      hint: "Abrir filtro",
      icon: <ListChecks className="h-3.5 w-3.5" />,
      action: () => onNavigate("quiz", { areaId: area.areaId }),
    }));

    const all = [...base, ...apostilaItems, ...quizItems];
    const q = query.trim().toLowerCase();
    if (!q) return all.slice(0, 14);
    return all
      .filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q) ||
          (item.hint?.toLowerCase().includes(q) ?? false)
      )
      .slice(0, 14);
  }, [areas, query, onNavigate]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (items.length > 0 ? (i + 1) % items.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) =>
          items.length > 0 ? (i - 1 + items.length) % items.length : 0
        );
      } else if (e.key === "Enter" && items[selectedIndex]) {
        e.preventDefault();
        items[selectedIndex].action();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, items, selectedIndex, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/50 px-4 pt-[12vh] backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Busca rápida"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 border-b border-[var(--border-subtle)] px-3.5 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ir para página, apostila ou quiz por área..."
            className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar busca rápida"
            className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-1.5">
          {items.length === 0 ? (
            <div className="px-3 py-8 text-center text-xs text-[var(--text-muted)]">
              Nenhum atalho encontrado para "{query}".
            </div>
          ) : (
            items.map((item, idx) => {
              const active = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                    active
                      ? "bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="text-[var(--text-muted)]">{item.icon}</span>
                    <span className="truncate font-medium">{item.label}</span>
                    <span className="shrink-0 rounded border border-[var(--border-subtle)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">
                      {item.group}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-[11px] text-[var(--text-muted)]">
                    {item.hint && <span className="tabular-nums">{item.hint}</span>}
                    {active && <CornerDownLeft className="h-3 w-3" aria-hidden="true" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3.5 py-2 text-[11px] text-[var(--text-muted)]">
          <span>↑↓ navegar · Enter abrir</span>
          <span>Esc fechar</span>
        </div>
      </div>
    </div>
  );
};
