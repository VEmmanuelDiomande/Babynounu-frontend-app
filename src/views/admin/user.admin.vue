<template>
    <IonPage>
      <IonContent class="font-love">
        <IonRefresher slot="fixed">
          <IonRefresherContent />
        </IonRefresher>
  
        <HeaderMenuLayout
          Title="Listes des nounous"
          PlaceholderSearch="Rechercher dans messageries"
          :countScroll="scrollAdminCount"
        >
          <template v-slot:ContentSearchUp>
            <input
              type="text"
              placeholder="Rechercher..."
              class="h-11 outline-none font-love text-base w-full bg-transparent border-5"
              v-model="searchQueryAdminUser"
              @keyup.enter="searchAdminUser"
            />
          </template>
        </HeaderMenuLayout>
  
        <PageLoader
          class-custom="h-[100vh] fixed inset-0"
          size="large"
          v-if="isLoadingAdminUser"
        />
        <div v-else-if="dataAdminUser && dataAdminUser?.length != 0">
          <div class="flex flex-col mx-4 gap-4 divide-y-[1px] pb-16">
            <div v-for="item in dataAdminUser" :key="item.id">
              <CardAdminUser :data="item"  />
            </div>
          </div>
        </div>
        <EmptyError
          v-else-if="dataAdminUser && dataAdminUser?.length == 0"
          nameIcons="RiPassValidLine"
          heading="Pas de Nounou, inscrite."
          subHeading="Aucune nounou inscrite. Ici vous validez les identités des nounou."
        />
        <E404Error v-else="isErrorAdminUser" />
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
  import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
  import { Toast } from "@capacitor/toast";
import CardAdminUser from "./_partials/cardAdminUser.vue";
  
  const socketService = new SocketService();
  
  // Data
  const searchQueryAdminUser = ref("");
  const scrollAdminCount = ref(0);
  
  const searchAdminUser = () => {
    // socketService.searchAdminUser(searchQueryAdminUser.value);
  };
  
  const props = defineProps({});
  
  const fetchConversations = async () => {
    return await SettingServices()
      .listSetting(`${URL_API_ROUTE.NOUNU_ALL_USER}`)
      .then((res) => {
        if (res) {
          return res;
        }
      });
  };
  
  // Configuration de la requête
  const {
    refetch,
    data: dataAdminUser,
    isLoading: isLoadingAdminUser,
    isError: isErrorAdminUser,
  } = useQuery({
    queryKey: ["AdminUser"],
    queryFn: fetchConversations,
    retry: 2,
    refetchOnWindowFocus: false,
  });
  
  // Mettre à jour la validation de la certification
  const isLaodingUpdate = ref(false);
  const { createSetting } = SettingServices();
  const updateValidation = async (id: any) => {
    try {
      isLaodingUpdate.value = true;
      if (createSetting) {
        const reponse = await createSetting(
          `${URL_API_ROUTE.NOUNU_APPROVE_CERTIFICATION}/${id}`,
          {}
        );
        if (reponse) {
          await Toast.show({
            text: "Validation effectuée",
            duration: "long",
          });
          refetch();
          isLaodingUpdate.value = false;
  
          return reponse;
        }
      }
    } catch (error) {
      isLaodingUpdate.value = false;
  
      // Toast
      await Toast.show({
        text: "Une erreur est survenue lors de la validation",
        duration: "long",
      });
      console.log(error);
    }
  };
  
  onMounted(() => {});
  </script>
  