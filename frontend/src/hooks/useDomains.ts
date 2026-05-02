import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { domainApi } from '@/api/client';
import type { DomainCreate, DomainUpdate } from '@/types';

export function useDomains() {
  return useQuery({
    queryKey: ['domains'],
    queryFn: domainApi.getAll,
  });
}

export function useDomain(id: number) {
  return useQuery({
    queryKey: ['domains', id],
    queryFn: () => domainApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DomainCreate) => domainApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
    },
  });
}

export function useUpdateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DomainUpdate }) =>
      domainApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
    },
  });
}

export function useDeleteDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => domainApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
    },
  });
}
