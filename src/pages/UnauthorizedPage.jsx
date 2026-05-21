import React from "react";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <main className="centered-page">
      <section className="login-panel">
        <h1>Unauthorized</h1>
        <p>Your account does not have permission to view this page.</p>
        <Link className="button-link" to="/tasks">Back to tasks</Link>
      </section>
    </main>
  );
}
