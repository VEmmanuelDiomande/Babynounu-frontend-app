import { apiAuthRoutes } from "@/routes/_requests/auth.request";
import { apiUserRoutes } from "./user.request";
import { apiSettingRoutes } from "./setting.request";
import { apiNounuRoutes } from "./nounu.request";
import { apiParentRoutes } from "./parent.request";
import { apiNotificationRoutes } from "./notification.request";

export const MODE_APP:string = "prod";
const MODE_APP_DEFINED = (Developpement: string, Production: string) => {
  return MODE_APP === "prod" ? Production : Developpement;
};
const URL = "http://localhost";
const BASE_URL = MODE_APP_DEFINED(
   'http://192.168.1.113',
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

let URL_API: Partial<URL_API_ROUTE> = {};

URL_API = {
  ...URL_API,
  ...apiAuthRoutes,
  ...apiUserRoutes,
  ...apiSettingRoutes,
  ...apiNounuRoutes,
  ...apiParentRoutes,
  ...apiNotificationRoutes
};

const getApiRoutes = () => {
  return Object.fromEntries(
    Object.entries(URL_API).map(([key, value]) => [
      key,
      BASE_URL_CENTER + value,
    ])
  );
};

type URL_API_ROUTE = typeof apiAuthRoutes &
  typeof apiUserRoutes & typeof apiNounuRoutes & typeof apiParentRoutes &
  typeof apiSettingRoutes & typeof apiNotificationRoutes;
export const URL_API_ROUTE: URL_API_ROUTE = getApiRoutes() as URL_API_ROUTE;
