import { useUIStore } from "@/store/uiStore";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();
  return (
    <button
      className="btn btn-secondary btn-sm"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {theme === "light" ? "🌙 Dark mode" : "💡 Light mode"}
    </button>
  );
}
