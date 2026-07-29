import { RouteRecordRaw } from 'vue-router';

export const PrestationsRoutes: RouteRecordRaw = {
  path: '/prestations',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'PRESTATIONS',
      component: () => import('@/features/nounus/pages/PrestationsPage.vue'),
    },
  ],
};
