import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';

const getAuthHeaders = async () => {
  const nToken = await StorageUtils().getStore('nToken');
  const token = nToken?.value;
  if (!token) {
    throw new Error('No token found');
  }
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
};

export function useAllContracts() {
  return useQuery({
    queryKey: queryKeys.contracts.lists(),
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.CONTRACT_ALL}`, { headers });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
