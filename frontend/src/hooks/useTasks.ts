import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/api/client';
import type { TaskCreate, TaskUpdate } from '@/types';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll,
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskApi.getById(id),
    enabled: !!id,
  });
}

export function useTasksByProject(projectId: number) {
  return useQuery({
    queryKey: ['tasks', 'by-project', projectId],
    queryFn: () => taskApi.getByProject(projectId),
    enabled: !!projectId,
  });
}

export function useTasksByDomain(domainId: number) {
  return useQuery({
    queryKey: ['tasks', 'by-domain', domainId],
    queryFn: () => taskApi.getByDomain(domainId),
    enabled: !!domainId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskCreate) => taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdate }) =>
      taskApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
