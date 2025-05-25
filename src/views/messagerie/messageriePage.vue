<template>
  <IonPage>
    <IonContent>
      <!-- Composant de rafraîchissement -->
      <IonRefresher slot="fixed" @ionRefresh="handleRefresh">
        <IonRefresherContent />
      </IonRefresher>

      <!-- En-tête avec barre de recherche -->
      <HeaderMenuLayout
        Title="Messageries"
        PlaceholderSearch="Rechercher dans messageries"
        :countScroll="scrollCount"
      >
        <template #ContentSearchUp>
          <div class="relative w-full">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher..."
              class="h-11 outline-none font-love text-base w-full bg-transparent pr-10"
              @keyup.enter="searchMessages"
            />
            <button 
              v-if="searchQuery" 
              @click="clearSearch"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <IcIcons name="RiCloseLine" :size="18" />
            </button>
          </div>
        </template>
      </HeaderMenuLayout>

      <!-- États de l'interface -->
      <div class="pb-20">
        <!-- État de chargement -->
        <PageLoader
          class-custom="h-[100vh] fixed inset-0"
          size="large"
          v-if="isLoadingChats"
        />

        <!-- État avec données -->
        <div v-else-if="filteredChats.length > 0">
          <CardMessagerie :Messages="filteredChats" :sender="userTypeProfil" />
        </div>

        <!-- État vide -->
        <EmptyError
          v-else-if="dataChats && dataChats.length === 0"
          nameIcons="RiChat4Line"
          heading="Aucune conversation"
          subHeading="Aucune conversation disponible. Interagissez avec les autres utilisateurs !"
        />

        <!-- État d'erreur -->
        <E404Error v-else-if="isErrorChats" />
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, onUnmounted } from "vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import { SettingServices } from "@/services/setting.services";
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/vue";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import { SocketService } from "@/services/socket.services";
import { useScrollStore } from "@/stores/scrollStore";
import { useQuery } from "@tanstack/vue-query";
import CardMessagerie from "./__partials/cardMessagerie.vue";
import PageLoader from "@/components/loaders/pageLoader.vue";
import EmptyError from "@/components/errors/empty.error.vue";
import E404Error from "@/components/errors/e404.error.vue";
import IcIcons from "@/components/icons/IcIcons.vue";

// Types
interface Room {
  id: number;
  parent: {
    fullname: string;
  };
  nounou: {
    fullname: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  parentUnreadCount: number;
  nounouUnreadCount: number;
  adminUnreadCount: number;
}

// État local
const currentUserId = ref<string | null>(null);
const searchQuery = ref("");
const userTypeProfil = ref<any>("nounou");
const socketService = new SocketService();

// Propriétés calculées
const scrollCount = computed(() => useScrollStore().countScrollMessage);

// Filtrer les conversations en fonction de la recherche
const filteredChats = computed(() => {
  if (!dataChats.value || !Array.isArray(dataChats.value)) return [];
  
  if (!searchQuery.value.trim()) return dataChats.value;
  
  const query = searchQuery.value.toLowerCase().trim();
  return dataChats.value.filter((chat: Room) => {
    const parentName = chat.parent?.fullname?.toLowerCase() || "";
    const nounouName = chat.nounou?.fullname?.toLowerCase() || "";
    const lastMessageContent = chat.lastMessage?.content?.toLowerCase() || "";
    
    return parentName.includes(query) || 
           nounouName.includes(query) || 
           lastMessageContent.includes(query);
  });
});

// Fonctions
const clearSearch = () => {
  searchQuery.value = "";
};

const searchMessages = () => {
  // La recherche est gérée par le computed filteredChats
  if (!searchQuery.value.trim()) {
    refetch();
  }
};

const handleRefresh = (event: CustomEvent) => {
  refetch().finally(() => event.detail.complete());
};

const fetchConversations = async () => {
  try {
    const typeProfilStore = await StorageUtils().getStore("nType_Profil");
    // userTypeProfil.value = typeProfilStore.value;
    
    const userIdStore = await StorageUtils().getStore("nUser_Id");
    const userId = userIdStore.value;
    currentUserId.value = userId;

    if (!userId) {
      throw new Error("ID utilisateur non disponible");
    }

    const response = await SettingServices().listSetting(
      `${URL_API_ROUTE.CONVERSATION_ALL}?userId=${userId}`
    );
    
    return response || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations:", error);
    return [];
  }
};

// Configuration de la requête
const {
  refetch,
  data: dataChats,
  isLoading: isLoadingChats,
  isError: isErrorChats,
} = useQuery({
  queryKey: ["Rooms"],
  queryFn: fetchConversations,
  retry: 2,
  refetchOnWindowFocus: false,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// Gestion des mises à jour via socket
const setupSocketListeners = () => {
  socketService.on("conversationsUpdated", () => {
    refetch();
  });
  
  socketService.on("newMessage", () => {
    refetch();
  });
};

const cleanupSocketListeners = () => {
  socketService.off("conversationsUpdated");
  socketService.off("newMessage");
};

// Cycle de vie du composant
onMounted(() => {
  setupSocketListeners();
});

onUnmounted(() => {
  cleanupSocketListeners();
});

// Observer les changements de recherche pour des recherches en temps réel
watch(searchQuery, (newValue, oldValue) => {
  if (newValue !== oldValue && !newValue) {
    // Si la recherche est effacée, on rafraîchit les données
    refetch();
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
