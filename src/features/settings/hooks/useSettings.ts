import { useQuery } from '@tanstack/vue-query';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';

export function useAllSettings() {
  return useQuery({
    queryKey: ['settings', 'all'],
    queryFn: async () => {
      const response = await axios.get(`${URL_API_ROUTE.SETTING_ALL}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
  });
}
