import { useContext } from "react";
import { ToastContext } from "./use-toast";

export function Toaster() {
  const context = useContext(ToastContext);

  if (!context || !context.toasts || context.toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {context.toasts.map((toast, index) => (
        <div
          key={index}
          className={`rounded px-4 py-3 shadow-lg ${
            toast.variant === "destructive"
              ? "bg-red-600 text-white"
              : "bg-gray-900 text-white"
          }`}
        >
          <strong>{toast.title}</strong>
          {toast.description && (
            <div className="text-sm">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}