<template>
  <IonPage>
    <IonContent>
      <!-- Refresher -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <PageLoader size="large" v-if="LoadingParent || isRefreshing" />
      <E404Error
        v-else-if="ISErrorParent"
        :nameIcons="'RiErrorWarningLine'"
        :heading="'Une erreur est survenue'"
      />

      <div v-else-if="DataParent">
        <ContentParentProfil :PARENT="DataParent" :isOwner="true" />
      </div>
      <EmptyError
        v-else
        :nameIcons="'RiUserLine'"
        :heading="'Une erreur est survenue'"
      />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { StorageUtils } from "@/utils/store.utils";
import { useQuery } from "@tanstack/vue-query";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ContentParentProfil from "../_partials/contentParentProfil.vue";
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
import PageLoader from "@/components/loaders/pageLoader.vue";
import { IonContent, IonPage } from "@ionic/vue";
import E404Error from "@/components/errors/e404.error.vue";
import EmptyError from "@/components/errors/empty.error.vue";

// Références pour les données du composant
const GetProfil = ref<string | null>(null);
const isOwner = computed(() => GetProfil.value === route.params.id);
const isRefreshing = ref(false);

// Instances de router et route
const router = useRouter();
const route = useRoute();

// Chargement de l'ID du profil utilisateur depuis le stockage
onMounted(async () => {
  const storedProfil = await StorageUtils().getStore("nProfil_1_Id");
  GetProfil.value = storedProfil?.value || null;

  if (!GetProfil.value) {
    // Rediriger vers la page d'authentification si aucun profil n'est trouvé
    router.push({ name: "SignAuth" });
  }
});

// Fonction pour récupérer les données du profil parent
const fetchProfilParent = async () => {
  if (!GetProfil.value) {
    throw new Error("Aucun ID de profil n'est défini.");
  }
  return await SettingServices().listSetting(
    `${URL_API_ROUTE.PARENT_FIND_ONE}/${GetProfil.value}`
  );
};

// Utilisation de Vue Query pour gérer la requête
const {
  data: DataParent,
  error: ErrorParent,
  isLoading: LoadingParent,
  isError: ISErrorParent,
  refetch,
} = useQuery({
  queryKey: ["ListProfilParentMe", GetProfil],
  queryFn: fetchProfilParent,
  enabled: computed(() => !!GetProfil.value), // Activer uniquement si GetProfil a une valeur
  retry: 2, // Réessayer en cas d'échec
  refetchOnWindowFocus: false, // Ne pas recharger les données lors du focus de la fenêtre
});

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
</script>

<style scoped>
.error {
  color: red;
}
</style>
