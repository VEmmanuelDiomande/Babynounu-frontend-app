import { useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { computed, Ref } from 'vue';
import { notificationsApi, GetNotificationsParams } from '../api/notifications.api';
import { queryKeys } from '@/lib/query/query-keys';
import { Notification } from '../types';
import { NotificationResponse } from '../api/notifications.api';
import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';

const getAuthHeaders = async () => {
  const nToken = await StorageUtils().getStore('nToken');
  const token = nToken?.value;
  if (!token) {
    throw new Error('No token found');
  }
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
};

export function useNotifications(params: Ref<GetNotificationsParams>) {
  return useInfiniteQuery({
    queryKey: computed(() => queryKeys.notifications.list(params.value)),
    queryFn: ({ pageParam = 1 }) => notificationsApi.getAll({ ...params.value, page: pageParam }),
    getNextPageParam: (lastPage: NotificationResponse) => {
      if (lastPage.pagination?.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
    enabled: computed(() => !!params.value.userId),
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  const markAsRead = (notificationId: number) => {
    queryClient.setQueriesData({ queryKey: queryKeys.notifications.all }, (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: NotificationResponse) => ({
          ...page,
          data: page.data.map((notification: Notification) =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification
          ),
        })),
      };
    });
  };

  return { markAsRead };
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notifId: number) => {
      const headers = await getAuthHeaders();
      await axios.post(`${URL_API_ROUTE.NOTIFICATION_USER}/${notifId}/read`, {}, { headers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const headers = await getAuthHeaders();
      await axios.post(`${URL_API_ROUTE.NOTIFICATION_USER}/read-all`, {}, { headers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
