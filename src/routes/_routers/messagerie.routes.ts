import { RouteRecordRaw } from 'vue-router';

export const ChatRoutes: RouteRecordRaw = {
  path: '/chats',
  component: () => import('@/layouts/ChatLayout.vue'),
  children: [
    {
      path: '',
      name: 'CHAT_MESSAGE',
      component: () => import('@/features/nounus/pages/ChatListPage.vue'),
    },
    {
      path: ':id',
      name: 'CHAT_MESSAGE_DETAIL',
      component: () => import('@/features/nounus/pages/ChatDetailPage.vue'),
    },
  ],
};
