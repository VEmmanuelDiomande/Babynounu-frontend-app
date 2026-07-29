import { useQuery } from '@tanstack/vue-query';
import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';
import { computed, Ref } from 'vue';

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

export function useParentProfileById(parentId: string) {
  return useQuery({
    queryKey: queryKeys.users.parentDetail(parentId),
    queryFn: async () => {
      const response = await axios.get(`${URL_API_ROUTE.PARENT_FIND_ONE}/${parentId}`);
      return response.data;
    },
    enabled: !!parentId,
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

export function useNounuProfileById(nounuId: string) {
  return useQuery({
    queryKey: queryKeys.users.nounuDetail(nounuId),
    queryFn: async () => {
      const response = await axios.get(`${URL_API_ROUTE.NOUNU_DETAIL}/${nounuId}`);
      return response.data;
    },
    enabled: !!nounuId,
    staleTime: 1000 * 60 * 5,
  });
}
