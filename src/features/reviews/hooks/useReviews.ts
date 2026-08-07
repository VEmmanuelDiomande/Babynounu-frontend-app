import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/vue-query';
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

export function useNounuReviews(nounuId: string, page = 1, limit = 5) {
  return useQuery({
    queryKey: queryKeys.nounus.reviews(nounuId),
    queryFn: async () => {
      const response = await axios.get(`${URL_API_ROUTE.REVIEW_GET_BY_NOUNU}/${nounuId}`, {
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!nounuId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCheckReview(nounuId: string) {
  return useQuery({
    queryKey: [...queryKeys.nounus.reviews(nounuId), 'check'],
    queryFn: async () => {
      const response = await axios.get(`${URL_API_ROUTE.REVIEW_CHECK}/${nounuId}`);
      return response.data;
    },
    enabled: !!nounuId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCheckReviewById(contractId: string) {
  return useQuery({
    queryKey: [...queryKeys.nounus.reviews(contractId), 'check'],
    queryFn: async () => {
      const response = await axios.get(`${URL_API_ROUTE.REVIEW_CHECK}/${contractId}`);
      return response.data;
    },
    enabled: !!contractId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Batch check reviews for multiple contract IDs.
 * Uses useQueries (proper TanStack Query pattern) instead of calling useQuery in a loop.
 * Returns a map of contractId -> hasReviewed for easy lookup.
 */
export function useCheckReviewsBatch(contractIds: MaybeRefOrGetter<string[]>) {
  const ids = computed(() => toValue(contractIds));
  const queries = useQueries({
    queries: computed(() =>
      ids.value.map((id) => ({
        queryKey: [...queryKeys.nounus.reviews(id), 'check'],
        queryFn: async () => {
          const response = await axios.get(`${URL_API_ROUTE.REVIEW_CHECK}/${id}`);
          return response.data;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
      }))
    ),
  });

  const reviewedMap = computed(() => {
    const map = new Map<string, boolean>();
    const queryResults = (queries as unknown) as any[];
    ids.value.forEach((id, i) => {
      const data = queryResults[i]?.data?.value;
      if (data?.hasReviewed) {
        map.set(id, true);
      }
    });
    return map;
  });

  return { reviewedMap };
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const headers = await getAuthHeaders();
      const response = await axios.post(URL_API_ROUTE.REVIEW_CREATE, data, { headers });
      return response.data;
    },
    onSuccess: (_, variables) => {
      if (variables.nounuId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.nounus.reviews(variables.nounuId) });
      }
    },
  });
}
