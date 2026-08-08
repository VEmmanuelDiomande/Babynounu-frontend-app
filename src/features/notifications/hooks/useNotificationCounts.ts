import { useQuery } from '@tanstack/vue-query';
import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';
import type { Ref } from 'vue';

export function useChatUnreadCount(enabled?: Ref<boolean> | boolean) {
  return useQuery({
    queryKey: queryKeys.messages.unreadCount(),
    queryFn: async () => {
      const nToken = await StorageUtils().getStore('nToken');
      const token = nToken?.value;
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(URL_API_ROUTE.UNREAD_COUNT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return typeof response.data === 'number' ? response.data : response.data?.unreadCount || 0;
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval: false,
    enabled: enabled !== undefined ? enabled : true,
  });
}

export function useNotificationUnreadCount(enabled?: Ref<boolean> | boolean) {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: async () => {
      const nToken = await StorageUtils().getStore('nToken');
      const token = nToken?.value;
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${URL_API_ROUTE.NOTIFICATION_USER}/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return typeof response.data === 'number' ? response.data : response.data?.count || 0;
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval: false,
    enabled: enabled !== undefined ? enabled : true,
  });
}
