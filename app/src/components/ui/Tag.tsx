import React from "react";

export type TagTone = "neutral" | "accent" | "success" | "warning" | "danger";

export interface TagProps {
  tone?: TagTone;
  mono?: boolean;
  className?: string;
  children: React.ReactNode;
}

const TONE_CLASSES: Record<TagTone, string> = {
  neutral:
    "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-subtle)]",
  accent:
    "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/45 dark:text-blue-300 dark:border-blue-800/60",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/45 dark:text-emerald-300 dark:border-emerald-800/60",
  warning:
    "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/45 dark:text-amber-300 dark:border-amber-800/60",
  danger:
    "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/45 dark:text-rose-300 dark:border-rose-800/60",
};

export const Tag: React.FC<TagProps> = ({
  tone = "neutral",
  mono = false,
  className = "",
  children,
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium leading-tight tabular-nums ${
        mono ? "font-mono" : ""
      } ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
};
