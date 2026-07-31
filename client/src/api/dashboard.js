import { apiFetch } from './client.js';

export function fetchDashboard() {
  return apiFetch('/dashboard');
}
