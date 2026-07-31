import { apiFetch } from './client.js';

export function updateProfile(body) {
  return apiFetch('/profile', {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/profile/avatar', {
    method: 'POST',
    credentials: 'same-origin',
    body: formData
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error?.message ?? 'Avatar upload failed');
  }
  return body.data;
}
