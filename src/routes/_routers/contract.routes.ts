import BasicPage from "@/views/BasicPage.vue";
import ContractPage from "@/views/contracts/contractPage.vue";
import ContractDetailPage from "@/views/contracts/contractDetailPage.vue";

export const ContractRoutes = {
  path: "/contract",
  redirect: "/contract",
  component: BasicPage,

  children: [
   
    {
      path: "",
      meta: {
        requiresAuth: false,
        title: `Contract`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "CONTRACT",
      component: ContractPage,
    },
    {
      path: ":id",
      meta: {
        requiresAuth: false,
        title: `Detail Contract`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "DETAIL_CONTRACT",
      component: ContractDetailPage,
    },

  ],
};


