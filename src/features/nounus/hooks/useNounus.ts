import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/vue-query';
import { computed, Ref } from 'vue';
import { nounusApi, GetNounusParams } from '../api/nounus.api';
import { queryKeys } from '@/lib/query/query-keys';
import { Nounu } from '../types';
import { PaginatedResponse } from '@/lib/api/types';

export function useNounus(params: Ref<GetNounusParams>) {
  return useQuery({
    queryKey: computed(() => queryKeys.nounus.list(params.value)),
    queryFn: () => nounusApi.getAll(params.value),
  });
}

export function useInfiniteNounus(params: Ref<Omit<GetNounusParams, 'page'>>) {
  return useInfiniteQuery({
    queryKey: computed(() => queryKeys.nounus.list(params.value)),
    queryFn: ({ pageParam = 1 }) => 
      nounusApi.getAll({ ...params.value, page: pageParam }),
    getNextPageParam: (lastPage: PaginatedResponse<Nounu>) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useSearchNounus(params: Ref<Omit<GetNounusParams, 'page'>>) {
  return useInfiniteQuery({
    queryKey: computed(() => queryKeys.nounus.list({ ...params.value, searchType: 'search' })),
    queryFn: ({ pageParam = 1 }) => 
      nounusApi.search({ ...params.value, page: pageParam }),
    getNextPageParam: (lastPage: PaginatedResponse<Nounu>) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useNounu(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.nounus.detail(id.value)),
    queryFn: () => nounusApi.getById(id.value),
    enabled: computed(() => !!id.value),
  });
}

export function useCreateNounu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Nounu>) => nounusApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nounus.lists() });
    },
  });
}

export function useUpdateNounu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Nounu> }) => 
      nounusApi.update(id, data),
    onSuccess: (_data: Nounu, variables: { id: string; data: Partial<Nounu> }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nounus.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.nounus.lists() });
    },
  });
}

export function useDeleteNounu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => nounusApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nounus.lists() });
    },
  });
}
