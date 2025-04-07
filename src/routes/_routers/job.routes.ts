// import BasicPage from "@/views/BasicPage.vue";
import Job from "@/views/job/jobPage.vue";
import JobCreate from "@/views/job/jobCreatePage.vue";
import JobDetail from "@/views/job/jobDetailPage.vue";
import TabsPage from "@/views/TabsPage.vue";
import BasicPage from "@/views/BasicPage.vue";

export const JobRoutes = {
  path: "/job",
  redirect: "/job",
  component: BasicPage,

  children: [
    {
      path: "",
      meta: {
        requiresAuth: false,
        title: `Job`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "JOB",
      component: Job,
    },
    {
        path: "create",
        meta: {
          requiresAuth: false,
          title: `Job Create`,
          description: "",
          "og:title": ``,
          "og:description": "",
          keywords: `reseau social`,
        },
        name: "JOB_CREATE",
        component: JobCreate,
      },
    {
      path: ":id",
      meta: {
        requiresAuth: false,
        title: `Detail Job`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "JOB_DETAIL",
      component: JobDetail,
    },
  ],
};


