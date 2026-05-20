import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const formatLoginError = (error) => {
  const message = error?.message || "Login failed.";

  if (message.includes("SECRET_HASH")) {
    return "This Cognito app client has a client secret. Create or use a Cognito app client without a client secret for browser login, then update COGNITO_CLIENT_ID and VITE_COGNITO_CLIENT_ID in .env.";
  }

  return message;
};

export default function LoginPage() {
  const { currentUser, login, setPermanentPassword } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [needsNewPassword, setNeedsNewPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || "/tasks";

  if (currentUser) {
    return <Navigate to={destination} replace />;
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const result = await login(username.trim(), password);
      if (result.status === "NEW_PASSWORD_REQUIRED") {
        setNeedsNewPassword(true);
        return;
      }

      navigate(destination, { replace: true });
    } catch (err) {
      console.error(err);
      setError(formatLoginError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleNewPassword = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await setPermanentPassword(newPassword);
      navigate(destination, { replace: true });
    } catch (err) {
      console.error(err);
      setError(formatLoginError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <h1>Mini-Jira</h1>
        <p>Sign in with your Cognito account.</p>

        {error && <div className="error-message">{error}</div>}

        {!needsNewPassword ? (
          <form onSubmit={handleLogin}>
            <label>
              Username
              <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            </label>
            <button type="submit" disabled={saving}>
              {saving ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleNewPassword}>
            <label>
              Permanent password
              <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" required />
            </label>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Set password and continue"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
