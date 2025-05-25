<template>
  <ion-app>
    <MainSideBar />

    <!-- Boutons modaux cachés -->
    <ion-button id="open-modal-auth-profil" class="hidden" expand="block">Open</ion-button>
    <ion-button id="open-modal-filter-search" class="hidden" expand="block">Open</ion-button>
    
    <!-- Modal de création de profil -->
    <CreateProfilModal
      v-if="
        useProfilStore().state.InformationPersonnelle &&
        useProfiNounulStore().state
      "
      :StepProfil="getActiveStepProfil"
      :LessStepProfil="getActivePreviousStep"
    >
      <template v-slot:content>
        <ParentProfilAuth
          v-if="isParentProfilActive"
        />
        <NounuProfilAuth
          v-if="isNounuProfilActive"
        />
      </template>
    </CreateProfilModal>

    <ion-router-outlet id="main-content" />

    <!-- Modal d'abonnement -->
    <button id="open-modal-abonnement" class="z-50 hidden" expand="block">Open</button>
    <button class="" id="is-update-profil" value="false"></button>
    <AbonnementProfilModal />


    <!--  -->
    <ion-button id="ToRedirectAuthModal" class="hidden" @click="openModal">Ouvrir le modal Auth</ion-button>
    <ToRedirectAuthModal v-model:isOpen="isModalOpen" />
  </ion-app>
</template>

<script setup lang="ts">
// Imports Ionic
import {
  IonApp,
  IonButton,
  IonRouterOutlet,
} from "@ionic/vue";

// Imports de composants
import MainSideBar from "@/components/headers/sidebars/MainSideBar.vue";
import AbonnementProfilModal from "@/views/profil/abonnementProfilModal.vue";
import CreateProfilModal from "./views/auth/profils/createProfilModal.vue";
import ParentProfilAuth from "./views/auth/profils/parentProfilAuth.vue";
import NounuProfilAuth from "./views/auth/profils/nounuProfilAuth.vue";

// Imports de services et utilitaires
import { SocketService } from "./services/socket.services";
import { StorageUtils } from "./utils/store.utils";
import { SettingServices } from "./services/setting.services";
import { URL_API_ROUTE } from "./routes/_requests/index.request";
import axios from "axios";

// Imports de capacitor
import { StatusBar, Style } from '@capacitor/status-bar';
import { LocalNotifications, PermissionStatus } from "@capacitor/local-notifications";
import { Toast } from "@capacitor/toast";

// Imports Vue
import { computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";

// Imports de stores
import { useUserStore } from "./stores/user.store";
import { useAbonnementStore } from "./stores/abonnementStore";
import { useProfilStore } from "./stores/authProfilStore";
import { useProfiNounulStore } from "./stores/authProfilNounuStore";
import { useAuthStore } from "./stores/auth.store";
import { useNotificationStore } from "./stores/notificationStore";

// Imports de hooks
import { useUserHook } from "./hooks/userHooks/userHook";
import ToRedirectAuthModal from "./components/modals/ToRedirectAuthModal.vue";
import { ref } from "vue";
import { isPlatform } from '@ionic/vue';

// Initialisation des services
const router = useRouter();
const socketService = new SocketService();
const { userId, _USER, getUser } = useUserStore();

// Propriétés calculées pour les profils
const isParentProfilActive = computed(() => 
  useProfilStore().state.activeMenu_typeOfProfil === 'open-modal-auth-profil-parent'
);

const isNounuProfilActive = computed(() => 
  useProfilStore().state.activeMenu_typeOfProfil === 'open-modal-auth-profil-nounu'
);

const getActiveStepProfil = computed(() => 
  isParentProfilActive.value 
    ? useProfilStore().state.stepProfil 
    : useProfiNounulStore().state.StepProfil
);

const getActivePreviousStep = computed(() => 
  isParentProfilActive.value 
    ? useProfilStore().previousStep 
    : useProfiNounulStore().previousStep
);

/**
 * Vérifie le statut de l'abonnement de l'utilisateur
 */
const checkIsAbonnement = async () => {
  const userId = (await StorageUtils().getStore("nUser_Id")).value;
  const transactionId = (await StorageUtils().getStore("nTransactionId")).value;
  
  socketService.emit("checkIsAbonnement", { userId, transactionId });
};

/**
 * Vérifie le statut des points de paiement
 */
const checkPaymentPoint = async () => {
  const userId = (await StorageUtils().getStore("nUserPointsId")).value;
  const transactionId = (await StorageUtils().getStore("nTransactionPointId")).value;
  const points = (await StorageUtils().getStore("nPoints")).value;
  
  socketService.emit("checkPaymentPoint", { userId, transactionId, points });
};

/**
 * Récupère le nombre total de messages non lus
 */
const getTotalUnreadCount = async () => {
  const userId = (await StorageUtils().getStore("nUser_Id")).value;
  socketService.emit("getUnreadCounts", userId);
};

/**
 * Récupère le nombre de notifications non lues
 */
const getUnreadCountsNotification = async () => {
  const userId = (await StorageUtils().getStore("nUser_Id")).value;
  socketService.emit("getUnreadCountsNotification", { userId });
};

/**
 * Vérifie et demande les permissions pour les notifications
 */
const checkPermissionsStrict = async (): Promise<PermissionStatus> => {
  try {
    const status = await LocalNotifications.checkPermissions();
    if (status.display === "granted") {
      return status;
    }
    return await LocalNotifications.requestPermissions();
  } catch (error) {
    console.error("Échec de vérification des permissions:", error);
    return { display: "denied" };
  }
};

/**
 * Planifie une notification de bienvenue
 */
const scheduleNotification = async () => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Bienvenue !",
          body: "BabyNounu est heureux de vous accueillir !",
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) },
          sound: undefined,
          attachments: undefined,
          actionTypeId: "",
          extra: { data: "test-data" },
        },
      ],
    });
  } catch (error) {
    console.error("Erreur de notification:", error);
  }
};

/**
 * Configure l'écouteur pour les clics sur notifications
 */
const setupNotificationListener = () => {
  LocalNotifications.addListener(
    "localNotificationActionPerformed",
    (notification) => {
      const routePath = notification.notification.extra?.route;
      if (routePath) {
        router.push(routePath);
      }
    }
  );
};

/**
 * Configure tous les écouteurs d'événements socket
 */
const setupSocketListeners = () => {
  // Écouteur pour les messages non lus
  socketService.on("unreadCounts", (data) => {
    useNotificationStore().state.countMessage = data;
  });
  
  // Écouteur pour les notifications non lues
  socketService.on("unreadCountsNotification", (data) => {
    useNotificationStore().state.countNotification = data;
  });
  
  // Écouteur pour les mises à jour de messages non lus
  socketService.on("unreadUpdated", (unreadCount) => {
    useNotificationStore().state.countMessage = unreadCount;
  });
  
  // Écouteur pour les abonnements
  socketService.on("isAbonnement", async (isAbonnement) => {
    if (isAbonnement.hasActiveSubscription) {
      useAbonnementStore().isAbonnement = true;
      await Toast.show({
        text: "Votre abonnement a été renouvelé. Merci !",
      });
    }
  });
};

/**
 * Gère l'ouverture du modal d'authentification
 */
const isModalOpen = ref(false);
const openModal = () => {
  isModalOpen.value = true;
};

onMounted(async () => {
  // Configuration des écouteurs socket
  setupSocketListeners();
  
  // Initialisation de l'utilisateur
  await _USER();
  await getUser();
  await useAuthStore().getRole();

  // Initialisation des messageries
  await getTotalUnreadCount();
  
  // Initialisation des notifications
  await getUnreadCountsNotification();
  setupNotificationListener();
  await checkPermissionsStrict();
  await scheduleNotification();

  // Vérification des abonnements
  await checkIsAbonnement();
  await checkPaymentPoint();
  useAbonnementStore().isAdminLogged();

  // Stockage de l'état de mise à jour du profil
  await StorageUtils().setStore(
    "nisUpdateProfil",
    useAuthStore().isUpdateProfil
  );

  // Vérification de l'état de connexion
  useUserHook().isUserLogged();
  useUserHook().isAdminLogged();

  // Configuration de la barre de statut
  // await StatusBar.setBackgroundColor({ color: "#ffffff" });
  await setupStatusBar()
  
});

const setupStatusBar = async() => {
      // Vérifie si on est sur mobile (évite les erreurs en web)
      if (isPlatform('android') || isPlatform('ios')) {
        await StatusBar.setOverlaysWebView({ overlay: true }); // Mode Edge-to-Edge
        await StatusBar.setBackgroundColor({ color: '#ffffff' }); // Transparent
        // await StatusBar.setStyle({ style: Style.Dark }); // Texte clair ou foncé
      }
    }

onUnmounted(() => {
  socketService.disconnect();
});
</script>
