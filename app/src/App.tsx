import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Clock,
  LayoutDashboard,
  ListChecks,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
} from "lucide-react";
import apostilasRaw from "./data/apostilas-bundle.json";
import questionsRaw from "./data/banco-unificado.json";
import type {
  ActiveSimulado,
  ApostilasBundle,
  QuestionAttempt,
  QuestionBankBundle,
  SimuladoRecord,
  StudyProgress,
} from "./types/enade";
import {
  createInitialProgress,
  finalizeSimuladoInProgress,
  loadProgress,
  recordQuestionAttempt,
  saveProgress,
  touchStudyDate,
  updateActiveSimulado,
} from "./store/progressStore";
import { computeStudyStreak, formatDuration } from "./utils/scoring";
import { DashboardPage } from "./pages/DashboardPage";
import { ApostilasPage } from "./pages/ApostilasPage";
import { QuizPage } from "./pages/QuizPage";
import { SimuladoPage } from "./pages/SimuladoPage";
import { MetricasPage } from "./pages/MetricasPage";
import { CommandPalette, type NavTab } from "./components/ui/CommandPalette";

const apostilasBundle = apostilasRaw as ApostilasBundle;
const questionBundle = questionsRaw as QuestionBankBundle;

export const App: React.FC = () => {
  const [progress, setProgress] = useState<StudyProgress>(() => loadProgress());
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string>(
    () => progress.lastReadAreaId || apostilasBundle.areas[0]?.areaId || "00-formacao-geral"
  );
  const [quizInitialArea, setQuizInitialArea] = useState<string>("all");
  const [reviewSimuladoId, setReviewSimuladoId] = useState<string | null>(null);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    const root = document.documentElement;
    if (progress.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [progress.theme]);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  const handleNavigate = (tab: NavTab, opts?: { areaId?: string }) => {
    if (tab === "apostilas" && opts?.areaId) {
      setSelectedAreaId(opts.areaId);
      setProgress((prev) => ({ ...prev, lastReadAreaId: opts.areaId! }));
    }
    if (tab === "quiz" && opts?.areaId) {
      setQuizInitialArea(opts.areaId);
    }
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  const handleToggleTopic = (topicId: string, areaId: string) => {
    setProgress((prev) => {
      const nextVal = !prev.completedTopics[topicId];
      return {
        ...prev,
        lastReadAreaId: areaId,
        completedTopics: {
          ...prev.completedTopics,
          [topicId]: nextVal,
        },
        studyDates: nextVal ? touchStudyDate(prev.studyDates) : prev.studyDates,
      };
    });
  };

  const handleToggleFavorite = (questionId: string) => {
    setProgress((prev) => ({
      ...prev,
      favorites: {
        ...prev.favorites,
        [questionId]: !prev.favorites[questionId],
      },
    }));
  };

  const handleRecordAttempt = (attempt: QuestionAttempt) => {
    setProgress((prev) => recordQuestionAttempt(prev, attempt));
  };

  const handleUpdateActiveSimulado = (active: ActiveSimulado | null) => {
    setProgress((prev) => updateActiveSimulado(prev, active));
  };

  const handleTickSimulado = () => {
    setProgress((prev) => {
      if (!prev.activeSimulado) return prev;
      return {
        ...prev,
        activeSimulado: {
          ...prev.activeSimulado,
          remainingSeconds: Math.max(0, prev.activeSimulado.remainingSeconds - 1),
        },
      };
    });
  };

  const handleFinishSimulado = (record: SimuladoRecord, attempts: QuestionAttempt[]) => {
    setProgress((prev) => finalizeSimuladoInProgress(prev, record, attempts));
  };

  const handleUpdateHistoricalSimulado = (updated: SimuladoRecord) => {
    setProgress((prev) => ({
      ...prev,
      simulados: prev.simulados.map((s) => (s.id === updated.id ? updated : s)),
    }));
  };

  const toggleTheme = () => {
    setProgress((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  };

  const isFocusMode = activeTab === "simulado" && Boolean(progress.activeSimulado);
  const streak = computeStudyStreak(progress.studyDates);
  const answeredCount = Object.keys(progress.attemptsByQuestion).length;

  const navItems: Array<{ id: NavTab; label: string; shortLabel: string; icon: React.ReactNode }> = [
    {
      id: "dashboard",
      label: "Visão Geral",
      shortLabel: "Início",
      icon: <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: "apostilas",
      label: "Apostilas",
      shortLabel: "Apostilas",
      icon: <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: "quiz",
      label: "Quiz por Áreas",
      shortLabel: "Quiz",
      icon: <ListChecks className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: "simulado",
      label: "Simulado",
      shortLabel: "Simulado",
      icon: <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: "metricas",
      label: "Métricas",
      shortLabel: "Métricas",
      icon: <BarChart3 className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {isFocusMode && (
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => handleNavigate("dashboard")}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Sair do modo foco (progresso salvo)
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Alternar tema claro ou escuro"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
            >
              {progress.theme === "dark" ? (
                <>
                  <Sun className="h-3.5 w-3.5" aria-hidden="true" /> Claro
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5" aria-hidden="true" /> Escuro
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className={isFocusMode ? "" : "md:flex md:min-h-screen"}>
        {!isFocusMode && (
          <aside
            aria-label="Menu principal"
            className={`hidden shrink-0 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-[width] duration-150 md:sticky md:top-0 md:flex md:h-screen md:flex-col ${
              sidebarCollapsed ? "md:w-[60px]" : "md:w-60"
            }`}
          >
            <div
              className={`flex h-13 items-center border-b border-[var(--border-subtle)] px-3 ${
                sidebarCollapsed ? "justify-center" : "justify-between"
              }`}
            >
              {!sidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => handleNavigate("dashboard")}
                  className="flex min-w-0 items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--border-strong)] bg-zinc-900 font-mono text-[11px] font-semibold text-white dark:bg-zinc-100 dark:text-zinc-950">
                    SI
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold tracking-tight text-[var(--text-primary)]">
                      EstudosEnade
                    </div>
                    <div className="truncate text-[10px] text-[var(--text-muted)]">
                      Sistemas de Informação
                    </div>
                  </div>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSidebarCollapsed((c) => !c)}
                aria-label={sidebarCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
                title={sidebarCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
                className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="p-2.5">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                title="Busca rápida (Ctrl+K)"
                className={`flex w-full items-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-blue-600 ${
                  sidebarCollapsed ? "justify-center p-2" : "justify-between px-2.5 py-1.5"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {!sidebarCollapsed && <span>Buscar...</span>}
                </span>
                {!sidebarCollapsed && (
                  <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-1 font-mono text-[10px]">
                    ⌘K
                  </kbd>
                )}
              </button>
            </div>

            <nav className="flex-1 space-y-0.5 px-2.5 py-1" aria-label="Seções do sistema">
              {navItems.map((item) => {
                const active = activeTab === item.id;
                const hasRunningSimulado =
                  item.id === "simulado" && Boolean(progress.activeSimulado);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    aria-current={active ? "page" : undefined}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`flex w-full items-center rounded-md text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
                      sidebarCollapsed
                        ? "justify-center px-2 py-2"
                        : "justify-between px-2.5 py-2"
                    } ${
                      active
                        ? "bg-[var(--bg-subtle)] text-[var(--text-primary)] font-semibold"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className={active ? "text-blue-600 dark:text-blue-400" : ""}>
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </span>

                    {hasRunningSimulado && !sidebarCollapsed && (
                      <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 tabular-nums">
                        {formatDuration(progress.activeSimulado!.remainingSeconds)}
                      </span>
                    )}
                    {hasRunningSimulado && sidebarCollapsed && (
                      <span className="sr-only">Simulado em andamento</span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-[var(--border-subtle)] p-2.5">
              {!sidebarCollapsed && (
                <div className="mb-2 flex items-center justify-between px-2 text-[11px] text-[var(--text-muted)] tabular-nums">
                  <span>{answeredCount}/270 q.</span>
                  <span>
                    {streak} {streak === 1 ? "dia" : "dias"}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Alternar tema claro ou escuro"
                title={
                  progress.theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"
                }
                className={`flex w-full items-center rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-blue-600 ${
                  sidebarCollapsed ? "justify-center" : "gap-2.5"
                }`}
              >
                {progress.theme === "dark" ? (
                  <Sun className="h-4 w-4 shrink-0" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />
                )}
                {!sidebarCollapsed && (
                  <span>{progress.theme === "dark" ? "Tema claro" : "Tema escuro"}</span>
                )}
              </button>
            </div>
          </aside>
        )}

        {!isFocusMode && (
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 px-4 py-2.5 backdrop-blur md:hidden">
            <button
              type="button"
              onClick={() => handleNavigate("dashboard")}
              className="flex items-center gap-2 text-left"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 font-mono text-[11px] font-semibold text-white dark:bg-zinc-100 dark:text-zinc-950">
                SI
              </span>
              <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                EstudosEnade
              </span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                aria-label="Abrir busca rápida"
                className="rounded-md border border-[var(--border-subtle)] p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Alternar tema claro ou escuro"
                className="rounded-md border border-[var(--border-subtle)] p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              >
                {progress.theme === "dark" ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </header>
        )}

        <main
          className={`min-w-0 flex-1 ${
            isFocusMode
              ? "mx-auto max-w-6xl px-4 py-6 sm:px-6"
              : "mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 md:px-8 md:py-7 md:pb-10"
          }`}
        >
          {activeTab === "dashboard" && (
            <DashboardPage
              areas={apostilasBundle.areas}
              questions={questionBundle.questions}
              progress={progress}
              onNavigate={handleNavigate}
              onOpenCommandPalette={() => setCommandOpen(true)}
            />
          )}

          {activeTab === "apostilas" && (
            <ApostilasPage
              areas={apostilasBundle.areas}
              selectedAreaId={selectedAreaId}
              progress={progress}
              onSelectArea={(areaId) => {
                setSelectedAreaId(areaId);
                setProgress((prev) => ({ ...prev, lastReadAreaId: areaId }));
              }}
              onToggleTopic={handleToggleTopic}
              onPracticeArea={(areaId) => handleNavigate("quiz", { areaId })}
            />
          )}

          {activeTab === "quiz" && (
            <QuizPage
              areas={apostilasBundle.areas}
              questions={questionBundle.questions}
              progress={progress}
              initialAreaFilter={quizInitialArea}
              onRecordAttempt={handleRecordAttempt}
              onToggleFavorite={handleToggleFavorite}
              onOpenApostila={(areaId) => handleNavigate("apostilas", { areaId })}
            />
          )}

          {activeTab === "simulado" && (
            <SimuladoPage
              questions={questionBundle.questions}
              progress={progress}
              selectedReviewRecordId={reviewSimuladoId}
              onClearReviewRecord={() => setReviewSimuladoId(null)}
              onUpdateActive={handleUpdateActiveSimulado}
              onTickTimer={handleTickSimulado}
              onFinishSimulado={handleFinishSimulado}
              onUpdateHistoricalSimulado={handleUpdateHistoricalSimulado}
              onToggleFavorite={handleToggleFavorite}
              onOpenApostila={(areaId) => handleNavigate("apostilas", { areaId })}
            />
          )}

          {activeTab === "metricas" && (
            <MetricasPage
              areas={apostilasBundle.areas}
              questions={questionBundle.questions}
              progress={progress}
              onImportProgress={(imported) => setProgress(imported)}
              onResetProgress={() => setProgress(createInitialProgress())}
              onTrainArea={(areaId) => handleNavigate("quiz", { areaId })}
              onReviewSimulado={(simId) => {
                setReviewSimuladoId(simId);
                handleNavigate("simulado");
              }}
            />
          )}
        </main>
      </div>

      {!isFocusMode && (
        <nav
          aria-label="Navegação inferior"
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur md:hidden"
        >
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                  active
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {item.icon}
                <span className="truncate">{item.shortLabel}</span>
                {item.id === "simulado" && progress.activeSimulado && (
                  <span className="absolute top-1.5 right-4 h-1.5 w-1.5 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </nav>
      )}

      <CommandPalette
        open={commandOpen}
        areas={apostilasBundle.areas}
        onClose={() => setCommandOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default App;
