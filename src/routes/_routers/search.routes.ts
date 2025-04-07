// import BasicPage from "@/views/BasicPage.vue";
import SearchJobsPage from "@/views/search/searchJobsPage.vue";
import Search from "@/views/search/searchPage.vue";
import TabsPage from "@/views/TabsPage.vue";
import TabsParentPage from "@/views/TabAdminPage.vue";

export const SearchJobsRoutes = {
  path: "/search/jobs",
  component: TabsPage,

  children: [
    {
      path: "",
      meta: {
        requiresAuth: false,
        title: `Search`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "SEARCH_JOBS",
      component: SearchJobsPage,
    },
  ],
};

export const SearchNounusRoutes = {
  path: "/search/nounus",
  component: TabsPage,

  children: [
    {
      path: "",
      meta: {
        requiresAuth: false,
        title: `Search`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "SEARCH_NOUNU_PAGE",
      component:  Search,
    },
  ],
};
