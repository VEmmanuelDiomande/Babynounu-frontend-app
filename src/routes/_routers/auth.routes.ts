import { RouteRecordRaw } from 'vue-router';

export const AuthRoutes: RouteRecordRaw = {
  path: '/auth',
  name: 'AUTH',
  component: () => import('@/layouts/AuthLayout.vue'),
  children: [
    {
      path: 'sign-in',
      name: 'AUTH_SIGN_IN',
      component: () => import('@/features/nounus/pages/SignInPage.vue'),
    },
    {
      path: 'sign-up',
      name: 'AUTH_SIGN_UP',
      component: () => import('@/features/nounus/pages/SignUpPage.vue'),
    },
    {
      path: 'forgot-password',
      name: 'AUTH_FORGOT_PASSWORD',
      component: () => import('@/features/nounus/pages/ForgotPasswordPage.vue'),
    },
  ],
};
