"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";
type ToastPayload = {
  id: string;
  title: string;
  description?: string;
  kind: ToastKind;
};

type ToastContextValue = {
  toast: (input: Omit<ToastPayload, "id">) => void;
};
const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <Toaster />");
  return ctx;
}

const ICONS: Record<ToastKind, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastPayload[]>([]);

  const toast = React.useCallback((input: Omit<ToastPayload, "id">) => {
    setToasts((t) => [...t, { ...input, id: crypto.randomUUID() }]);
  }, []);

  const remove = React.useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastPrimitive.Provider duration={4000} swipeDirection="right">
        {toasts.map((t) => {
          const Icon = ICONS[t.kind];
          return (
            <ToastPrimitive.Root
              key={t.id}
              onOpenChange={(open) => !open && remove(t.id)}
              className={cn(
                "group pointer-events-auto relative flex w-full items-start gap-3 rounded-card border border-line bg-surface p-4 shadow-card-hover",
                "data-[state=open]:animate-fade-in",
                "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
                "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out]",
                "data-[swipe=end]:animate-out data-[swipe=end]:fade-out-80",
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 h-5 w-5 shrink-0",
                  t.kind === "success" && "text-success",
                  t.kind === "error" && "text-danger",
                  t.kind === "info" && "text-purple",
                )}
              />
              <div className="flex-1">
                <ToastPrimitive.Title className="text-sm font-semibold text-ink">
                  {t.title}
                </ToastPrimitive.Title>
                {t.description && (
                  <ToastPrimitive.Description className="mt-0.5 text-xs text-muted">
                    {t.description}
                  </ToastPrimitive.Description>
                )}
              </div>
              <ToastPrimitive.Close className="text-muted hover:text-ink">
                <X className="h-4 w-4" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          );
        })}
        <ToastPrimitive.Viewport className="fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
