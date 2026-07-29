import { RouteRecordRaw } from 'vue-router';

export const NotificationRoutes: RouteRecordRaw = {
  path: '/notifications',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'NOTIFICATIONS',
      component: () => import('@/features/nounus/pages/NotificationsPage.vue'),
    },
  ],
};
