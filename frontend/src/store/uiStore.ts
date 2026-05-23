import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface UIState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  toasts: Toast[];
  authModal: "login" | "register" | null;

  toggleTheme: () => void;
  setTheme: (t: "light" | "dark") => void;
  toggleSidebar: () => void;
  openAuthModal: (mode: "login" | "register") => void;
  closeAuthModal: () => void;
  addToast: (message: string, type: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "light",
      sidebarOpen: false,
      toasts: [],
      authModal: null,

      toggleTheme() {
        const next = get().theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        set({ theme: next });
      },

      setTheme(t) {
        document.documentElement.setAttribute("data-theme", t);
        set({ theme: t });
      },

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      openAuthModal: (mode) => set({ authModal: mode }),

      closeAuthModal: () => set({ authModal: null }),

      addToast(message, type) {
        const id = crypto.randomUUID();
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        // Auto-dismiss after 4 seconds
        setTimeout(() => get().removeToast(id), 4000);
      },

      removeToast: (id) =>
        set((s) => ({
          toasts: s.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: "mathforge-ui",
      partialize: (s) => ({ theme: s.theme }),
    },
  ),
);
