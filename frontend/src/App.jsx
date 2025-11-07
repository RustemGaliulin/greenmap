import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Main from "./components/Main";
import AuthForm from "./components/AuthForm";
import UserPage from "./components/UserPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("access_token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Main isAuthenticated={isAuthenticated} onLogout={handleLogout}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <div className="text-center text-gray-700">
                  <h2 className="text-2xl font-semibold mb-4">
                    Welcome to 🌿 GreenMap!
                  </h2>
                  <p className="mb-6">
                    This is your main content area — soon to show data from your FastAPI backend.
                  </p>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <AuthForm mode="login" onSuccess={handleLogin} />
              )
            }
          />

          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <AuthForm mode="register" onSuccess={() => (window.location.href = "/login")} />
              )
            }
          />
          <Route
            path="/user"
            element={
              isAuthenticated ? (
                <UserPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Main>
    </Router>
  );
}
