// import BasicPage from "@/views/BasicPage.vue";
import chatMessage from "@/views/messagerie/messageriePage.vue";
import chatMessageDetail from "@/views/messagerie/messagerieDetailPage.vue";
import TabsPage from "@/views/TabsPage.vue";
import BasicPage from "@/views/BasicPage.vue";

export const ChatRoutes = {
  path: "/chat",
  redirect: "/chat",
  component: TabsPage,

  children: [
    {
      path: "",
      meta: {
        requiresAuth: false,
        title: `Messagerie`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "CHAT_MESSAGE",
      component: chatMessage,
    },
    {
      path: ":id",
      meta: {
        requiresAuth: false,
        title: `Detail Messagerie`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "CHAT_MESSAGE_DETAIL",
      component: chatMessageDetail,
    },
  ],
};

export const _ChatRoutes = {
  path: "/chat",
  redirect: "/chat",
  component: BasicPage,

  children: [
    {
      path: ":id",
      meta: {
        requiresAuth: false,
        title: `Detail Messagerie`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "CHAT_MESSAGE_DETAIL",
      component: chatMessageDetail,
    },
  ],
};
