import { RouteRecordRaw } from 'vue-router';

export const JobRoutes: RouteRecordRaw = {
  path: '/jobs',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'JOBS',
      component: () => import('@/features/nounus/pages/JobsPage.vue'),
    },
    {
      path: 'my-jobs',
      name: 'MY_JOBS',
      component: () => import('@/features/nounus/pages/MyJobsPage.vue'),
    },
    {
      path: 'create',
      name: 'CREATE_JOB',
      component: () => import('@/features/nounus/pages/CreateJobPage.vue'),
    },
    {
      path: ':id',
      name: 'JOB_DETAIL',
      component: () => import('@/features/nounus/pages/JobDetailPage.vue'),
    },
  ],
};
