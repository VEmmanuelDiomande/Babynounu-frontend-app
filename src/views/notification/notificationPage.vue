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
        :countScroll="countScroll"
      >
        <template v-slot:ContentSearch>
          <div
            class="grid grid-cols-3 gap-1 w-11/12 m-auto mt-2 mb-1 overflow-x-auto no-scrollbar"
          >
            <div v-for="(menu, index) in state.verticalMenu" :key="index">
              <div
                @click="toggleActiveMenu(index)"
                class="h-8 flex items-center px-4 justify-center rounded-xl"
                :class="
                  menu.actived ? 'border-b-1  bg-primary' : ' border-[1px]'
                "
              >
                <span
                  class="text-sm font-bold"
                  :class="menu.actived ? 'text-white' : 'text-zinc-800'"
                  >{{ menu.name }}</span
                >
              </div>
            </div>
          </div>
        </template></HeaderMenuLayout
      >

      

      <PageLoader size="large" v-if="isLoadingNotifications" />
      <div v-else-if="DataNotifications && DataNotifications?.length != 0">
        is
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
import { computed, ref } from "vue";
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

const { state, toggleActiveMenu } = useNotificationHook();
const GetUser = ref<string | null>(null);

const { countScroll, onScroll } = ScrollUtils();

const fetchNotifications = async () => {
  const storedUser = await StorageUtils().getStore("nUser_Id");
  GetUser.value = storedUser?.value || null;

  if (!GetUser.value) {
    return [];
  }

  console.log(GetUser.value)
  return await SettingServices().listSetting(
    `${URL_API_ROUTE.NOTIFICATION_USER}/${GetUser.value}`
  );
};

// Ecrire une query qui permet de charger les notifications
const {
  isLoading: isLoadingNotifications,
  isError: isErrorNotifications,
  data: DataNotifications,
  error: ErrorNotifications,
  refetch,
} = useQuery({
  queryKey: ["ListNotifications0"],
  queryFn: fetchNotifications,
  retry: 2, // Réessayer en cas d'échec
  refetchOnWindowFocus: false, // Ne pas recharger les données lors du focus de la fenêtre
});

const { handleRefresh } = useRefetchHook()
const _handleRefresh = (event:any) => handleRefresh(event, refetch)
</script>
<style scoped></style>
