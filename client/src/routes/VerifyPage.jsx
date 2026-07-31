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
    try {
      await authApi.resendVerification(email);
      setInfo(`Verification email sent to ${email}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend verification code');
    }
  }

  return (
    <div className="container">
      <h2>Verify your account</h2>
      <p className="info">
        Check your email account for the verification code. You&apos;ll have 30 minutes to enter
        it. If you need a new code, enter your email below and click resend.
      </p>
      {error && <p className="text-danger">{error}</p>}
      {info && <p className="text-success">{info}</p>}
      <div className="code-container">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="number"
            className="code"
            placeholder="0"
            min="0"
            max="9"
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
          />
        ))}
      </div>
      <input
        className="floating-text"
        type="text"
        placeholder="Enter Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleResend} className="floating-btn" type="button">
        Resend Verification Code
      </button>
    </div>
  );
}
