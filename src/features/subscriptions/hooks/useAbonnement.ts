import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { StorageUtils } from '@/utils/store.utils';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';
import { unwrap } from '@/utils/helpers.utils';
import type { Ref } from 'vue';

const getAuthHeaders = async () => {
  const nToken = await StorageUtils().getStore('nToken');
  const token = nToken?.value;
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
};

/**
 * Vérifie si l'utilisateur a un abonnement actif.
 * @param enabled Réf/booléen pour activer la query (défaut: true).
 * La query est mise en cache par TanStack Query (staleTime 5 min), ce qui
 * évite les appels HTTP dupliqués à /subscriptions/me lors des remontages
 * du layout.
 *
 * Retourne l'objet subscription déwrappé (ou null si pas d'abonnement).
 * Pour vérifier si l'abonnement est actif, utiliser isSubscriptionActive()
 * depuis @/utils/helpers.utils.
 */
export function useHasActiveSubscription(enabled?: Ref<boolean> | boolean) {
  return useQuery({
    queryKey: queryKeys.subscriptions.status(),
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const { data } = await axios.get(
        URL_API_ROUTE.ABONNEMENT_HAS_ACTIVE_SUBSCRIPTION,
        { headers }
      );
      // Déwrappe la réponse du TransformInterceptor : { success, data: subscription }
      return unwrap(data);
    },
    staleTime: 1000 * 60 * 5,
    enabled: enabled !== undefined ? enabled : true,
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
