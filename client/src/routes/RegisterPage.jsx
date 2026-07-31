import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth.js';
import { ApiError } from '../api/client.js';

const EMAIL_REGEX = /^([a-zA-Z0-9_.\-+])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

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
      setError('Email Account is invalid');
      return;
    }
    if (!form.email || !form.password || !form.confirmPassword) {
      setError('Missing required information');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Password and Confirm Password does not match');
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
    <div id="top-level" className="container">
      <div className="step-bar">
        <ul>
          <li>
            <div className={`number${step >= 1 ? ' active' : ''}`}>1</div>
            <div className="text">account setup</div>
          </li>
          <li>
            <div className={`number${step >= 2 ? ' active' : ''}`}>2</div>
            <div className="text">profiles</div>
            <div className={`line${step >= 2 ? ' line-active' : ''}`} />
          </li>
          <li>
            <div className={`number${step >= 3 ? ' active' : ''}`}>3</div>
            <div className="text">details</div>
            <div className={`line${step >= 3 ? ' line-active' : ''}`} />
          </li>
        </ul>
      </div>
      <div className="cont">
        <h2 style={{ color: 'ghostwhite' }}>Create new account</h2>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="account-setup register-form">
              <h2>Step 1</h2>
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
              <label>
                Password must be at least six chars, with at least one number &amp; special char
              </label>
              <input
                type="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
              />
              <div className="button firstNext" onClick={goNextFromStep1}>
                Next
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="user-details register-form">
              <h2>Step 2</h2>
              <input
                type="text"
                placeholder="Full name"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Country"
                required
                value={form.country}
                onChange={(e) => update('country', e.target.value)}
              />
              <div className="button firstPrev" onClick={() => setStep(1)}>
                Back
              </div>
              <div className="button secondNext" onClick={goNextFromStep2}>
                Next
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="finish-step register-form">
              <h2>Step 3</h2>
              <label htmlFor="birthday">Birth date</label>
              <input
                className="error"
                id="birthday"
                type="date"
                required
                value={form.bday}
                onChange={(e) => update('bday', e.target.value)}
              />
              <div className="button secondPrev" onClick={() => setStep(2)}>
                Back
              </div>
              <button type="submit" className="button register" disabled={submitting}>
                Register
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
