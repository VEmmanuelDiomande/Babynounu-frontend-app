// import BasicPage from "@/views/BasicPage.vue";
import BasicPage from "@/views/BasicPage.vue";
import DetailPropositionProfil from "@/views/profil/detailPropositionProfil.vue";
import ParentProfilDetailPage from "@/views/profil/parents/parentProfilDetailPage.vue";
import ParentProfilPage from "@/views/profil/parents/parentProfilPage.vue";
import ProfilDetailPage from "@/views/profil/profilDetailPage.vue";
import ProfilGalleryPage from "@/views/profil/profilGalleryPage.vue";
import Profils from "@/views/profil/profilPage.vue";
import TabsPage from "@/views/TabsPage.vue";

export const ProfilRoutes = {
  path: "/profil",
  component: TabsPage,

  children: [
    {
      path: "nounu",
      meta: {
        requiresAuth: false,
        title: `profil`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "PROFIL",
      component: Profils,
    },
    {
      path: "parent",
      meta: {
        requiresAuth: false,
        title: `profil`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "PROFIL_PARENT",
      component: ParentProfilPage,
    },

    
  ],
};

export const ProfilParentRoutes = {
  path: "/profil",
  redirect: "/profil",
  component: TabsPage,

  children: [
 
    {
      path: "parent",
      meta: {
        requiresAuth: false,
        title: `profil`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "PROFIL_PARENT",
      component: ParentProfilPage,
    },

    
  ],
};

export const _ProfilRoutes = {
  path: "/profil",
  component: BasicPage,

  children: [
    {
      path: ":id",
      meta: {
        requiresAuth: false,
        title: `profil`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "PROFIL_DETAIL",
      component: ProfilDetailPage,
    },
    {
      path: "detail/:id",
      meta: {
        requiresAuth: false,
        title: `profil`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "DetailPropositionProfil",
      component: DetailPropositionProfil,
    },
    {
      path: "detail/parent/:id",
      meta: {
        requiresAuth: false,
        title: `profil`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "PROFIL_DETAIL_PARENT",
      component: ParentProfilDetailPage,
    },
    {
      path: "gallery",
      meta: {
        requiresAuth: false,
        title: `profil`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "PROFIL_GALLERY",
      component: ProfilGalleryPage,
    },
  ],
};
