import { apiClient } from '@/lib/api';
import { PaginatedResponse, PaginationParams } from '@/lib/api/types';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { Notification } from '../types';

export interface GetNotificationsParams extends PaginationParams {
  userId?: string;
}

export const notificationsApi = {
  getAll: async (params: GetNotificationsParams): Promise<NotificationResponse> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.userId) queryParams.append('userId', params.userId);

    const res = await apiClient.get<any>(`${URL_API_ROUTE.NOTIFICATION_USER}?${queryParams.toString()}`);
    // TransformInterceptor wraps as { success, data: { data: [...], pagination: {...} } }
    // Unwrap to match NotificationResponse { data: [...], pagination: {...} }
    const unwrapped = res?.data ?? res;
    return unwrapped as NotificationResponse;
  },
};

export interface NotificationResponse extends PaginatedResponse<Notification> {
  count: number;
  unreadCount: number;
}
