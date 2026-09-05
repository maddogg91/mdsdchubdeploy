import { apiFetch } from './client.js';

export function fetchMe() {
  return apiFetch('/auth/me');
}

export function login(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function register({ email, password, confirmPassword, name, country, bday, phone }) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, confirmPassword, name, country, bday, phone })
  });
}

export function verifyCode(code) {
  return apiFetch('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ code })
  });
}

export function resendVerification(email) {
  return apiFetch('/auth/resend', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export function forgotPassword(email) {
  return apiFetch('/auth/forgot', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export function resetPassword(code, password, confirmPassword) {
  return apiFetch('/auth/reset', {
    method: 'POST',
    body: JSON.stringify({ code, password, confirm_password: confirmPassword })
  });
}

export function logout() {
  return apiFetch('/auth/logout', { method: 'POST' });
}

export function changePassword(currentPassword, newPassword) {
  return apiFetch('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword })
  });
}
