import { RouteRecordRaw } from 'vue-router';

export const SettingRoutes: RouteRecordRaw = {
  path: '/settings',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'SETTINGS',
      component: () => import('@/features/nounus/pages/SettingsPage.vue'),
    },
  ],
};
