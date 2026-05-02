import type {
  Domain,
  DomainCreate,
  DomainUpdate,
  Project,
  ProjectCreate,
  ProjectUpdate,
  Task,
  TaskCreate,
  TaskUpdate,
} from '@/types';

const API_BASE_URL = 'http://localhost:8000/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Domain API
export const domainApi = {
  getAll: () => request<Domain[]>('/domains'),

  getById: (id: number) => request<Domain>(`/domains/${id}`),

  create: (data: DomainCreate) =>
    request<Domain>('/domains', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: DomainUpdate) =>
    request<Domain>(`/domains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/domains/${id}`, {
      method: 'DELETE',
    }),
};

// Project API
export const projectApi = {
  getAll: () => request<Project[]>('/projects'),

  getById: (id: number) => request<Project>(`/projects/${id}`),

  getByDomain: (domainId: number) =>
    request<Project[]>(`/projects/by-domain/${domainId}`),

  create: (data: ProjectCreate) =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: ProjectUpdate) =>
    request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

// Task API
export const taskApi = {
  getAll: () => request<Task[]>('/tasks'),

  getById: (id: number) => request<Task>(`/tasks/${id}`),

  getByProject: (projectId: number) =>
    request<Task[]>(`/tasks/by-project/${projectId}`),

  getByDomain: (domainId: number) =>
    request<Task[]>(`/tasks/by-domain/${domainId}`),

  create: (data: TaskCreate) =>
    request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: TaskUpdate) =>
    request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  complete: (id: number) =>
    request<Task>(`/tasks/${id}/complete`, {
      method: 'POST',
    }),

  delete: (id: number) =>
    request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};
