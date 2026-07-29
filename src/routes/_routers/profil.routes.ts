import { RouteRecordRaw } from 'vue-router';

export const ProfilRoutes: RouteRecordRaw = {
  path: '/profil',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'PROFIL',
      component: () => import('@/features/nounus/components/ProfileRouter.vue'),
    },
  ],
};

export const _ProfilRoutes: RouteRecordRaw = {
  path: '/profil/:id',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'PROFIL_PARENT',
      component: () => import('@/features/nounus/pages/NounuProfileViewPage.vue'),
    },
  ],
};
