<template>
    <IonPage>
      <IonContent class="font-love">
        <IonRefresher slot="fixed">
          <IonRefresherContent />
        </IonRefresher>
  
        <PageLoader
          class-custom="h-[100vh] fixed inset-0"
          size="large"
          v-if="isLoadingAdminChats"
        />
        <div v-else-if="dataAdminChats && dataAdminChats?.length != 0"></div>
        <EmptyError
          v-else-if="dataAdminChats && dataAdminChats?.length == 0"
          nameIcons="RiNotificationLine"
          heading="Aucune notification"
          subHeading="Aucune notification disponible. Interagissez avec les autres utilisateurs !"
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
  import { SocketService } from "@/services/socket.services";
  import { useQuery } from "@tanstack/vue-query";
  import PageLoader from "@/components/loaders/pageLoader.vue";
  import EmptyError from "@/components/errors/empty.error.vue";
  import E404Error from "@/components/errors/e404.error.vue";
  
  const socketService = new SocketService();
  
  const props = defineProps({});
  
  const fetchConversations = async () => {
    return await SettingServices()
      .listSetting(
        `${URL_API_ROUTE.CONVERSATION_ALL}
        }`
      )
      .then((res) => {
        if (res) {
          return res;
        }
      });
  };
  
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
    refetchOnWindowFocus: false,
  });
  
  onMounted(() => {});
  </script>
  