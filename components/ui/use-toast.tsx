import { createContext, useContext, useState, ReactNode } from "react";

type Toast = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

type ToastContextType = {
  toast: (toast: Toast) => void;
  toasts: Toast[];
};


export const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastFunction: ((toast: Toast) => void) | undefined;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  };

  toastFunction = toast;

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t, i) => (
          <div
            key={i}
            className={`rounded px-4 py-3 shadow-lg ${
              t.variant === "destructive"
                ? "bg-red-600 text-white"
                : "bg-gray-900 text-white"
            }`}
          >
            <strong>{t.title}</strong>
            {t.description && <div className="text-sm">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export const toast = (args: Toast) => {
  if (toastFunction) {
    toastFunction(args);
  } else {
    console.warn("Toast function called before ToastProvider was initialized");
  }
};