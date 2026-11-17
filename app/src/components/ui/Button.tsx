import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost" | "danger";
export type ButtonSize = "xs" | "sm" | "md";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-900 text-zinc-50 border border-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-white",
  accent:
    "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-600 dark:border-blue-500 dark:hover:bg-blue-500",
  secondary:
    "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong)] active:bg-[var(--bg-subtle)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] border border-transparent hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] active:bg-[var(--bg-subtle)]",
  danger:
    "bg-transparent text-rose-600 border border-rose-200 hover:bg-rose-50 active:bg-rose-100 dark:text-rose-400 dark:border-rose-900/70 dark:hover:bg-rose-950/50",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1.5 rounded-md",
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-9 px-3.5 text-[13px] gap-2 rounded-lg",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "secondary",
  size = "sm",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  children,
  type = "button",
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`inline-flex shrink-0 items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-45 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
};
