import { RouteRecordRaw } from 'vue-router';

export const ChatRoutes: RouteRecordRaw = {
  path: '/chats',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'CHAT_MESSAGE',
      component: () => import('@/features/nounus/pages/ChatListPage.vue'),
    },
  ],
};

export const _ChatRoutes: RouteRecordRaw = {
  path: '/chats/:id',
  component: () => import('@/layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'CHAT_MESSAGE_DETAIL',
      component: () => import('@/features/nounus/pages/ChatDetailPage.vue'),
    },
  ],
};
