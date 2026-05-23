import { useUIStore } from "@/store/uiStore";
import "@/styles/components/toast.css";

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span>{t.message}</span>
          <button
            className="toast-close"
            onClick={() => removeToast(t.id)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
