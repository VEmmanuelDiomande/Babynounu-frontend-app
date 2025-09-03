<template>
  <ion-app>
    <MainSideBar />

    <!-- Boutons modaux cachés -->
    <ion-button id="open-modal-auth-profil" class="hidden" expand="block">
      Open
    </ion-button>
    <ion-button id="open-modal-filter-search" class="hidden" expand="block">
      Open
    </ion-button>

    <!-- Modal de création de profil -->
    <CreateProfilModal
      v-if="shouldShowProfilModal"
      :StepProfil="getActiveStepProfil"
      :LessStepProfil="getActivePreviousStep"
    >
      <template v-slot:content>
        <ParentProfilAuth v-if="isParentProfilActive" />
        <NounuProfilAuth v-if="isNounuProfilActive" />
      </template>
    </CreateProfilModal>

    <ion-router-outlet id="main-content" />

    <!-- Modal d'abonnement -->
    <button id="open-modal-abonnement" class="z-50 hidden" type="button">
      Open
    </button>
    <button
      id="is-update-profil"
      class="hidden"
      type="button"
      value="false"
    ></button>
    <AbonnementProfilModal />

    <!-- Modal de redirection d'authentification -->
    <ion-button id="ToRedirectAuthModal" class="hidden" @click="openModal">
      Ouvrir le modal Auth
    </ion-button>
    <ToRedirectAuthModal v-model:isOpen="isModalOpen" />
  </ion-app>
</template>

<script setup lang="ts">
// Imports Ionic
import { IonApp, IonButton, IonRouterOutlet } from "@ionic/vue";

// Imports de composants
import MainSideBar from "@/components/headers/sidebars/MainSideBar.vue";
import AbonnementProfilModal from "@/views/profil/abonnementProfilModal.vue";
import CreateProfilModal from "./views/auth/profils/createProfilModal.vue";
import ParentProfilAuth from "./views/auth/profils/parentProfilAuth.vue";
import NounuProfilAuth from "./views/auth/profils/nounuProfilAuth.vue";
import ToRedirectAuthModal from "./components/modals/ToRedirectAuthModal.vue";

// Imports de services et utilitaires
import { SocketService } from "./services/socket.services";
import { StorageUtils } from "./utils/store.utils";
import { SettingServices } from "./services/setting.services";
import { MODE_APP, URL_API_ROUTE } from "./routes/_requests/index.request";
import axios from "axios";

// Imports de capacitor
import { StatusBar, Style } from "@capacitor/status-bar";
import {
  LocalNotifications,
  PermissionStatus,
} from "@capacitor/local-notifications";
import { Toast } from "@capacitor/toast";

// Imports Vue
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import { isPlatform } from "@ionic/vue";

// Imports de stores
import { useUserStore } from "./stores/user.store";
import { useAbonnementStore } from "./stores/abonnementStore";
import { useProfilStore } from "./stores/authProfilStore";
import { useProfiNounulStore } from "./stores/authProfilNounuStore";
import { useAuthStore } from "./stores/auth.store";
import { useNotificationStore } from "./stores/notificationStore";

// Imports de hooks
import { useUserHook } from "./hooks/userHooks/userHook";
import { useUpdateAppHook } from "./hooks/updateAppHooks/useUpdateAppHook";
import { useNotificationHook } from "./hooks/notificationHooks/notification.hook";

const { checkCustomUpdate, initUpdateCheck } = useUpdateAppHook();

// Initialisation des services et stores
const router = useRouter();
const socketService = new SocketService();
const { userId, _USER, getUser } = useUserStore();
const storageUtils = StorageUtils();

// État réactif
const isModalOpen = ref(false);

// Propriétés calculées pour les profils
const isParentProfilActive = computed(
  () =>
    useProfilStore().state.activeMenu_typeOfProfil ===
    "open-modal-auth-profil-parent"
);

const isNounuProfilActive = computed(
  () =>
    useProfilStore().state.activeMenu_typeOfProfil ===
    "open-modal-auth-profil-nounu"
);

const shouldShowProfilModal = computed(
  () =>
    useProfilStore().state.InformationPersonnelle && useProfiNounulStore().state
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
 * Récupère l'ID utilisateur depuis le stockage
 */
const getUserId = async (): Promise<string | null> => {
  try {
    const result = await storageUtils.getStore("nUser_Id");
    return result.value;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'ID utilisateur:", error);
    return null;
  }
};

/**
 * Checks if user has an active subscription
 */
const isAbonnement = async (): Promise<void> => {
  try {
    const userId = await getUserId();
    if (userId) {
      socketService.emit("isAbonnement", { userId });
    }
  } catch (error) {
    console.error("Error checking subscription status:", error);
  }
};





/**
 * Vérifie le statut de l'abonnement de l'utilisateur
 */
const checkIsAbonnement = async (): Promise<void> => {
  try {
    const userId = await getUserId();
    const transactionId = (await storageUtils.getStore("nTransactionId")).value;
    if (userId && transactionId) {
      socketService.emit("checkIsAbonnement", { userId, transactionId });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'abonnement:", error);
  }
};

/**
 * Vérifie le statut des points de paiement
 */
const checkPaymentPoint = async (): Promise<void> => {
  try {
    const userId = (await storageUtils.getStore("nUserPointsId")).value;
    const transactionId = (await storageUtils.getStore("nTransactionPointId"))
      .value;
    const points = (await storageUtils.getStore("nPoints")).value;

    if (userId && transactionId && points) {
      socketService.emit("checkPaymentPoint", {
        userId,
        transactionId,
        points,
      });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification des points de paiement:",
      error
    );
  }
};

/**
 * Récupère le nombre total de messages non lus
 */
const getTotalUnreadCount = async (): Promise<void> => {
  try {
    const userId = await getUserId();
    if (userId) {
      socketService.emit("getUnreadCounts", userId);
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des messages non lus:",
      error
    );
  }
};

/**
 * Récupère le nombre de notifications non lues
 */
const getUnreadCountsNotification = async (): Promise<void> => {
  try {
    const userId = await getUserId();
    if (userId) {
      socketService.emit("getUnreadCountsNotification", { userId });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des notifications non lues:",
      error
    );
  }
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
 * Configure l'écouteur pour les clics sur notifications
 */
const setupNotificationListener = (): void => {
  LocalNotifications.addListener(
    "localNotificationActionPerformed",
    (notification) => {
      const routePath = notification.notification.extra;
      if (routePath?.name) {
        router.push(routePath);
      }
    }
  );
};

/**
 * Configure tous les écouteurs d'événements socket
 */
const { scheduleNotification } = useNotificationHook();
const setupSocketListeners = (): void => {
  // Écouteur pour les messages non lus
  socketService.on("unreadCounts", (data) => {
    console.log("unreadCounts", data);
    useNotificationStore().state.countMessage = data;
  });

  // Écouteur pour les notifications non lues
  socketService.on("unreadCountsNotification", (data) => {
    console.log("getUnreadCountsNotification", data);
    useNotificationStore().state.countNotification = data;
  });

  // // Écouteur pour les mises à jour de messages non lus
  // socketService.on("getUnreadCounts", (unreadCount) => {
  //   useNotificationStore().state.countMessage = unreadCount;
  // });

  // Écouteur pour les nouveaux messages

  socketService.on("newMessageNotify", (message) => {
    console.log("New message notification received:", message);
    // Handle the new message notification here
    // useNotificationStore().handleNewMessage(message);
    scheduleNotification(
      message?.sender?.id == "admin-babynounu-01"
        ? message?.room?.nounou?.fullname
        : message?.room.parent.fullname,
      message.content,
      { name: "CHAT_MESSAGE_DETAIL", params: message?.room?.id }
    );
  });

  // Listener for unread message updates
  socketService.on("unreadUpdated", ({ roomId, unreadCount, totalUnread }) => {
    console.log("unreadUpdated", { roomId, unreadCount, totalUnread });
    // Mise à jour du nombre de messages non lus pour une salle de conversation spécifique
    useNotificationStore().state.countMessage.totalUnread = totalUnread;
  });

  // Écouteur pour les abonnements
socketService.on("isAbonnement", async (isAbonnement) => {
  try {
    const abonnementStore = useAbonnementStore();
    const hasSubscription = isAbonnement?.hasActiveSubscription;

    // Update subscription status in store and storage
    abonnementStore.isAbonnement = hasSubscription;
    await storageUtils.setStore("nIsAbonnement", hasSubscription);

    // Show renewal notification if subscription was previously inactive
    if (hasSubscription) {
      const currentStatus = await storageUtils.getStore("nIsAbonnement");
      if (!currentStatus.value) {
        await Toast.show({
          text: "Votre abonnement a été renouvelé. Merci!",
          duration: 'short'
        });
      }
    }
  } catch (error) {
    console.error("Error handling subscription status:", error);
    await storageUtils.setStore("nIsAbonnement", false);
  }
});
};

/**
 * Configure la barre de statut pour les plateformes mobiles
 */
const setupStatusBar = async (): Promise<void> => {
  try {
    // Vérifie si on est sur mobile (évite les erreurs en web)
    if (isPlatform("android") || isPlatform("ios")) {
      await StatusBar.setOverlaysWebView({ overlay: false }); // Mode Edge-to-Edge
      await StatusBar.setBackgroundColor({ color: "#ffffff" }); // Couleur de fond
      // await StatusBar.setStyle({ style: Style.Dark }); // Texte clair ou foncé
    }
  } catch (error) {
    console.error(
      "Erreur lors de la configuration de la barre de statut:",
      error
    );
  }
};

/**
 * Checks and performs app updates on mobile platforms
 */
const checkPlatformUpdates = async (): Promise<void> => {
  // Platform verification
  if ((isPlatform("android") || isPlatform("ios")) && MODE_APP !== "dev") {
    try {
      // Manual update check
      await checkCustomUpdate();

      // Automatic update check on startup
      await initUpdateCheck();
    } catch (error) {
      console.error("Error during update checks:", error);
    }
  }
};

/**
 * Gère l'ouverture du modal d'authentification
 */
const openModal = (): void => {
  isModalOpen.value = true;
};

/**
 * Initialise l'application
 */
const initializeApp = async (): Promise<void> => {
  try {
    // Configuration des écouteurs socket
    setupSocketListeners();

    // Initialisation de l'utilisateur
    await _USER();
    await getUser();
    await useAuthStore().getRole();

    // Initialisation des messageries et notifications
    await getTotalUnreadCount();
    await getUnreadCountsNotification();
    setupNotificationListener();
    await checkPermissionsStrict();

    // Vérification des abonnements
    await checkIsAbonnement();
    await checkPaymentPoint();
    useAbonnementStore().isAdminLogged();

    // Stockage de l'état de mise à jour du profil
    await storageUtils.setStore(
      "nisUpdateProfil",
      useAuthStore().isUpdateProfil
    );

    // Vérification de l'état de connexion
    useUserHook().isUserLogged();
    useUserHook().isAdminLogged();

    // Vérification des mises à jour
    // await checkPlatformUpdates();

    // Configuration de la barre de statut
    await setupStatusBar();
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'application:", error);
  }
};

onMounted(async () => {
  await initializeApp();
});

onUnmounted(() => {
  try {
    socketService.disconnect();
  } catch (error) {
    console.error("Erreur lors de la déconnexion du socket:", error);
  }
});
</script>
