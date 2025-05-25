import BasicPage from "@/views/BasicPage.vue";
import TabAdminPage from "@/views/TabAdminPage.vue";
import ChatAdmin from "@/views/admin/chat.admin.vue";
import ChatDetailAdmin from "@/views/admin/chatDetail.admin.vue";
import AgencyAuth from "@/views/auth/agencyAuth.vue";
import DeliveryAuth from "@/views/auth/deliveryAuth.vue";
import SginInAuth from "@/views/auth/signInAuth.vue";
import SignAuth from "@/views/auth/signAuth.vue";
import SignUpAuth from "@/views/auth/signUpAuth.vue";

export const AdminRoutes = {
  path: "/admin",
  redirect: "/admin/chats",
  component: TabAdminPage,

  children: [
    {
      path: "chats",
      meta: {
        requiresAuth: false,
        title: `Se connecter`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "AdminChats",
      component: ChatAdmin,
    },
    {
      path: "checked",
      meta: {
        requiresAuth: false,
        title: `Se connecter`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "AdminChecked",
      component: () => import("@/views/admin/checked.admin.vue"),
    },

    {
      path: "users",
      meta: {
        requiresAuth: false,
        title: `Gestion des utilisateurs`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "AdminUsers",
      component: () => import("@/views/admin/user.admin.vue"),
    },

    {
      path: "contracts",
      meta: {
        requiresAuth: false,
        title: `Contracts`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "AdminContracts",
      component: () => import("@/views/admin/contract.admin.vue"),
    },
  ],
};

export const _AdminRoutes = {
  path: "/admin/detail",
  component: BasicPage,

  children: [
    {
      path: "chat/:id",
      meta: {
        requiresAuth: false,
        title: `Detail Chat`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "AdminChatDetail",
      component: ChatDetailAdmin,
    },
    {
      path: "media/:id",
      meta: {
        requiresAuth: false,
        title: `Detail Media`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "AdminMediaDetail",
      component: () => import("@/views/admin/_details/detailMedia.admin.vue"),
    },
  ],
};
