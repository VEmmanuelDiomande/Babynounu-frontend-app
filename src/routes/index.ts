import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from "vue-router";
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
import { SubscribleRoutes } from "./_routers/subscrible.routes";
import { ContractRoutes } from "./_routers/contract.routes";

// Regrouper les routes par domaine fonctionnel
const publicRoutes: Array<RouteRecordRaw> = [
  _HomeRoutes,
  AuthRoutes,
];

const userRoutes: Array<RouteRecordRaw> = [
  HomeRoutes,
  HomeParentRoutes,
  SearchJobsRoutes,
  SearchNounusRoutes,
  ProfilParentRoutes,
  ProfilRoutes,
  _ProfilRoutes,
  JobRoutes,
];

const communicationRoutes: Array<RouteRecordRaw> = [
  ChatRoutes,
  _ChatRoutes,
  NotificationRoutes,
];

const adminRoutes: Array<RouteRecordRaw> = [
  AdminRoutes,
  _AdminRoutes,
];

const serviceRoutes: Array<RouteRecordRaw> = [
  SubscribleRoutes,
  ContractRoutes,
];

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

/**
 * Vérifie l'accès aux routes protégées
 * @param to Route de destination
 * @returns Redirection ou undefined
 */
const verifyRouteAccess = async (to: RouteLocationNormalized) => {
  const nToken = (await StorageUtils().getStore("nToken"))?.value;
  const nUser_Id = (await StorageUtils().getStore("nUser_Id"))?.value;
  const nRole = (await StorageUtils().getStore("nRole"))?.value;
  const nAdmin_Id = (await StorageUtils().getStore("nAdmin_Id"))?.value;
  const nType = (await StorageUtils().getStore("nType_Profil"))?.value;
  
  // Vérifier le type de page pour assurer la correspondance entre route et contenu
  const nPageType = (await StorageUtils().getStore("nPageType"))?.value;
  
  // Rediriger les utilisateurs authentifiés loin des pages d'authentification
  if (
    to.meta?.requiresAuth === false &&
    nToken &&
    nUser_Id &&
    to.path.includes("/auth/sign")
  ) {
    return { name: "HOME" };
  }

  // Rediriger les utilisateurs sans profil essayant d'accéder aux routes protégées
  const routesThatRequireProfil = [
    "PROFIL",
    "PROFIL_PARENT",
    "NOTIFICATIONS",
    "CHAT_MESSAGE",
  ];
  
  if (!nRole && !nUser_Id && routesThatRequireProfil.includes(to.name as string)) {
    setTimeout(() => {
      const ToRedirectAuthModal = document.getElementById("ToRedirectAuthModal");
      if (ToRedirectAuthModal) {
        ToRedirectAuthModal.click();
      }
    }, 10);
    return { name: "HOME" };
  }
  
  // Assurer la correspondance entre le type de page et la route
  if (nPageType && to.path.includes('/home/')) {
    // Si l'utilisateur est sur /home/jobs mais que nPageType est /home/nounus (ou vice versa)
    if (to.path !== nPageType) {
      console.log(`Redirection: route ${to.path} ne correspond pas au type de page ${nPageType}`);
      return { path: nPageType };
    }
  }


  if(nToken && nType && to.path.includes('/choose-destination-to-start')){
    console.log(`Redirection: route ${to.path} ne correspond pas au type de page ${nType}`);
    return { 
      name: nType === 'parent' 
        ? 'HOME' 
        : nType == 'nounu' 
          ? 'ADMIN_CHATS' 
          : 'HOME_JOBS'
    };
  }
  
  return undefined;
};

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const redirect = await verifyRouteAccess(to);
  if (redirect) {
    next(redirect);
  } else {
    next();
  }
});

export default router;
