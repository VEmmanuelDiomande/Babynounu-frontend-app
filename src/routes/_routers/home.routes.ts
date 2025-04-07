// import BasicPage from "@/views/BasicPage.vue";
import BasicPage from "@/views/BasicPage.vue";
import DestinationToStart from "@/views/destinationToStart.vue";
import HomeParentPage from "@/views/home/homeParentPage.vue";
import Home from "@/views/home/homePage.vue";
import StarterPage from "@/views/starterPage.vue";
import TabsPage from "@/views/TabsPage.vue";

export const HomeRoutes = {
  path: "/home",
  component: TabsPage,

  children: [
    {
      path: "nounus",
      meta: {
        requiresAuth: false,
        title: `Accueil`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "HOME",
      component: Home,
    }
  ],
};


export const HomeParentRoutes = {
  path: "/home",
  component: TabsPage,

  children: [
    {
      path: "jobs",
      meta: {
        requiresAuth: false,
        title: `Accueil`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "HOME_JOBS",
      component: HomeParentPage,
    }
  ],
};


export const _HomeRoutes = {
  path: "/",
  redirect: "/starter",
  component: BasicPage,

  children: [
    {
      path: "starter",
      meta: {
        requiresAuth: false,
        title: `Accueil`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "STARTER",
      component: StarterPage,
    },
    {
      path: "choose-destination-to-start",
      meta: {
        requiresAuth: false,
        title: `Accueil`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "STARTER_DESTINATION",
      component: DestinationToStart,
    },
  ],
};
