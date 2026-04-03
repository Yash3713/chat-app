import { useEffect } from "react";
import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import {
  useAuthStore,
  useAuthUser,
  useIsCheckingAuth,
} from "./store/useAuthStore";

// ─── Route Guards ─────────────────────────────────────────────────────────────

// Redirects to /login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const authUser = useAuthUser();
  return authUser ? <>{children}</> : <Navigate to="/login" replace />;
};

// Redirects to / if already authenticated (for login/signup pages)
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const authUser = useAuthUser();
  return !authUser ? <>{children}</> : <Navigate to="/" replace />;
};

// ─── App ──────────────────────────────────────────────────────────────────────

const App: FC = () => {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isCheckingAuth = useIsCheckingAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Block render until auth state is resolved
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <Routes>
        {/* Protected — must be logged in */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Public only — redirect away if already logged in */}
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignUpPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <SignInPage />
            </PublicOnlyRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
