<template>
  <ion-app>
    <MainSideBar />

    <!--  -->
    <ion-button id="open-modal-auth-profil" class="hidden" expand="block"
      >Open</ion-button
    >
    <ion-button id="open-modal-filter-search" class="hidden" expand="block"
      >Open</ion-button
    >
    <CreateProfilModal
      v-if="
        useProfilStore().state.InformationPersonnelle &&
        useProfiNounulStore().state
      "
      :StepProfil="
        useProfilStore().state.activeMenu_typeOfProfil ==
        'open-modal-auth-profil-parent'
          ? useProfilStore().state.stepProfil
          : useProfiNounulStore().state.StepProfil
      "
      :LessStepProfil="
        useProfilStore().state.activeMenu_typeOfProfil ==
        'open-modal-auth-profil-parent'
          ? useProfilStore().previousStep
          : useProfiNounulStore().previousStep
      "
    >
      <template v-slot:content>
        <ParentProfilAuth
          v-if="
            useProfilStore().state.activeMenu_typeOfProfil ==
            'open-modal-auth-profil-parent'
          "
        />
        <NounuProfilAuth
          v-if="
            useProfilStore().state.activeMenu_typeOfProfil ==
            'open-modal-auth-profil-nounu'
          "
        />
      </template>
    </CreateProfilModal>
    <!--  -->

    <ion-router-outlet id="main-content" />

    <button id="open-modal-abonnement" class="z-50 hidden" expand="block">
      Open
    </button>
    <button class="" id="is-update-profil" value="false"></button>
    <AbonnementProfilModal />
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonButton,
  IonRouterOutlet,
  // useBackButton,
  // useIonRouter,
} from "@ionic/vue";
import MainSideBar from "@/components/headers/sidebars/MainSideBar.vue";
import { useUserHook } from "./hooks/userHooks/userHook";
import { computed, onActivated, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { SocketService } from "./services/socket.services";
import { StorageUtils } from "./utils/store.utils";
import { useAbonnementStore } from "./stores/abonnementStore";
import { SettingServices } from "./services/setting.services";
import { URL_API_ROUTE } from "./routes/_requests/index.request";
import { useUserStore } from "./stores/user.store";
import { StatusBar } from "@capacitor/status-bar";
import { an, c } from "vitest/dist/reporters-5f784f42";
import { useQuery, useMutation } from "@tanstack/vue-query";
import AbonnementProfilModal from "@/views/profil/abonnementProfilModal.vue";
import axios from "axios";
import { useProfilStore } from "./stores/authProfilStore";
import { useProfiNounulStore } from "./stores/authProfilNounuStore";
import CreateProfilModal from "./views/auth/profils/createProfilModal.vue";
import ParentProfilAuth from "./views/auth/profils/parentProfilAuth.vue";
import NounuProfilAuth from "./views/auth/profils/nounuProfilAuth.vue";
import { useAuthStore } from "./stores/auth.store";
import { LocalNotifications, PermissionStatus } from "@capacitor/local-notifications";
import { useNotificationStore } from "./stores/notificationStore";
const router = useRouter();
const socketService = new SocketService();
const { userId, _USER } = useUserStore();

const checkIsAbonnement = async () => {
  socketService.emit("checkIsAbonnement", {
    userId: (await StorageUtils().getStore("nUser_Id")).value,
    transactionId: (await StorageUtils().getStore("nTransactionId")).value,
  });
};



const checkPermissionsStrict = async (): Promise<PermissionStatus> => {
  try {
    const status = await LocalNotifications.checkPermissions();
    if (status.display === 'granted') {
      return status;
    }
    return await LocalNotifications.requestPermissions();
  } catch (error) {
    console.error('Permission check failed:', error);
    return { display: 'denied' };
  }
};

const scheduleNotification = async () => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Notification de test",
          body: "Ceci est une notification locale!",
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) }, // 1 seconde après
          sound: undefined, // Utilise le son par défaut
          attachments: undefined,
          actionTypeId: "",
          extra: { data: "test-data" }
        }
      ]
    });
    console.log('Notification programmée');
  } catch (error) {
    console.error('Erreur de notification:', error);
  }
};


// Écouter les clics sur notification
const setupNotificationListener = () => {
  LocalNotifications.addListener(
    'localNotificationActionPerformed',
    (notification) => {
      const routePath = notification.notification.extra?.route;
      if (routePath) {
        router.push(routePath);
      }
    }
  );
};

onMounted(async () => {
  // Initialisation de l'utilisateur
  await _USER();
  await checkIsAbonnement();
  await checkPermissionsStrict();
  await scheduleNotification();
  useNotificationStore().NCountChats();
  useNotificationStore().NCountNotification();
  setupNotificationListener();
  useAbonnementStore().isAdminLogged()

  // Chargement de l'ID du profil utilisateur depuis le stockage
  await StorageUtils().setStore(
    "nisUpdateProfil",
    useAuthStore().isUpdateProfil
  );

  // Mise jour de l'abonnement
  socketService.on("isAbonnement", async (isAbonnement) => {
    const userId = (await StorageUtils().getStore("nUser_Id")).value;
    if (isAbonnement.hasActiveSubscription && userId == isAbonnement?.user.id) {
      useAbonnementStore().isAbonnement = true;
      await useNotificationStore().NCountNotification();
    }
  });

 



  // V rification si l'utilisateur est connect
  useUserHook().isUserLogged();
  useUserHook().isAdminLogged();

  // Changement de la couleur de la barre de statut
  await StatusBar.setBackgroundColor({ color: "#ffffff" }); // Rouge
});

onUnmounted(() => {
  socketService.disconnect();
});
</script>
