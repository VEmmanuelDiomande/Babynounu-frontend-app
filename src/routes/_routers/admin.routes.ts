import { RouteRecordRaw } from 'vue-router';

export const AdminRoutes: RouteRecordRaw = {
  path: '/admin',
  component: () => import('@/layouts/AdminLayout.vue'),
  children: [
    {
      path: '',
      name: 'ADMIN_DASHBOARD',
      component: () => import('@/features/admin/pages/AdminDashboardPage.vue'),
    },
    {
      path: 'users',
      name: 'ADMIN_USERS',
      component: () => import('@/features/admin/pages/AdminUsersPage.vue'),
    },
    {
      path: 'nounus',
      name: 'ADMIN_NOUNUS',
      component: () => import('@/features/admin/pages/AdminNounusPage.vue'),
    },
    {
      path: 'settings',
      name: 'ADMIN_SETTINGS',
      component: () => import('@/features/admin/pages/AdminSettingsPage.vue'),
    },
    {
      path: 'type-parameters',
      name: 'ADMIN_TYPE_PARAMETERS',
      component: () => import('@/features/admin/pages/AdminTypeParametersPage.vue'),
    },
    {
      path: 'parameters',
      name: 'ADMIN_PARAMETERS',
      component: () => import('@/features/admin/pages/AdminParametersPage.vue'),
    },
    {
      path: 'permissions',
      name: 'ADMIN_PERMISSIONS',
      component: () => import('@/features/admin/pages/AdminPermissionsPage.vue'),
    },
    {
      path: 'roles',
      name: 'ADMIN_ROLES',
      component: () => import('@/features/admin/pages/AdminRolesPage.vue'),
    },
    {
      path: 'jobs',
      name: 'ADMIN_JOBS',
      component: () => import('@/features/admin/pages/AdminJobsPage.vue'),
    },
    {
      path: 'parents',
      name: 'ADMIN_PARENTS',
      component: () => import('@/features/admin/pages/AdminParentsPage.vue'),
    },
    {
      path: 'payments',
      name: 'ADMIN_PAYMENTS',
      component: () => import('@/features/admin/pages/AdminNounuPaymentsPage.vue'),
    },
    {
      path: 'chats',
      name: 'ADMIN_CHATS',
      component: () => import('@/features/admin/pages/AdminChatsPage.vue'),
    },
    {
      path: 'chats/:id',
      name: 'ADMIN_CHAT_DETAIL',
      component: () => import('@/features/admin/pages/AdminConversationDetailPage.vue'),
    },
    {
      path: 'nounus-list',
      name: 'ADMIN_NOUNUS_LIST',
      component: () => import('@/features/admin/pages/AdminNounusListPage.vue'),
    },
    {
      path: 'users/:id',
      name: 'ADMIN_USER_DETAIL',
      component: () => import('@/features/admin/pages/AdminUserDetailPage.vue'),
    },
    {
      path: 'subscriptions',
      name: 'ADMIN_SUBSCRIPTIONS',
      component: () => import('@/features/admin/pages/AdminSubscriptionsPage.vue'),
    },
    {
      path: 'packs',
      name: 'ADMIN_PACKS',
      component: () => import('@/features/admin/pages/AdminPacksPage.vue'),
    },
    {
      path: 'notifications',
      name: 'ADMIN_NOTIFICATIONS',
      component: () => import('@/features/nounus/pages/NotificationsPage.vue'),
    },
    {
      path: 'profile',
      name: 'ADMIN_PROFILE',
      component: () => import('@/features/admin/pages/AdminProfilePage.vue'),
    },
    {
      path: 'sub-admins',
      name: 'ADMIN_SUB_ADMINS',
      component: () => import('@/features/admin/pages/AdminSubAdminsPage.vue'),
    },
  ],
};

export const _AdminRoutes: RouteRecordRaw = {
  path: '/admin/:section',
  redirect: { name: 'ADMIN_DASHBOARD' },
};
