<template>
  <IonPage>
    <IonContent class="font-love">
      <IonRefresher slot="fixed" @ionRefresh="_handleRefresh">
        <IonRefresherContent />
      </IonRefresher>

      <HeaderMenuLayout
        Title="Messageries - Admin"
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
        v-if="isLoadingAdminChats"
      />
      <div v-else-if="filteredConversations  && filteredConversations?.length != 0">
        <CardAdminMessage :Messages="filteredConversations " sender="admin" />
      </div>
      <EmptyError
        v-else-if="filteredConversations  && filteredConversations ?.length == 0"
        nameIcons="RiChat1Line"
        heading=" Messagerie"
        subHeading="Aucune conversation disponible. Les parents vous contacteront  très bientôt!"
      />
      <E404Error v-else="isErrorAdminChats" />
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
import PageLoader from "@/components/loaders/pageLoader.vue";
import EmptyError from "@/components/errors/empty.error.vue";
import E404Error from "@/components/errors/e404.error.vue";
import CardAdminMessage from "./_partials/cardAdminMessage.vue";
import { useRefetchHook } from "@/hooks/refetchHooks/refetch.hook";

const socketService = new SocketService();
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
  administrateurUnreadCount: number;
}

const props = defineProps({
  activeConversation: {
    type: Object as () => Room | null,
    default: null,
  },
});

const searchQuery = ref("");

// Computed properties
const scrollCount = computed(() => useScrollStore().countScrollMessage);
const conversations = ref<Room[]>([]);
const userTypeProfil = ref();
const isOpenDetailMessage = ref(false);
const currentUserId = ref<string | null>(null);

const searchMessages = () => {
  refetch();
};

const fetchConversations = async () => {
  userTypeProfil.value = (await StorageUtils().getStore("nType_Profil")).value;
  const userId = (await StorageUtils().getStore("nUser_Id")).value;
  currentUserId.value = userId;

  return await SettingServices()
    .listSetting(
      `${URL_API_ROUTE.CONVERSATION_ALL}?userId=${
        (
          await StorageUtils().getStore("nUser_Id")
        ).value
      }`
    )
    .then((res) => {
      if (res) {
        return res;
      }
    });
};

const filteredConversations = computed(() => {
  if (!dataAdminChats.value) return [];
  
  return dataAdminChats.value.filter((room:any) => {
    const searchTerm = searchQuery.value.toLowerCase();
    if(searchTerm.length != 0){
      return (
        room.room.parent?.fullname.toLowerCase().includes(searchTerm) ||
        room.room.nounou?.fullname.toLowerCase().includes(searchTerm)
      );
    }
    return room;
  });
});

// Configuration de la requête
const {
  refetch,
  data: dataAdminChats,
  isLoading: isLoadingAdminChats,
  isError: isErrorAdminChats,
} = useQuery({
  queryKey: ["Rooms_Admin"],
  queryFn: fetchConversations,
  retry: 2,
});

const UpdateConversations = async () => {
  socketService.on("conversationsUpdated", () => {
    console.log("conversationsUpdated");
    refetch();
  });
};

onMounted(async () => {
  await UpdateConversations();
});

const { handleRefresh } = useRefetchHook();
const _handleRefresh = (event: any) => handleRefresh(event, refetch);
</script>
