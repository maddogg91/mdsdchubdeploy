import React, { useState } from 'react';
import * as adminApi from '../api/admin.js';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.toLowerCase().endsWith('@maddoggsoftware.com')) {
      setError('Contractor email must end with @maddoggsoftware.com');
      return;
    }

    setSubmitting(true);
    try {
      await adminApi.createContractor(name, email);
      setSuccess(`Account created. Login credentials were emailed to ${email}.`);
      setName('');
      setEmail('');
    } catch (err) {
      setError(err.message ?? 'Could not create contractor account');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Add a Contractor</h1>
        <p className="auth-subtitle">
          Creates a login and emails a one-time password. They&apos;ll be asked to set a new
          password on first login.
        </p>

        {error && <p className="auth-alert">{error}</p>}
        {success && <p className="auth-alert auth-alert-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="name@maddoggsoftware.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn-brand-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Contractor Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
