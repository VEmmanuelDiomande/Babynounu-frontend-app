// import BasicPage from "@/views/BasicPage.vue";
import Notifications from "@/views/notification/notificationPage.vue";
import TabsPage from "@/views/TabsPage.vue";

export const NotificationRoutes = {
  path: "/notifications",
  redirect: "/notifications",
  component: TabsPage,

  children: [
    {
      path: "",
      meta: {
        requiresAuth: false,
        title: `Notifications`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "NOTIFICATIONS",
      component: Notifications,
    },
  ],
};
