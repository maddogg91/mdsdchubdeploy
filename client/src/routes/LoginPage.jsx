import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ApiError } from '../api/client.js';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiError && err.status === 403 && err.code === 'NOT_VERIFIED') {
        navigate('/verify');
        return;
      }
      setError('Invalid Email or Password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-fluid">
      <div className="webform" style={{ position: 'relative', height: 500 }}>
        <div>
          <div className="login">
            <h1>Login</h1>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="email"
                placeholder="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="btn btn-dark btn-block btn-large" disabled={submitting}>
                Login
              </button>
            </form>
            No Account?{' '}
            <Link to="/register">
              <button className="btn btn-dark btn-block btn-small">Register Here</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
