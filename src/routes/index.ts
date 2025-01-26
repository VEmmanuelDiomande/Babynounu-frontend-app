import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { _HomeRoutes, HomeRoutes } from "@/routes/_routers/home.routes";
import { AuthRoutes } from "./_routers/auth.routes";
import { _ChatRoutes, ChatRoutes } from "./_routers/messagerie.routes";
import { NotificationRoutes } from "./_routers/notification.routes";
import { _ProfilRoutes, ProfilRoutes } from "./_routers/profil.routes";
import { SearchRoutes } from "./_routers/search.routes";
import { StorageUtils } from "@/utils/store.utils";

const routes: Array<RouteRecordRaw> = [
  HomeRoutes,
  _HomeRoutes,
  AuthRoutes,
  SearchRoutes,
  ChatRoutes,
  _ChatRoutes,
  NotificationRoutes,
  ProfilRoutes,
  _ProfilRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const verifyRouteAccess = async (to: any) => {
  const [nToken, nProfil_1_Id, nTokenAgency] = await Promise.all([
    StorageUtils().getStore("nToken"),
    StorageUtils().getStore("nProfil_1_Id"),
    StorageUtils().getStore("nTokenAgency"),
  ]);

  // Redirect authenticated users away from the auth pages
  if (to.meta?.requiresAuth === false && nToken?.value && nProfil_1_Id?.value && to.path.includes("/auth/sign")) {
    return { name: "HOME" }; // Redirect to home if already authenticated
  }

  // Redirect users with no profile ID trying to access profile-related routes
  const routesThatRequireProfil = ["PROFIL", "NOTIFICATIONS", "CHAT_MESSAGE"];
  if (!nProfil_1_Id?.value && routesThatRequireProfil.includes(to.name)) {
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
