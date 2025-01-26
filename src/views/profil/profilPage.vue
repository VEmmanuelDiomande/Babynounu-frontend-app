<template>
  <IonPage>
    <IonContent class="font-love h-42 fixed" slot="fixed">
      <!-- Loader -->
      <PageLoader v-if="LoadingNounu" size="large" />

      <!-- Contenu principal -->
      <ContentProfil
        v-if="DataNounu"
        :DataNounu="DataNounu"
        :isOwner="isOwner"
      />

      <!-- Gestion des erreurs -->
      <div v-else-if="ISErrorNounu" class="text-center mt-8 text-red-500">
        Une erreur est survenue lors du chargement du profil. Veuillez réessayer plus tard.
      </div>

      <!-- Aucun contenu disponible -->
      <div v-else class="text-center mt-8">
        Profil introuvable ou indisponible.
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

// Router
const route = useRoute();
const router = useRouter();

// Références et état
const GetProfil = ref<string | null>(null);
const isOwner = computed(() => GetProfil.value === route.params.id);

// Chargement de l'ID du profil utilisateur depuis le stockage
onMounted(async () => {
  const storedProfil = await StorageUtils().getStore("nProfil_1_Id");
  GetProfil.value = storedProfil?.value || null;

  if (!GetProfil.value) {
    // Rediriger vers la page de connexion si aucun profil n'est trouvé
    router.push({ name: "SignAuth" });
  }
});

// Fonction pour récupérer les données du profil
const fetchProfilNounu = async () => {
  if (!GetProfil.value) {
    throw new Error("Aucun ID de profil n'est défini.");
  }
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
