import { apiFetch } from './client.js';

export function createContractor(name, email) {
  return apiFetch('/admin/contractors', {
    method: 'POST',
    body: JSON.stringify({ name, email })
  });
}
