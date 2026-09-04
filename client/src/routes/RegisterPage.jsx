import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth.js';
import { ApiError } from '../api/client.js';
import { GoogleIcon } from '../components/icons.jsx';

const EMAIL_REGEX = /^([a-zA-Z0-9_.\-+])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const STEPS = ['Account', 'Profile', 'Details'];

function checkPasswordStrength(password) {
  const number = /([0-9])/;
  const alphabets = /([a-zA-Z])/;
  const specialCharacters = /([~,!,@,#,$,%,^,&,*,\-,_,+,=,?,>,<])/;
  if (password.length < 6) {
    return 'Password needs to be at least six characters';
  }
  if (!(password.match(number) && password.match(alphabets) && password.match(specialCharacters))) {
    return 'Password missing 1 special character or number';
  }
  return null;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    country: '',
    bday: ''
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function goNextFromStep1() {
    setError('');
    if (!EMAIL_REGEX.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!form.email || !form.password || !form.confirmPassword) {
      setError('Missing required information');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password do not match');
      return;
    }
    const strengthError = checkPasswordStrength(form.password);
    if (strengthError) {
      setError(strengthError);
      return;
    }
    setStep(2);
  }

  function goNextFromStep2() {
    setError('');
    if (!form.country || !form.name) {
      setError('Missing required information');
      return;
    }
    setStep(3);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await authApi.register(form);
      navigate('/verify');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="auth-subtitle">A few quick steps and you&apos;re in.</p>

        {step === 1 && (
          <>
            <a href="/google" className="btn-google">
              <GoogleIcon />
              Sign up with Google
            </a>
            <div className="auth-divider">or</div>
          </>
        )}

        <div className="step-bar">
          {STEPS.map((label, idx) => (
            <div className={`step${step >= idx + 1 ? ' active' : ''}`} key={label}>
              <div className="step-number">{idx + 1}</div>
              <div>{label}</div>
            </div>
          ))}
        </div>

        {error && <p className="auth-alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="At least 6 characters, 1 number, 1 special character"
                required
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
              />
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                required
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
              />
              <button type="button" className="btn-brand-primary" onClick={goNextFromStep1}>
                Next
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                placeholder="Full name"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
              <label htmlFor="country">Country</label>
              <input
                id="country"
                type="text"
                placeholder="Country"
                required
                value={form.country}
                onChange={(e) => update('country', e.target.value)}
              />
              <div className="d-flex gap-2">
                <button type="button" className="btn-brand-outline w-100" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="button" className="btn-brand-primary w-100" onClick={goNextFromStep2}>
                  Next
                </button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <label htmlFor="birthday">Birth date</label>
              <input
                id="birthday"
                type="date"
                required
                value={form.bday}
                onChange={(e) => update('bday', e.target.value)}
              />
              <div className="d-flex gap-2">
                <button type="button" className="btn-brand-outline w-100" onClick={() => setStep(2)}>
                  Back
                </button>
                <button type="submit" className="btn-brand-primary w-100" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Register'}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="auth-footer-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
