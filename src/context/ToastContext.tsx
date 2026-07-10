"use client";

import {
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
  XCircle,
} from "lucide-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastState {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<
  ToastType,
  {
    icon: React.ComponentType<{ className?: string }>;
    className: string;
    iconClassName: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-950",
    iconClassName: "text-emerald-600",
  },
  error: {
    icon: XCircle,
    className: "border-rose-200 bg-rose-50 text-rose-950",
    iconClassName: "text-rose-600",
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-950",
    iconClassName: "text-blue-600",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-amber-200 bg-amber-50 text-amber-950",
    iconClassName: "text-amber-600",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      setToast({
        id: Date.now(),
        type,
        title,
        message,
      });
    },
    [],
  );

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 4200);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (title, message) => showToast("success", title, message),
      error: (title, message) => showToast("error", title, message),
      info: (title, message) => showToast("info", title, message),
      warning: (title, message) => showToast("warning", title, message),
    }),
    [showToast],
  );

  const style = toast ? toastStyles[toast.type] : null;
  const Icon = style?.icon;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && style && Icon ? (
        <div className="fixed right-4 top-24 z-[100] w-[calc(100vw-2rem)] max-w-sm">
          <div
            role="status"
            aria-live="polite"
            className={`animate-fade-in rounded-2xl border p-4 shadow-xl ${style.className}`}
          >
            <div className="flex gap-3">
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconClassName}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message ? (
                  <p className="mt-1 text-sm leading-5 opacity-80">
                    {toast.message}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/60 transition hover:bg-white"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
