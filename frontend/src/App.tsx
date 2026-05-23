import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import Navbar from "@/components/layout/Navbar";

// Pages — add these files one by one in Phase 3
import LandingPage from "@/pages/LandingPage";
import SubjectHub from "@/pages/SubjectHub";
import TopicDetail from "@/pages/TopicDetail";
import ForgeMode from "@/pages/ForgeMode";
import CareerExplorer from "@/pages/CareerExplorer";
import Leaderboard from "@/pages/Leaderboard";
import Dashboard from "@/pages/Dashboard";
import Achievements from "@/pages/Achievements";
import NotFound from "@/pages/NotFound";
import ToastContainer from "@/components/shared/Toast";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.accessToken);
  return token ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  const { theme, setTheme } = useUIStore();

  // Sync theme attribute on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/subjects" element={<SubjectHub />} />
          <Route path="/subjects/:subjectId" element={<SubjectHub />} />
          <Route path="/topics/:topicId" element={<TopicDetail />} />
          <Route path="/careers" element={<CareerExplorer />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <PrivateRoute>
                <Achievements />
              </PrivateRoute>
            }
          />
          <Route
            path="/topics/:topicId/forge"
            element={
              <PrivateRoute>
                <ForgeMode />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
