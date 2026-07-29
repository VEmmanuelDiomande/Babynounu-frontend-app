import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { StorageUtils } from '@/utils/store.utils';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';

const getAuthHeaders = async () => {
  const nToken = await StorageUtils().getStore('nToken');
  const token = nToken?.value;
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
};

export function useHasActiveSubscription() {
  return useQuery({
    queryKey: queryKeys.subscriptions.status(),
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const { data } = await axios.get(
        URL_API_ROUTE.ABONNEMENT_HAS_ACTIVE_SUBSCRIPTION,
        { headers }
      );
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateAbonnement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(URL_API_ROUTE.ABONNEMENT_COMFIRM, {
        userId: (await StorageUtils().getStore('nUser_Id')).value,
        transactionId: (await StorageUtils().getStore('nTransactionId')).value,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.status() });
    },
  });
}
