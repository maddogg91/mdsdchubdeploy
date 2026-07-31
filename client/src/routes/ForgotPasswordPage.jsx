import React, { useState } from 'react';
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
    <div className="d-flex justify-content-center" style={{ paddingTop: '10vh' }}>
      <div className="card login-form" style={{ width: 320 }}>
        <div className="card-body">
          <h3 className="card-title text-center">Reset password</h3>
          {sent ? (
            <p className="text-success">
              If an account exists for that email, a password reset link has been sent.
            </p>
          ) : (
            <div className="card-text">
              {error && <p className="text-danger">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">
                    Enter your email address and we will send you a link to reset your password.
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control form-control-sm"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  Send password reset email
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
