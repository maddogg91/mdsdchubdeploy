import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-shell">
      <div>
        <h1>404</h1>
        <p className="auth-subtitle">Page not found.</p>
        <Link to="/login">Back to log in</Link>
      </div>
    </div>
  );
}
