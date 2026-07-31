import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
      <div className="container text-center" style={{ paddingTop: '10vh' }}>
        <p>Missing reset code. Please use the link from your password reset email.</p>
      </div>
    );
  }

  return (
    <fieldset className="login" style={{ maxWidth: 400, margin: '10vh auto' }}>
      <legend className="legend">Password Reset</legend>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input">
          <label htmlFor="password">Enter new password:</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            title="Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least six characters long"
          />
        </div>
        <div className="input">
          <label htmlFor="confirmpassword">Confirm new password:</label>
          <input
            type="password"
            id="confirmpassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <span id="message" style={{ color: passwordsMatch ? 'green' : 'red' }}>
          {confirmPassword ? (passwordsMatch ? 'Matching' : 'Not Matching') : ''}
        </span>
        <button title="Reset password" type="submit" className="submit" disabled={submitting}>
          &rarr;
        </button>
      </form>
    </fieldset>
  );
}
