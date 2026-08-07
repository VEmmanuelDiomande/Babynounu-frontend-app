import { apiAuthRoutes } from "@/routes/_requests/auth.request";
import { apiUserRoutes } from "./user.request";
import { apiSettingRoutes } from "./setting.request";
import { apiNounuRoutes } from "./nounu.request";
import { apiParentRoutes } from "./parent.request";
import { apiNotificationRoutes } from "./notification.request";
import { apiAbonnementRoutes } from "./abonnement.request";
import { apiJobRoutes } from "./job.request";
import { apiJobApplicationRoutes } from "./job_application.request";
import { apiMessageRoutes } from "./message.request";
import { apiMediaRoutes } from "./media.request";
import { apiContractRoutes } from "./contract.request";
import { apiAdminRoutes } from "./admin.request";
import { apiProfilRoutes } from "./profil.request";
import { apiReviewRoutes } from "./review.request";
import { apiLikeRoutes } from "./like.request";

// Configuration de l'environnement
const MODE_APP_ENV = import.meta.env.VITE_MODE_APP || "prod";
export const MODE_APP: string = MODE_APP_ENV;

// Fonction pour déterminer la valeur en fonction du mode
const MODE_APP_DEFINED = <T>(developpement: T, production: T): T => {
  return MODE_APP === "prod" ? production : developpement;
};

// Override optionnel de l'URL du backend via VITE_API_BASE_URL
// (utile pour pointer vers l'IP locale du PC depuis un device/emulateur Android)
const API_BASE_URL_OVERRIDE = import.meta.env.VITE_API_BASE_URL as
  | string
  | undefined;

// Domaines de base
const API_DOMAIN_DEV = "http://localhost";
const API_DOMAIN_PROD = "https://baby.djoumaf.net";
const MAIN_DOMAIN_DEV = "http://localhost:5173";
const MAIN_DOMAIN_PROD = "https://babynounu.com";
const PROVIDER_DOMAIN = "https://baby-provider.djoumaf.net";

// URLs de base
export const URL_PROVIDER_APP = PROVIDER_DOMAIN;

const BASE_URL = MODE_APP_DEFINED(API_DOMAIN_DEV, `${API_DOMAIN_PROD}`);

export const BASE_URL_CENTER =
  API_BASE_URL_OVERRIDE ||
  MODE_APP_DEFINED(`${BASE_URL}:3000`, API_DOMAIN_PROD);

export const HOST_URL = MODE_APP_DEFINED(MAIN_DOMAIN_DEV, MAIN_DOMAIN_PROD);

export const REDIRECT_PAYMENT_URL = MODE_APP_DEFINED(
  `${API_DOMAIN_DEV}:8084`,
  PROVIDER_DOMAIN
);

// Fusion des routes API
type URL_API_ROUTE = typeof apiAuthRoutes &
  typeof apiUserRoutes &
  typeof apiSettingRoutes &
  typeof apiNounuRoutes &
  typeof apiParentRoutes &
  typeof apiNotificationRoutes &
  typeof apiAbonnementRoutes &
  typeof apiJobRoutes &
  typeof apiJobApplicationRoutes &
  typeof apiMessageRoutes &
  typeof apiMediaRoutes &
  typeof apiContractRoutes &
  typeof apiAdminRoutes &
  typeof apiProfilRoutes &
  typeof apiReviewRoutes &
  typeof apiLikeRoutes;

// Regroupement des routes API dans un tableau
const apiRoutesArray = [
  apiAuthRoutes,
  apiUserRoutes,
  apiSettingRoutes,
  apiNounuRoutes,
  apiParentRoutes,
  apiNotificationRoutes,
  apiAbonnementRoutes,
  apiJobRoutes,
  apiJobApplicationRoutes,
  apiMessageRoutes,
  apiMediaRoutes,
  apiContractRoutes,
  apiAdminRoutes,
  apiProfilRoutes,
  apiReviewRoutes,
  apiLikeRoutes,
];

// Fusion des routes en un seul objet
const URL_API: URL_API_ROUTE = apiRoutesArray.reduce(
  (acc, routes) => ({ ...acc, ...routes }),
  {}
) as URL_API_ROUTE;

// Génération des routes complètes
const getApiRoutes = (): URL_API_ROUTE => {
  return Object.fromEntries(
    Object.entries(URL_API).map(([key, value]) => [
      key,
      BASE_URL_CENTER + value,
    ])
  ) as URL_API_ROUTE;
};

export const URL_API_ROUTE: URL_API_ROUTE = getApiRoutes();
