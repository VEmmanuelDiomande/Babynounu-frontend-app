import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";

import { IonicVue } from "@ionic/vue";

// Importation des fichiers CSS globaux
import "./assets/css/style.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import { createPinia } from "pinia";

// Importation et configuration de PrimeVue
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

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
import { SocketService } from "./services/socket.services";
import { useNotificationStore } from "./stores/notificationStore";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

const socketService = new SocketService();

// Initialisation de dayjs avec la locale et le plugin
dayjs.extend(relativeTime);
dayjs.locale("fr");

// Création d'une instance QueryClient
const queryClient = new QueryClient();

// Création de l'application Vue
const app = createApp(App)
  .use(createPinia()) // Gestion des états avec Pinia
  .use(IonicVue) // Framework Ionic
  .use(router) // Configuration du routeur
  .use(PrimeVue, {
    theme: {
      preset: Aura, // Thème PrimeVue
      options: {
        darkModeSelector: ".my-app-dark", // Sélecteur pour activer le mode sombre
      },
    },
  })
  .use(VueLazyLoad, {
    loading: "/images/placeholders/placeholder.jpg", // Image de chargement
    error: "/images/placeholders/placeholder.jpg", // Image en cas d'erreur
  })
  .use(VueQueryPlugin, { queryClient }); // Vue Query pour les requêtes côté client

// Attente de la disponibilité du routeur avant le montage
router.isReady().then(async() => {
  app.mount("#app");
  authentificateApp(); // Appel de la fonction d'authentification après le montage
  // await useNotificationStore().NCountChats();
  // await useNotificationStore().NCountNotification();
});
