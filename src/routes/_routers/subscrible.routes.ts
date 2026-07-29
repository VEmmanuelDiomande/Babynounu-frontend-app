import { RouteRecordRaw } from 'vue-router';

export const SubscribleRoutes: RouteRecordRaw = {
  path: '/subscription',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'PackSubscrible',
      component: () => import('@/features/nounus/pages/SubscriptionRequiredPage.vue'),
    },
    {
      path: 'my',
      name: 'MySubscription',
      component: () => import('@/features/subscriptions/pages/MySubscriptionPage.vue'),
    },
  ],
};

export const PaymentReturnRoutes: RouteRecordRaw = {
  path: '/payment',
  children: [
    {
      path: 'return',
      name: 'PAYMENT_RETURN',
      component: () => import('@/features/nounus/pages/PaymentReturnPage.vue'),
    },
  ],
};
