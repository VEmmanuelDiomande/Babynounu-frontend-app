<template>
  <IonPage>
    <IonContent class="font-love h-42 fixed" slot="fixed">
      <!-- Loader -->
      <PageLoader v-if="LoadingNounu" size="large" />

      <!-- Contenu principal -->

      <ContentProfil
        v-if="DataNounu"
        :DataNounu="DataNounu"
      />

      <!-- Gestion des erreurs -->
      <div v-else-if="!LoadingNounu && ISErrorNounu" class="text-center mt-8">
        <E404Error />
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import { IonContent, IonPage } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { ref, onMounted, computed } from "vue";

import ContentProfil from "./_partials/contentProfil.vue";
import PageLoader from "@/components/loaders/pageLoader.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { StorageUtils } from "@/utils/store.utils";
import E404Error from "@/components/errors/e404.error.vue";
import { useProfilStore } from "@/stores/authProfilStore";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import CntProfil from "./_partials/cntProfil.vue";

// Router
const route = useRoute();
const router = useRouter();

// Références et état
const GetProfil = ref<string | null>();

// Chargement de l'ID du profil utilisateur depuis le stockage
onMounted(async () => {
  const storedProfil = await StorageUtils().getStore("nProfil_1_Id");
  GetProfil.value = storedProfil?.value || null;
});

// Fonction pour récupérer les données du profil
const fetchProfilNounu = async () => {
  return await SettingServices().listSetting(
    `${URL_API_ROUTE.NOUNU_ALL}/${GetProfil.value}`
  );
};

// Utilisation de Vue Query pour gérer la requête
const {
  data: DataNounu,
  error: ErrorNounu,
  isLoading: LoadingNounu,
  isError: ISErrorNounu,
} = useQuery({
  queryKey: ["ListProfilNounuMe", GetProfil],
  queryFn: fetchProfilNounu,
  enabled: computed(() => !!GetProfil.value), // Activer uniquement si GetProfil a une valeur
  retry: 2, // Réessayer deux fois en cas d'échec
  refetchOnWindowFocus: false, // Ne pas recharger les données lors du focus de la fenêtre
});
</script>
