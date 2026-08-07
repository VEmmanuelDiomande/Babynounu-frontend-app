import { createRouter, createWebHistory } from "vue-router";
import {
  RouteRecordRaw,
  RouteLocationNormalized,
} from "vue-router";
import {
  StarterFlowRoutes,
  HomeParentRoutes,
  HomeRoutes,
} from "@/routes/_routers/home.routes";
import { AuthRoutes } from "./_routers/auth.routes";
import { ProfileSetupRoutes } from "./_routers/profile-setup.routes";
import { _ChatRoutes, ChatRoutes } from "./_routers/messagerie.routes";
import { NotificationRoutes } from "./_routers/notification.routes";
import {
  _ProfilRoutes,
  ProfilRoutes,
} from "./_routers/profil.routes";
import { SearchJobsRoutes, SearchNounusRoutes } from "./_routers/search.routes";
import { StorageUtils } from "@/utils/store.utils";
import { JobRoutes } from "./_routers/job.routes";
import { _AdminRoutes, AdminRoutes } from "./_routers/admin.routes";
import { SubscribleRoutes, PaymentReturnRoutes } from "./_routers/subscrible.routes";
import { ContractRoutes } from "./_routers/contract.routes";
import { PrestationsRoutes } from "./_routers/prestations.routes";
import { SettingRoutes } from "./_routers/setting.routes";
import { setupKeepScroll } from "@/composables/useKeepScroll";

// Regrouper les routes par domaine fonctionnel
const publicRoutes: Array<RouteRecordRaw> = [StarterFlowRoutes, AuthRoutes, ProfileSetupRoutes];

const userRoutes: Array<RouteRecordRaw> = [
  HomeRoutes,
  HomeParentRoutes,
  SearchJobsRoutes,
  SearchNounusRoutes,
  ProfilRoutes,
  _ProfilRoutes,
  JobRoutes,
  SettingRoutes,
];

const communicationRoutes: Array<RouteRecordRaw> = [
  ChatRoutes,
  _ChatRoutes,
  NotificationRoutes,
];

const adminRoutes: Array<RouteRecordRaw> = [AdminRoutes, _AdminRoutes];

const serviceRoutes: Array<RouteRecordRaw> = [SubscribleRoutes, PaymentReturnRoutes, ContractRoutes, PrestationsRoutes];

// Combiner toutes les routes
const routes: Array<RouteRecordRaw> = [
  ...publicRoutes,
  ...userRoutes,
  ...communicationRoutes,
  ...adminRoutes,
  ...serviceRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Définir les routes qui nécessitent un abonnement
const routesThatRequireSubcrible = [
  "CHAT_MESSAGE_DETAIL",
  "CHAT_MESSAGE",
  "NOTIFICATIONS",
  "PROFIL_PARENT",
];

// Définir les routes qui nécessitent un profil
const routesThatRequireProfil = [
  "PROFIL",
  "PROFIL_PARENT",
  "SETTINGS_PROFILE",
  "SETTINGS",
  "PROFIL_DOCUMENT",
  "JOBS",
  "CREATE_JOB",
  "SEARCH_NOUNUS",
  "SEARCH_JOBS",
  "PRESTATIONS",
];

const verifyRouteAccess = async (to: RouteLocationNormalized) => {
  const nToken = (await StorageUtils().getStore("nToken")).value;
  const nPageType = (await StorageUtils().getStore("nPageType")).value;
  const nType = (await StorageUtils().getStore("nType_Profil")).value;
  const nIsAbonnement = (await StorageUtils().getStore("nIsAbonnement")).value;
  const nProfil_1_Id = (await StorageUtils().getStore("nProfil_1_Id")).value;
  const nRole = (await StorageUtils().getStore("nRole")).value;


  // Protection des routes admin
  if (to.path.startsWith("/admin") && nRole !== "admin") {
    return { name: "AUTH_SIGN_IN" };
  }

  if (nToken && nProfil_1_Id && to.path.includes("sign")) {
    return { name: "STARTER_DESTINATION" };
  }

  // Les routes /home/* sont accessibles sans connexion
  // Si l'utilisateur est connecté mais n'a pas de profil, rediriger vers la création de profil
  if (to.path.includes("/home/")) {
    if (nToken && !nProfil_1_Id) {
      return { name: "AUTH_PROFILE_NOUNU" };
    }
  }

  // La page de création de profil nécessite d'être connecté
  // Si un profil existe déjà, rediriger vers la page d'accueil
  // Sauf si l'utilisateur est en mode édition (query param edit=true)
  if (to.path.includes("/profile-setup/")) {
    if (!nToken) {
      return { name: "AUTH_SIGN_IN" };
    }

    if (nProfil_1_Id && to.query.edit !== 'true') {
      return nPageType ? { path: nPageType } : { name: "HOME" };
    }
  }

  if (
    !nToken &&
    (routesThatRequireSubcrible.includes(to.name as string) ||
      routesThatRequireProfil.includes(to.name as string))
  ) {
    return { name: "AUTH_SIGN_IN" };
  }

  if (
    nToken &&
    nIsAbonnement !== 'true' &&
    routesThatRequireSubcrible.includes(to.name as string)
  ) {

    return { name: "PackSubscrible" };
  }

  // Assurer la correspondance entre le type de profil et la route /home/*
  if (nType && to.path.includes("/home/")) {
    const expectedPath = nType === "parent" ? "/home/nounus" : "/home/jobs";
    if (to.path !== expectedPath) {
      await StorageUtils().setStore("nPageType", expectedPath);
      return { path: expectedPath };
    }
  }

  if (nToken && nType && (to.path.includes("/choose-destination-to-start") || to.path === "/starter")) {
    return {
      name:
        nType === "parent"
          ? "HOME"
          : nType === "nounu"
          ? "HOME_JOBS"
          : "HOME_JOBS",
    };
  }

  // Protection des routes admin
  if (to.path.includes("/admin")) {
    const nAdminId = (await StorageUtils().getStore("nAdmin_Id")).value;
    if (!nToken || !nAdminId) {
      return { name: "AUTH_SIGN_IN" };
    }
  }

  return undefined;
};

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ) => {
    return await verifyRouteAccess(to);
  }
);

setupKeepScroll(router);

export default router;
