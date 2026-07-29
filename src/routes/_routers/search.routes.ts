import { RouteRecordRaw } from 'vue-router';

export const SearchNounusRoutes: RouteRecordRaw = {
  path: '/search-nounus',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'SEARCH_NOUNUS',
      component: () => import('@/features/nounus/pages/SearchPage.vue'),
    },
  ],
};

export const SearchJobsRoutes: RouteRecordRaw = {
  path: '/search-jobs',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'SEARCH_JOBS',
      component: () => import('@/features/nounus/pages/SearchPage.vue'),
    },
  ],
};
