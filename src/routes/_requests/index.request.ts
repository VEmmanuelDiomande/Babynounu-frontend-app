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

// Configuration de l'environnement
export const MODE_APP: string = import.meta.env.PROD ? "prod" : "dev";

// Fonction pour déterminer la valeur en fonction du mode
const MODE_APP_DEFINED = <T>(developpement: T, production: T): T => {
  return MODE_APP === "dev" ? production : developpement;
};

// Domaines de base
const API_DOMAIN_DEV = 'http://192.168.50.155';
const API_DOMAIN_PROD = 'https://api.babynounu.com';
const MAIN_DOMAIN_DEV = 'http://localhost:5173';
const MAIN_DOMAIN_PROD = 'https://babynounu.com';
const PROVIDER_DOMAIN = 'https://provider.babynounu.com';

// URLs de base
export const URL_PROVIDER_APP = PROVIDER_DOMAIN;

const BASE_URL = MODE_APP_DEFINED(
  API_DOMAIN_DEV,
  `${API_DOMAIN_PROD}/api`
);

export const BASE_URL_CENTER = MODE_APP_DEFINED(
  `${BASE_URL}:3000`,
  API_DOMAIN_PROD
);

export const HOST_URL = MODE_APP_DEFINED(
  MAIN_DOMAIN_DEV,
  MAIN_DOMAIN_PROD
);

export const REDIRECT_PAYMENT_URL = MODE_APP_DEFINED(
  `${API_DOMAIN_DEV}:8081`,
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
  typeof apiContractRoutes;

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
  apiContractRoutes
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