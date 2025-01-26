// import BasicPage from "@/views/BasicPage.vue";
import BasicPage from "@/views/BasicPage.vue";
import DestinationToStart from "@/views/destinationToStart.vue";
import HomeNounuPage from "@/views/home/homeNounuPage.vue";
import Home from "@/views/home/homePage.vue";
import StarterPage from "@/views/starterPage.vue";
import TabsPage from "@/views/TabsPage.vue";

export const HomeRoutes = {
  path: "/home",
  component: TabsPage,

  children: [
    {
      path: "",
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
    },
    {
      path: "nounu",
      meta: {
        requiresAuth: false,
        title: `Accueil`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "HOME_NOUNU",
      component: HomeNounuPage,
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
