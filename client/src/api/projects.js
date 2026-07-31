import { apiFetch } from './client.js';

export function createProject(projectType, body) {
  return apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify({ ...body, projectType })
  });
}

export function updateProject(id, request) {
  return apiFetch(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ request })
  });
}

export function deleteProject(id) {
  return apiFetch(`/projects/${id}`, { method: 'DELETE' });
}

export function payForProject(id) {
  return apiFetch(`/projects/${id}/pay`, { method: 'POST' });
}

export function requestProjectUpdate(id, message) {
  return apiFetch(`/projects/${id}/request-update`, {
    method: 'POST',
    body: JSON.stringify({ message })
  });
}
