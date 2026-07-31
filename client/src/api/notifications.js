import { apiFetch } from './client.js';

export function markNotificationRead(id) {
  return apiFetch(`/notifications/${id}/read`, { method: 'POST' });
}

export function deleteNotification(id) {
  return apiFetch(`/notifications/${id}`, { method: 'DELETE' });
}
