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
export const MODE_APP: string = "prod";

// Fonction pour déterminer la valeur en fonction du mode
const MODE_APP_DEFINED = (Developpement: string, Production: string): string => {
  return MODE_APP === "prod" ? Production : Developpement;
};

// URLs de base
const URL = "http://localhost";
export const URL_PROVIDER_APP = "https://provider.babynounu.com";

const BASE_URL = MODE_APP_DEFINED(
   'http://192.168.243.166',
  'https://api.babynounu.com/api'
);

export const BASE_URL_CENTER = MODE_APP_DEFINED(
  BASE_URL + ":3000",
  "https://api.babynounu.com"
);

export const HOST_URL = MODE_APP_DEFINED(
  "http://localhost:5173",
  "https://babynounu.com"
);

export const REDIRECT_PAYMENT_URL = MODE_APP_DEFINED(
  "http://localhost:8081",
  "https://provider.babynounu.com"
);

// Fusion des routes API
type URL_API_ROUTE = typeof apiAuthRoutes &
  typeof apiUserRoutes &
  typeof apiSettingRoutes &
  typeof apiNounuRoutes &
  typeof apiParentRoutes &
  typeof apiNotificationRoutes &
  typeof apiAbonnementRoutes & typeof apiJobRoutes
  & typeof apiJobApplicationRoutes & typeof apiMessageRoutes & typeof apiMediaRoutes & typeof apiContractRoutes;

let URL_API: Partial<URL_API_ROUTE> = {};

URL_API = {
  ...URL_API,
  ...apiAuthRoutes,
  ...apiUserRoutes,
  ...apiSettingRoutes,
  ...apiNounuRoutes,
  ...apiParentRoutes,
  ...apiNotificationRoutes,
  ...apiAbonnementRoutes,
  ...apiJobRoutes,
  ...apiJobApplicationRoutes,
  ...apiMessageRoutes,
  ...apiMediaRoutes,
  ...apiContractRoutes

};

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