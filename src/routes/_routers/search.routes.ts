// import BasicPage from "@/views/BasicPage.vue";
import SearchNounuPage from "@/views/search/searchNounuPage.vue";
import Search from "@/views/search/searchPage.vue";
import TabsPage from "@/views/TabsPage.vue";

export const SearchRoutes = {
  path: "/search",
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
      name: "SEARCH",
      component: Search,
    },
    {
      path: "nounu",
      meta: {
        requiresAuth: false,
        title: `Search`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "SEARCH_NOUNU_PAGE",
      component: SearchNounuPage,
    },
  ],
};
