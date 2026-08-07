import { RouteRecordRaw } from 'vue-router';

export const StarterFlowRoutes: RouteRecordRaw = {
  path: '/',
  component: () => import('@/layouts/StarterLayout.vue'),
  children: [
    {
      path: '',
      redirect: '/starter',
    },
    {
      path: 'starter',
      name: 'STARTER',
      component: () => import('@/features/nounus/pages/StarterPage.vue'),
    },
    {
      path: 'choose-destination-to-start',
      name: 'STARTER_DESTINATION',
      component: () => import('@/features/nounus/pages/ChooseDestinationPage.vue'),
    },
  ],
};

export const HomeRoutes: RouteRecordRaw = {
  path: '/home/jobs',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'HOME_JOBS',
      component: () => import('@/features/nounus/pages/JobsPage.vue'),
    },
  ],
};

export const HomeParentRoutes: RouteRecordRaw = {
  path: '/home/nounus',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'HOME',
      component: () => import('@/features/nounus/pages/HomePage.vue'),
    },
  ],
};
