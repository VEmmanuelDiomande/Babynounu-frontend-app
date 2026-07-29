import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";

// Importation des fichiers CSS globaux
import "remixicon/fonts/remixicon.css";
import "./assets/css/style.css";

/* Theme variables */
import "./theme/variables.css";

import { createPinia } from "pinia";



// Lazy load pour des images
import VueLazyLoad from "vue3-lazyload";

// Vue Query configuration
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";

// Fonction d'authentification personnalisée
import { authentificateApp } from "./routes/authenticate/authorization.authenticate";

// Configuration de Day.js
import dayjs from "dayjs";
import "dayjs/locale/fr"; // Import de la locale française
import relativeTime from "dayjs/plugin/relativeTime";
import { StorageUtils } from "./utils/store.utils";
import { useNotificationStore } from "./stores/notificationStore";

// Initialisation de dayjs avec la locale et le plugin
dayjs.extend(relativeTime);
dayjs.locale("fr");

// Création d'une instance QueryClient
const queryClient = new QueryClient();

// Création de l'application Vue
const app = createApp(App)
  .use(createPinia()) // Gestion des états avec Pinia
  .use(router) // Configuration du routeur

  .use(VueLazyLoad, {
    loading: "/images/placeholders/placeholder.jpg", // Image de chargement
    error: "/images/placeholders/placeholder.jpg", // Image en cas d'erreur
  })
  .use(VueQueryPlugin, { queryClient }); // Vue Query pour les requêtes côté client

// Attente de la disponibilité du routeur avant le montage
router.isReady().then(async() => {
  await authentificateApp(); // Appel de la fonction d'authentification avant le montage
  app.mount("#app");

  const token = (await StorageUtils().getStore("nToken")).value;
  if (token) {
    const notificationStore = useNotificationStore();
    await notificationStore.NCountChats();
    await notificationStore.NCountNotification();
  }
});
