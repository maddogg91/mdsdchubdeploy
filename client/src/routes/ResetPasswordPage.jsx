import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as authApi from '../api/auth.js';
import { ApiError } from '../api/client.js';

function checkPasswordStrength(password, confirm) {
  const number = /([0-9])/;
  const alphabets = /([a-zA-Z])/;
  const specialCharacters = /([~,!,@,#,$,%,^,&,*,\-,_,+,=,?,>,<])/;
  if (password.length < 6) {
    return 'Password needs to be at least six characters';
  }
  if (!(password.match(number) && password.match(alphabets) && password.match(specialCharacters))) {
    return 'Password missing 1 special character or number';
  }
  if (password !== confirm) {
    return 'Passwords do not match';
  }
  return null;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') ?? '';
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const strengthError = checkPasswordStrength(password, confirmPassword);
    if (strengthError) {
      setError(strengthError);
      return;
    }

    setSubmitting(true);
    try {
      await authApi.resetPassword(code, password, confirmPassword);
      navigate('/login');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Request either timed out or email was invalid'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!code) {
    return (
      <div className="auth-shell">
        <div className="auth-card text-center">
          <h1>Missing reset code</h1>
          <p className="auth-subtitle">
            Please use the link from your password reset email, or{' '}
            <Link to="/forgot">request a new one</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Choose a new password</h1>
        <p className="auth-subtitle">
          Must be at least six characters with a number and a special character.
        </p>

        {error && <p className="auth-alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="password">New password</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="confirmpassword">Confirm new password</label>
          <input
            type="password"
            id="confirmpassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && (
            <p className={passwordsMatch ? 'auth-alert auth-alert-success' : 'auth-alert'}>
              {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
            </p>
          )}
          <button type="submit" className="btn-brand-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}
