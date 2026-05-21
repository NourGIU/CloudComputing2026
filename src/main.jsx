import React from "react";
import ReactDOM from "react-dom/client";

import TasksPage from "./pages/TasksPage.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <TasksPage />
    </AuthProvider>
  </React.StrictMode>
);