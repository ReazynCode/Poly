// Domain Types
export interface Domain {
  id: number;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string | null;
}

export interface DomainCreate {
  name: string;
  description?: string;
  color?: string;
}

export interface DomainUpdate {
  name?: string;
  description?: string;
  color?: string;
}

// Project Types
export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'archived';

export interface Project {
  id: number;
  title: string;
  description: string | null;
  status: ProjectStatus;
  domain_id: number;
  created_at: string;
  updated_at: string | null;
}

export interface ProjectCreate {
  title: string;
  description?: string;
  status?: ProjectStatus;
  domain_id: number;
}

export interface ProjectUpdate {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  domain_id?: number;
}

// Task Types
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskIntent = 'passive' | 'work';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  intent: TaskIntent;
  priority: TaskPriority;
  url: string | null;
  due_date: string | null;
  project_id: number;
  domain_id: number;
  created_at: string;
  completed_at: string | null;
  updated_at: string | null;
}

export interface TaskCreate {
  title: string;
  description?: string;
  status?: TaskStatus;
  intent?: TaskIntent;
  priority?: TaskPriority;
  url?: string;
  due_date?: string;
  project_id: number;
  domain_id: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  intent?: TaskIntent;
  priority?: TaskPriority;
  url?: string;
  due_date?: string;
  project_id?: number;
  domain_id?: number;
}
