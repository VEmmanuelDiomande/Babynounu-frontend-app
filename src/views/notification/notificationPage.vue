<template>
  <IonPage @ionScroll="onScroll" :scroll-events="true">
    <IonContent>
      <!-- Composant de rafraîchissement -->
      <IonRefresher
        slot="fixed"
        @ionRefresh="handleRefresh"
        :pullFactor="0.5"
        :pullMin="100"
        :pullMax="200"
      >
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      <!-- En-tête avec barre de recherche -->
      <HeaderMenuLayout
        Title="Notifications"
        PlaceholderSearch="Rechercher dans messageries"
        :has-search="true"
        :countScroll="0"
      />

      <!-- Affichage conditionnel du contenu -->
      <template v-if="isLoadingNotifications">
        <PageLoader
          class-custom="h-[100vh] fixed inset-0"
          size="large"
        />
      </template>

      <template v-else-if="hasNotifications">
        <CardNotification :DataNotifications="notifications" />
      </template>

      <template v-else-if="isEmptyNotifications">
        <EmptyError
          nameIcons="RiNotificationLine"
          heading="Aucune notification"
          subHeading="Aucune notification disponible. Interagissez avec les autres utilisateurs !"
        />
      </template>

      <template v-else-if="isErrorNotifications">
        <E404Error />
      </template>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { IonContent, IonPage, IonRefresher, IonRefresherContent } from "@ionic/vue";

// Composants
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import E404Error from "@/components/errors/e404.error.vue";
import EmptyError from "@/components/errors/empty.error.vue";
import PageLoader from "@/components/loaders/pageLoader.vue";
import CardNotification from "./CardNotification.vue";

// Services et utilitaires
import { ScrollUtils } from "@/utils/scroll.utils";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import { SocketService } from "@/services/socket.services";

// Hooks et stores
import { useNotificationHook } from "@/hooks/notificationHooks/notification.hook";
import { useRefetchHook } from "@/hooks/refetchHooks/refetch.hook";
import { useNotificationStore } from "@/stores/notificationStore";
import { useQuery } from "@tanstack/vue-query";

// Initialisation des hooks et services
const { state } = useNotificationHook();
const { onScroll } = ScrollUtils();
const { handleRefresh: refreshHandler } = useRefetchHook();
const notificationStore = useNotificationStore();
const socketService = new SocketService();

// État local
const userId = ref<string | null>(null);

// Fonction pour récupérer les notifications
const fetchNotifications = async () => {
  try {
    // Récupérer l'ID utilisateur depuis le stockage
    const storedUser = await StorageUtils().getStore("nUser_Id");
    userId.value = storedUser?.value || null;

    if (!userId.value) {
      return [];
    }

    // Appel API pour récupérer les notifications
    const response = await SettingServices().listSetting(
      `${URL_API_ROUTE.NOTIFICATION_USER}/${userId.value}`
    );

    if (response) {
      // Mettre à jour le compteur de notifications dans le store
      notificationStore.state.countNotification = response.count;
      return response.notifications;
    }

    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    return [];
  }
};

// Requête pour charger les notifications
const {
  isLoading: isLoadingNotifications,
  isError: isErrorNotifications,
  data: notifications,
  refetch
} = useQuery({
  queryKey: ["ListNotifications", userId],
  queryFn: fetchNotifications,
  retry: 2,
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false
});

// Computed properties pour les conditions d'affichage
const hasNotifications = computed(() => 
  notifications.value && notifications.value.length > 0
);

const isEmptyNotifications = computed(() => 
  notifications.value && notifications.value.length === 0
);

// Fonction pour gérer le rafraîchissement
const handleRefresh = (event: CustomEvent) => {
  refreshHandler(event, refetch);
};

// Configuration des écouteurs de socket
const setupSocketListeners = () => {
  socketService.on("notifications", () => {
    refetch();
  });
};

// Initialisation au montage du composant
onMounted(() => {
  setupSocketListeners();
});
</script>

<style scoped>
/* Animation pour le chargement */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ion-content {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
