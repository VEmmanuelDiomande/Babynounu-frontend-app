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
        description: "Découvrez les meilleures nounous disponibles pour vos enfants",
        "og:title": `Baby Nounu - Accueil`,
        "og:description": "Découvrez les meilleures nounous disponibles pour vos enfants",
        keywords: `reseau social, nounou, garde d'enfants, baby-sitting`,
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
        description: "Trouvez des offres d'emploi pour la garde d'enfants",
        "og:title": `Baby Nounu - Offres d'emploi`,
        "og:description": "Trouvez des offres d'emploi pour la garde d'enfants",
        keywords: `reseau social, emploi, garde d'enfants, nounou`,
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
        description: "Bienvenue sur Baby Nounu, votre plateforme de garde d'enfants",
        "og:title": `Baby Nounu - Bienvenue`,
        "og:description": "Votre plateforme de mise en relation pour la garde d'enfants",
        keywords: `reseau social, nounou, garde d'enfants, baby-sitting`,
      },
      name: "STARTER",
      component: StarterPage,
    },
    {
      path: "choose-destination-to-start",
      meta: {
        requiresAuth: false,
        title: `Choisir votre destination`,
        description: "Sélectionnez votre profil pour commencer sur Baby Nounu",
        "og:title": `Baby Nounu - Choisir votre profil`,
        "og:description": "Êtes-vous un parent ou une nounou ? Sélectionnez votre profil pour commencer",
        keywords: `reseau social, nounou, parent, inscription, profil`,
      },
      name: "STARTER_DESTINATION",
      component: DestinationToStart,
    },
  ],
};
