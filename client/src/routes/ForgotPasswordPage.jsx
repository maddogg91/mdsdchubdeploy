import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as authApi from '../api/auth.js';
import { ApiError } from '../api/client.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send reset email');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Reset your password</h1>
        {sent ? (
          <p className="auth-alert auth-alert-success">
            If an account exists for that email, a password reset link has been sent.
          </p>
        ) : (
          <>
            <p className="auth-subtitle">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
            {error && <p className="auth-alert">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-brand-primary" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send reset email'}
              </button>
            </form>
          </>
        )}
        <p className="auth-footer-link">
          Remembered it? <Link to="/login">Back to log in</Link>
        </p>
      </div>
    </div>
  );
}
