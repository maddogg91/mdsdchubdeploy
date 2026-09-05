import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ContractorDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/contractor');
  }

  return (
    <div className="auth-shell">
      <div className="auth-card text-center">
        <h1>Welcome, {user?.name}</h1>
        <p className="auth-subtitle">
          Your contractor account is set up. Project assignments and tools will show up here in a
          future update.
        </p>
        <button type="button" className="btn-brand-outline" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
