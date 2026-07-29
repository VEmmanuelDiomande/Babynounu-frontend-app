import { RouteRecordRaw } from 'vue-router';

export const ContractRoutes: RouteRecordRaw = {
  path: '/contracts',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'CONTRACTS',
      component: () => import('@/features/nounus/pages/ComingSoonPage.vue'),
    },
  ],
};
