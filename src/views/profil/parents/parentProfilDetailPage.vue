<template>
    <IonPage>
      <IonContent class="font-love fixed" slot="fixed">

          <!-- Refresher -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
        
        <!-- Banner -->
        <PageLoader v-if="LoadingDetailParent" />
        <ContentParentProfil
          :PARENT="DataDetailParent"
          :isOwner="false"
          v-else-if="DataDetailParent && !LoadingDetailParent"
        />
        <!-- Gestion des erreurs -->
        <div v-else-if="ISErrorDetailParent" class="text-center mt-8">
          <E404Error />
        </div>
  
        <!-- Aucun contenu disponible -->
        <div v-else class="text-center mt-8">
          <E404Error />
        </div>
      </IonContent>
    </IonPage>
  </template>
  
  <script lang="ts" setup>
  import Avatar from "@/components/avatars/avatar.vue";
  import ActionProfilButton from "@/components/buttons/actionProfilButton.vue";
  import IcIcons from "@/components/icons/IcIcons.vue";
  import { GetGreetingUtils } from "@/utils/greeting.utils";
  import { IonContent, IonPage } from "@ionic/vue";
  import { computed, onMounted, ref } from "vue";
  import { RouterLink, useRoute, useRouter } from "vue-router";
  import { useQuery } from "@tanstack/vue-query";
  import { URL_API_ROUTE } from "@/routes/_requests/index.request";
  import { SettingServices } from "@/services/setting.services";
  import { StorageUtils } from "@/utils/store.utils";
  import PageLoader from "@/components/loaders/pageLoader.vue";
  import E404Error from "@/components/errors/e404.error.vue";
import ContentParentProfil from "../_partials/contentParentProfil.vue";
  
  //   import IcIcons from "@/components/icons/IcIcons.vue";
  const route = useRoute();
  const router = useRouter();
  const isRefreshing = ref(false);
  
  const ProfilDetailParent = async () => {
    return await SettingServices().listSetting(
      URL_API_ROUTE.PARENT_FIND_ONE + "/" + route.params.id
    );
  };
  
  const {
    data: DataDetailParent,
    error: ErrorDetailParent,
    isLoading: LoadingDetailParent,
    isError: ISErrorDetailParent,
  refetch,
} = useQuery({
  queryKey: ["ProfilDetailParent", route.params.id],
  queryFn: ProfilDetailParent,
  enabled: computed(() => !!route.params.id), // Activer uniquement si GetProfil a une valeur
  retry: 2, // Réessayer en cas d'échec
  refetchOnWindowFocus: false, // Ne pas recharger les données lors du focus de la fenêtre
  });
  
  const Greeting = ref("Hello");

  // Handle pull-to-refresh
const handleRefresh = async (event: any) => {
  try {
    isRefreshing.value = true;
    await refetch(); // Trigger refetching of data
  } catch (error) {
    console.error("Error during refresh:", error);
  } finally {
    event.target.complete(); // Signal Ionic refresher to complete
    isRefreshing.value = false;
  }
};
  
  onMounted(() => {
    Greeting.value = GetGreetingUtils();
  });
  
  defineProps(["Type"]);
  </script>
  <style scoped></style>
  