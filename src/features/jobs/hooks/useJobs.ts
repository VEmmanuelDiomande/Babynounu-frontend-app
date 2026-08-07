import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';

const getAuthHeaders = async () => {
  const nToken = await StorageUtils().getStore('nToken');
  const token = nToken?.value;
  if (!token) {
    throw new Error('No token found');
  }
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
};

export function useAllJobs(params?: MaybeRefOrGetter<Record<string, any>>) {
  return useQuery({
    queryKey: computed(() => [...queryKeys.jobs.lists(), toValue(params)]),
    queryFn: async () => {
      const nToken = await StorageUtils().getStore('nToken');
      const token = nToken?.value;
      const response = await axios.get(`${URL_API_ROUTE.JOB_ALL}`, {
        params: toValue(params),
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useInfiniteJobs(params?: MaybeRefOrGetter<Record<string, any>>) {
  return useInfiniteQuery({
    queryKey: computed(() => [...queryKeys.jobs.lists(), toValue(params)]),
    queryFn: async ({ pageParam = 1 }) => {
      const nToken = await StorageUtils().getStore('nToken');
      const token = nToken?.value;
      const response = await axios.get(`${URL_API_ROUTE.JOB_ALL}`, {
        params: { ...toValue(params), page: pageParam },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data;
    },
    getNextPageParam: (lastPage: any) => {
      // Backend retourne { success, data: { data, pagination } } via TransformInterceptor
      const pagination = lastPage?.data?.pagination || lastPage?.pagination;
      if (pagination?.hasNextPage) {
        return pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2,
  });
}

export function useJobApplications(jobId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.jobs.applications(toValue(jobId))),
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.JOB_APPLICATION_OWNER}`, { headers });
      return response.data;
    },
    enabled: computed(() => !!toValue(jobId)),
    staleTime: 1000 * 60 * 2,
  });
}

export function useMyJobs() {
  return useQuery({
    queryKey: queryKeys.jobs.myJobs(),
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.JOB_APPLICATION_OWNER}`, { headers });
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useUserJobs() {
  return useQuery({
    queryKey: queryKeys.jobs.userJobs(),
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const userId = (await StorageUtils().getStore('nUser_Id'))?.value;
      const response = await axios.get(`${URL_API_ROUTE.JOB_USER}`, {
        headers,
        params: userId ? { userId } : undefined,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useJobDetail(jobId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.jobs.detail(toValue(jobId))),
    queryFn: async () => {
      const response = await axios.get(`${URL_API_ROUTE.JOB_ONLY}/${toValue(jobId)}`);
      return response.data;
    },
    enabled: computed(() => !!toValue(jobId)),
    staleTime: 1000 * 60 * 2,
  });
}

export function useJobApplicationsForJob(jobId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.jobs.applications(toValue(jobId))),
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.JOB_APPLICATION_USER}`, { headers });
      return response.data;
    },
    enabled: computed(() => !!toValue(jobId)),
    staleTime: 1000 * 60 * 2,
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobId: string) => {
      const headers = await getAuthHeaders();
      await axios.delete(`${URL_API_ROUTE.JOB_DELETE}/${jobId}`, { headers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.userJobs() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
    },
  });
}

export function useApplyToJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobId: string) => {
      const headers = await getAuthHeaders();
      await axios.post(`${URL_API_ROUTE.JOB_APPLY}/${jobId}/apply`, {}, { headers });
    },
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.applications(jobId) });
    },
  });
}
