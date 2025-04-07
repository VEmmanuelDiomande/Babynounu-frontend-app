<template>
  <IonPage>
    <IonContent>
      <IonRefresher slot="fixed" @ionRefresh="handleRefresh">
        <IonRefresherContent />
      </IonRefresher>

      <HeaderMenuLayout
        Title="Messageries"
        PlaceholderSearch="Rechercher dans messageries"
        :countScroll="scrollCount"
      >
        <template v-slot:ContentSearchUp>
          <input
            type="text"
            placeholder="Rechercher..."
            class="h-11 outline-none font-love text-base w-full bg-transparent border-5"
            v-model="searchQuery"
            @keyup.enter="searchMessages"
          />
        </template>
      </HeaderMenuLayout>


      <PageLoader
        class-custom="h-[100vh] fixed inset-0"
        size="large"
        v-if="isLoadingChats"
      />
      <div v-else-if="dataChats && dataChats?.length != 0">
        <CardMessagerie :Messages="dataChats" sender="nounou" />
      </div>
      <EmptyError
        v-else-if="dataChats && dataChats?.length == 0"
        nameIcons="RiNotificationLine"
        heading="Aucune notification"
        subHeading="Aucune notification disponible. Interagissez avec les autres utilisateurs !"
      />
      <E404Error v-else="isErrorChats" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
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
import CardNotification from "../notification/CardNotification.vue";
import EmptyError from "@/components/errors/empty.error.vue";
import E404Error from "@/components/errors/e404.error.vue";

interface Room {
  id: number;
  parent: {
    fullname: string;
  };
  nounou: {
    fullname: string;
  };
  parentUnreadCount: number;
  nounouUnreadCount: number;
  adminUnreadCount: number;
}

const props = defineProps({
  activeConversation: {
    type: Object as () => Room | null,
    default: null,
  },
});
const socketService = new SocketService();
const currentUserId = ref<string | null>(null);
const searchQuery = ref("");

// Computed properties
const scrollCount = computed(() => useScrollStore().countScrollMessage);
const conversations = ref<Room[]>([]);
const userTypeProfil = ref();
const isOpenDetailMessage = ref(false);

const searchMessages = () => {
  // useMessageStore.setSearchValue(searchQuery.value);
  refetch();
};

const handleRefresh = (event: CustomEvent) => {
  refetch().finally(() => event.detail.complete());
};

const fetchConversations = async () => {
  userTypeProfil.value = (await StorageUtils().getStore("nType_Profil")).value;
  const userId = (await StorageUtils().getStore("nUser_Id")).value;
  currentUserId.value = userId;

  return await SettingServices()
    .listSetting(`${URL_API_ROUTE.CONVERSATION_ALL}?userId=${userId}`)
    .then((res) => {
      if (res) {
        return res;
      }
    });
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
});

onMounted(() => {
  socketService.on("updateConversationList", () => {
    refetch();
  });
});
</script>
