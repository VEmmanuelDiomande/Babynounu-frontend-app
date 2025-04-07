import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import {
  _HomeRoutes,
  HomeParentRoutes,
  HomeRoutes,
} from "@/routes/_routers/home.routes";
import { AuthRoutes } from "./_routers/auth.routes";
import { _ChatRoutes, ChatRoutes } from "./_routers/messagerie.routes";
import { NotificationRoutes } from "./_routers/notification.routes";
import {
  _ProfilRoutes,
  ProfilParentRoutes,
  ProfilRoutes,
} from "./_routers/profil.routes";
import { SearchJobsRoutes, SearchNounusRoutes } from "./_routers/search.routes";
import { StorageUtils } from "@/utils/store.utils";
import { JobRoutes } from "./_routers/job.routes";
import { _AdminRoutes, AdminRoutes } from "./_routers/admin.routes";

const routes: Array<RouteRecordRaw> = [
  HomeRoutes,
  _HomeRoutes,
  AuthRoutes,
  SearchJobsRoutes,
  SearchNounusRoutes,
  ProfilParentRoutes,
  ChatRoutes,
  _ChatRoutes,
  NotificationRoutes,
  ProfilRoutes,
  _ProfilRoutes,
  JobRoutes,
  HomeParentRoutes,
  AdminRoutes,
  _AdminRoutes
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const verifyRouteAccess = async (to: any) => {
  const [nToken, nProfil_1_Id, nAdmin_Id] = await Promise.all([
    StorageUtils().getStore("nToken"),
    StorageUtils().getStore("nProfil_1_Id"),
    StorageUtils().getStore("nTokenAgency"),
    StorageUtils().getStore("nUser_Id"),
    StorageUtils().getStore("nAdmin_Id"),
  ]);
  

  // Redirect authenticated users away from the auth pages
  if (
    to.meta?.requiresAuth === false &&
    nToken?.value &&
    (nProfil_1_Id?.value || nAdmin_Id?.value) &&
    to.path.includes("/auth/sign")
  ) {
    return { name: "HOME" }; // Redirect to home if already authenticated
  }

 

  // Redirect users with no profile ID trying to access profile-related routes
  const routesThatRequireProfil = [
    "PROFIL",
    "PROFIL_PARENT",
    "NOTIFICATIONS",
    "CHAT_MESSAGE",
  ];
  if (!nProfil_1_Id?.value && nAdmin_Id?.value && routesThatRequireProfil.includes(to.name)) {
    return { name: "SignAuth" }; // Redirect to sign-in page
  }

  const routesThatRequireAdmin = ["AdminChats"];
  if (!nAdmin_Id?.value && nProfil_1_Id?.value && routesThatRequireAdmin.includes(to.name)) {
    return { name: "SignAuth" }; // Redirect to sign-in page
  } 
};

router.beforeEach(async (to, from, next) => {
  const redirect = await verifyRouteAccess(to);
  if (redirect) {
    next(redirect);
  } else {
    next();
  }
});

export default router;
