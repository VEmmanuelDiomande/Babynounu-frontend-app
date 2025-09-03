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
      <template v-if="isLoadingNotifications && currentPage === 1">
        <PageLoader
          class-custom="h-[100vh] fixed inset-0"
          size="large"
        />
      </template>

      <template v-else-if="isErrorNotifications">
        <E404Error />
      </template>

      <template v-else-if="allNotifications.length > 0">
        <CardNotification :DataNotifications="allNotifications" />
        
        <!-- Pagination avec un seul bouton -->
        <div class="flex flex-col items-center font-love my-4 gap-2">
          <span class="text-sm text-gray-600">
            {{ allNotifications.length }} sur {{ data?.pagination?.total || 0 }} notifications affichées
          </span>
          
          <div
            v-if="data?.pagination?.hasNextPage"
            fill="outline"
            size="default"
            class="max-w-xs ring-2 ring-primary text-primary p-2 rounded-xl cursor-pointer"
            :class="{ 'opacity-50': isLoadingMore }"
            :disabled="isLoadingNotifications || isLoadingMore"
            @click="loadMore"
          >
            <span v-if="!isLoadingMore" class="font-love">Voir plus</span>
            <span v-else class="font-love">Chargement...</span>
          </div>
        </div>
      </template>

      <template v-else-if="isEmptyNotifications">
        <EmptyError
          nameIcons="RiNotificationLine"
          heading="Aucune notification"
          subHeading="Aucune notification disponible. Interagissez avec les autres utilisateurs !"
        />
      </template>
      {{ countNotifications }}
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
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

// Interface pour les données de notification
interface Notification {
  id: number;
  title: string;
  message: string;
  [key: string]: any;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface NotificationResponse {
  data: Notification[];
  pagination: Pagination;
  unreadCount: number;
}

// Initialisation des hooks et services
const { onScroll } = ScrollUtils();
const { handleRefresh: refreshHandler } = useRefetchHook();
const notificationStore = useNotificationStore();
const socketService = new SocketService();

// Configuration automatique des limites
const ITEMS_PER_PAGE = 20;

// État local
const userId = ref<string | null>(null);
const currentPage = ref(1);
const allNotifications = ref<any[]>([]);
const isLoadingMore = ref(false);

// Fonction pour récupérer les notifications
const fetchNotifications = async (): Promise<NotificationResponse> => {
  try {
    // Récupérer l'ID utilisateur depuis le stockage
    const storedUser = await StorageUtils().getStore("nUser_Id");
    userId.value = storedUser?.value || null;

    if (!userId.value) {
      return {
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: ITEMS_PER_PAGE,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        },
        unreadCount: 0
      };
    }

    // Appel API pour récupérer les notifications avec pagination
    const response = await SettingServices().listSetting(
      `${URL_API_ROUTE.NOTIFICATION_USER}/${userId.value}?page=${currentPage.value}&limit=${ITEMS_PER_PAGE}`
    );

    if (response) {
      // Mettre à jour le compteur de notifications dans le store
      notificationStore.state.countNotification = response.count;
      return response;
    }

    console.log(response)
    return response;
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    throw error;
  }
};

// Requête pour charger les notifications
const {
  isLoading: isLoadingNotifications,
  isError: isErrorNotifications,
  data,
  refetch
} = useQuery({
  queryKey: ["ListNotifications", currentPage],
  queryFn: fetchNotifications,
  retry: 2,
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false
});

// Observer les changements de données et mettre à jour allNotifications
// Observer les changements de données et mettre à jour allNotifications
watch(data, (newData) => {
  console.log(newData)
  if (newData && newData.data) {
    if (currentPage.value === 1) {
      // Si c'est la première page, remplacer les données
      allNotifications.value = [...newData.data];
    } else {
      // Sinon, ajouter les nouvelles données
      // Utiliser un Set pour éviter les doublons (basé sur l'ID)
      const uniqueIds = new Set(allNotifications.value.map(item => item.id));
      const newItems = newData.data.filter((item: Notification) => !uniqueIds.has(item.id));
      allNotifications.value = [...allNotifications.value, ...newItems];
    }
    isLoadingMore.value = false;
  }
});

// Computed properties pour les conditions d'affichage
const hasNotifications = computed(() => 
  allNotifications.value && allNotifications.value.length > 0
);

const isEmptyNotifications = computed(() => 
  data.value && data.value.data && data.value.data.length === 0 && currentPage.value === 1
);

const countNotifications = computed(() =>
{
  useNotificationStore().state.countNotification = data.value?.unreadCount || 0;
}
);

// Fonction pour charger plus de données
const loadMore = () => {
  if (data.value?.pagination?.hasNextPage && !isLoadingNotifications.value) {
    isLoadingMore.value = true;
    currentPage.value++;
  }
};

// Fonction pour gérer le rafraîchissement
const handleRefresh = (event: CustomEvent) => {
  currentPage.value = 1;
  allNotifications.value = [];
  refreshHandler(event, refetch);
};

// Observer les changements de page pour charger plus de données
watch(currentPage, () => {
  refetch();
});

// Configuration des écouteurs de socket
const setupSocketListeners = () => {
  socketService.on("notifications", () => {
    // Réinitialiser à la première page lors de nouvelles notifications
    currentPage.value = 1;
    allNotifications.value = [];
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
