import React from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/AppLayout.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LoginPage from "./pages/LoginPage.jsx";

import ProjectsPage from "./pages/ProjectsPage.jsx";

import TasksPage from "./pages/TasksPage.jsx";

import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";

import Dashboard from "./components/Dashboard.jsx";

export default function App() {

  return (
    <Routes>

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/unauthorized"
        element={
          <UnauthorizedPage />
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="tasks"
          element={<TasksPage />}
        />

        <Route
          path="projects"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Manager",
              ]}
            >
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}