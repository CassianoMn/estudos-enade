import React, { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Clock,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Moon,
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
import { DashboardPage } from "./pages/DashboardPage";
import { ApostilasPage } from "./pages/ApostilasPage";
import { QuizPage } from "./pages/QuizPage";
import { SimuladoPage } from "./pages/SimuladoPage";
import { MetricasPage } from "./pages/MetricasPage";

type AppTab = "dashboard" | "apostilas" | "quiz" | "simulado" | "metricas";

const apostilasBundle = apostilasRaw as ApostilasBundle;
const questionBundle = questionsRaw as QuestionBankBundle;

export const App: React.FC = () => {
  const [progress, setProgress] = useState<StudyProgress>(() => loadProgress());
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard");
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

  const handleNavigate = (tab: AppTab, opts?: { areaId?: string }) => {
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

  const navItems: Array<{ id: AppTab; label: string; icon: React.ReactNode }> = [
    { id: "dashboard", label: "Início", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "apostilas", label: "Apostilas", icon: <BookOpen className="h-4 w-4" /> },
    { id: "quiz", label: "Quiz por Áreas", icon: <ListChecks className="h-4 w-4" /> },
    { id: "simulado", label: "Simulado", icon: <Clock className="h-4 w-4" /> },
    { id: "metricas", label: "Métricas", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Navbar superior */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => handleNavigate("dashboard")}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                EstudosEnade
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Sistemas de Informação
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {item.id === "simulado" && progress.activeSimulado && (
                    <span className="ml-1 h-2 w-2 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() =>
              setProgress((prev) => ({
                ...prev,
                theme: prev.theme === "dark" ? "light" : "dark",
              }))
            }
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Alternar tema claro/escuro"
          >
            {progress.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Navegação móvel */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 md:hidden dark:border-slate-800">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {activeTab === "dashboard" && (
          <DashboardPage
            areas={apostilasBundle.areas}
            questions={questionBundle.questions}
            progress={progress}
            onNavigate={handleNavigate}
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
  );
};

export default App;
