import { RouteRecordRaw } from 'vue-router';

export const ProfileSetupRoutes: RouteRecordRaw = {
  path: '/profile-setup',
  name: 'PROFILE_SETUP',
  component: () => import('@/layouts/ProfileSetupRouteLayout.vue'),
  children: [
    {
      path: 'nounu',
      name: 'AUTH_PROFILE_NOUNU',
      component: () => import('@/features/nounus/pages/NounuProfilePage.vue'),
    },
    {
      path: 'parent',
      name: 'AUTH_PROFILE_PARENT',
      component: () => import('@/features/nounus/pages/ParentProfilePage.vue'),
    },
  ],
};
