// import BasicPage from "@/views/BasicPage.vue";
import Subscrible from "@/views/subscribles/subscriblePage.vue";
import BasicPage from "@/views/BasicPage.vue";
import PackSubscriblePage from "@/views/subscribles/packSubscriblePage.vue";

export const SubscribleRoutes = {
  path: "/subscrible",
  redirect: "/subscrible",
  component: BasicPage,

  children: [
    {
      path: "",
      meta: {
        requiresAuth: false,
        title: `Subscrible`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "MySubscrible",
      component: Subscrible,
    },
    {
      path: "pack",
      meta: {
        requiresAuth: false,
        title: `Subscrible`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "PackSubscrible",
      component: PackSubscriblePage,
    },
  ],
};


