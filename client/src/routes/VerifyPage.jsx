import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth.js';
import { ApiError } from '../api/client.js';

const DIGIT_COUNT = 5;

export default function VerifyPage() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(DIGIT_COUNT).fill(''));
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const inputRefs = useRef([]);

  async function submitCode(code) {
    setError('');
    try {
      await authApi.verifyCode(code);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Verification failed');
      setDigits(Array(DIGIT_COUNT).fill(''));
      inputRefs.current[0]?.focus();
    }
  }

  function handleDigitChange(idx, value) {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);

    if (digit && idx < DIGIT_COUNT - 1) {
      inputRefs.current[idx + 1]?.focus();
    }

    if (next.every((d) => d !== '')) {
      submitCode(next.join(''));
    }
  }

  function handleKeyDown(idx, e) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  async function handleResend() {
    if (!email) return;
    setError('');
    setInfo('');
    try {
      await authApi.resendVerification(email);
      setInfo(`Verification email sent to ${email}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend verification code');
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Verify your account</h1>
        <p className="auth-subtitle">
          Enter the code we emailed you. It&apos;s valid for 30 minutes -- need a new one? Enter
          your email below and resend.
        </p>

        {error && <p className="auth-alert">{error}</p>}
        {info && <p className="auth-alert auth-alert-success">{info}</p>}

        <div className="code-container">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="number"
              className="code-input"
              placeholder="0"
              min="0"
              max="9"
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
            />
          ))}
        </div>

        <label htmlFor="resend-email">Email address</label>
        <input
          id="resend-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleResend} className="btn-brand-outline" type="button">
          Resend verification code
        </button>
      </div>
    </div>
  );
}
