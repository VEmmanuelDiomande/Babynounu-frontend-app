import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';
import { computed, toValue, type MaybeRefOrGetter, type Ref } from 'vue';

export function useParentProfile(enabled?: Ref<boolean> | boolean) {
  return useQuery({
    queryKey: queryKeys.users.parentProfile(),
    queryFn: async () => {
      const nToken = await StorageUtils().getStore('nToken');
      const token = nToken?.value;
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(URL_API_ROUTE.PARENT_ME, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: enabled !== undefined ? enabled : true,
  });
}

export function useParentProfileById(parentId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.users.parentDetail(toValue(parentId))),
    queryFn: async () => {
      const id = toValue(parentId);
      const response = await axios.get(`${URL_API_ROUTE.PARENT_FIND_ONE}/${id}`);
      return response.data;
    },
    enabled: computed(() => !!toValue(parentId)),
    staleTime: 1000 * 60 * 5,
  });
}

export function useNounuProfile(enabled?: Ref<boolean> | boolean) {
  return useQuery({
    queryKey: queryKeys.users.nounuProfile(),
    queryFn: async () => {
      const nToken = await StorageUtils().getStore('nToken');
      const token = nToken?.value;
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(URL_API_ROUTE.NOUNU_ME, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: enabled !== undefined ? enabled : true,
  });
}

export function useNounuProfileById(nounuId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.users.nounuDetail(toValue(nounuId))),
    queryFn: async () => {
      const id = toValue(nounuId);
      const response = await axios.get(`${URL_API_ROUTE.NOUNU_DETAIL}/${id}`);
      return response.data;
    },
    enabled: computed(() => !!toValue(nounuId)),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateNounuStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: 'disponible' | 'indisponible') => {
      const nToken = await StorageUtils().getStore('nToken');
      const token = nToken?.value;
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.patch(
        URL_API_ROUTE.NOUNU_UPDATE_STATUS,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.nounuProfile() });
    },
  });
}
