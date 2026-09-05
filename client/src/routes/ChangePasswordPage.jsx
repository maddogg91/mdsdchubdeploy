import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { destinationForUser } from '../utils/redirects.js';

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

export default function ChangePasswordPage() {
  const { user, changePassword } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const strengthError = checkPasswordStrength(newPassword, confirmPassword);
    if (strengthError) {
      setError(strengthError);
      return;
    }

    setSubmitting(true);
    try {
      const updatedUser = await changePassword(currentPassword, newPassword);
      navigate(destinationForUser(updatedUser), { replace: true });
    } catch (err) {
      setError(err.message ?? 'Could not change password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Set a new password</h1>
        <p className="auth-subtitle">
          {user?.mustChangePassword
            ? 'Your account was created with a temporary password. Choose a new one to continue.'
            : 'Update your account password.'}
        </p>

        {error && <p className="auth-alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="currentPassword">
            {user?.mustChangePassword ? 'Temporary password' : 'Current password'}
          </label>
          <input
            id="currentPassword"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label htmlFor="confirmPassword">Confirm new password</label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className="btn-brand-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Set password'}
          </button>
        </form>
      </div>
    </div>
  );
}
