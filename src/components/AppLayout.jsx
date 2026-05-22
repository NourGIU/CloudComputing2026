import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function AppLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h1>Mini-Jira</h1>
          <div className="user-panel">
            <strong>{currentUser.name}</strong>
            <span>{currentUser.email}</span>
            <span>{currentUser.role} / {currentUser.teamId}</span>
          </div>
        </div>

        <nav>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/activity">Activity</NavLink>
          <NavLink to="/notifications">Notifications</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          {currentUser.role === "Manager" && <NavLink to="/projects">Projects</NavLink>}
        </nav>

        <button className="secondary-button" type="button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
