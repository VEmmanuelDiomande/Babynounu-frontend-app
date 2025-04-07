<template>
  <IonPage @ionScroll="onScroll($event)" :scroll-events="true">
    <IonContent>
      <IonRefresher
        slot="fixed"
        @ionRefresh="_handleRefresh"
        :pullFactor="0.5"
        :pullMin="100"
        :pullMax="200"
      >
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      <HeaderMenuLayout
        Title="Notifications"
        PlaceholderSearch="Rechercher dans messageries"
        :has-search="true"
        :countScroll="0"
      >
      </HeaderMenuLayout>

      <PageLoader
        class-custom="h-[100vh] fixed inset-0"
        size="large"
        v-if="isLoadingNotifications"
      />
      <div v-else-if="DataNotifications && DataNotifications?.length != 0">
        <CardNotification :DataNotifications="DataNotifications" />
      </div>
      <EmptyError
        v-else-if="DataNotifications && DataNotifications?.length == 0"
        nameIcons="RiNotificationLine"
        heading="Aucune notification"
        subHeading="Aucune notification disponible. Interagissez avec les autres utilisateurs !"
      />
      <E404Error v-else="isErrorNotifications" />
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import MainSideBar from "@/components/headers/sidebars/MainSideBar.vue";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/vue";
import { computed, onMounted, ref } from "vue";
import { ScrollUtils } from "@/utils/scroll.utils";
import { useNotificationHook } from "@/hooks/notificationHooks/notification.hook";
import E404Error from "@/components/errors/e404.error.vue";
import EmptyError from "@/components/errors/empty.error.vue";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useQuery } from "@tanstack/vue-query";
import { StorageUtils } from "@/utils/store.utils";
import PageLoader from "@/components/loaders/pageLoader.vue";
import { useRefetchHook } from "@/hooks/refetchHooks/refetch.hook";
import CardNotification from "./CardNotification.vue";
import { SocketService } from "@/services/socket.services";
import { useNotificationStore } from "@/stores/notificationStore";

const { state, toggleActiveMenu } = useNotificationHook();
const GetUser = ref<string | null>(null);
const socketService = new SocketService();

const { onScroll } = ScrollUtils();

const fetchNotifications = async () => {
  const storedUser = await StorageUtils().getStore("nUser_Id");
  GetUser.value = storedUser?.value || null;

  if (!GetUser.value) {
    return [];
  }

  return await SettingServices()
    .listSetting(`${URL_API_ROUTE.NOTIFICATION_USER}/${GetUser.value}`)
    .then((res) => {
      if (res) {
        useNotificationStore().state.countNotification = res.count;
        return res.notifications;
      }
    });
};

const updateViewByUserId = async () => {
  socketService.emit("updateViewByUserId", {
    userId: (await StorageUtils().getStore("nUser_Id")).value,
  });
};

// Ecrire une query qui permet de charger les notifications
const {
  isLoading: isLoadingNotifications,
  isError: isErrorNotifications,
  data: DataNotifications,
  error: ErrorNotifications,
  refetch,
} = useQuery({
  queryKey: ["ListNotifications", GetUser],
  queryFn: fetchNotifications,
  retry: 2, // Réessayer en cas d'échec
  refetchOnWindowFocus: false, // Ne pas recharger les données lors du focus de la fenêtre
});

onMounted(() => {
  updateViewByUserId();
  // Mise jour de l'abonnement
  socketService.on("notifications", (data: any) => {
    if (GetUser.value == data.userId) {
      // Mise à jour des notifications
      DataNotifications.value = data.notifications;
      useNotificationStore().state.countNotification = data.count;
    }
  });
});

const { handleRefresh } = useRefetchHook();
const _handleRefresh = (event: any) => handleRefresh(event, refetch);
</script>
<style scoped></style>
