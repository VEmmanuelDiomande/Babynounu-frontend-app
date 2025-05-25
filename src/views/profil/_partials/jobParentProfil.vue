<template>
  <section class="flex flex-col">
    <div class="flex w-full mx-auto flex-col mb-8 gap-4 font-love">
      <!-- ✅ En-tête -->
      <div class="flex justify-between px-4" v-if="isOwner">
        <span class="text-lg font-anton"></span>
        <RouterLink
          :to="{ name: 'JOB_CREATE' }"
          class="rounded-xl text-ng font-anton text-secondary flex"
        >
          <IcIcons name="RiAddFill" />
          <span>Créer</span>
        </RouterLink>
      </div>

      <!-- ✅ Loader (si en cours de chargement) -->
      <ContentLoader v-if="LoadingUserJobs" classCustom="" size="large" />

      <!-- ✅ Liste des offres d'emploi -->
      <div class="flex flex-col" v-else-if="DataUserJobs && DataUserJobs.length > 0">
        <CardJob :JobData="DataUserJobs" :isOwner="isOwner" />
      </div>

      <!-- ✅ Aucune offre disponible -->
      <div
        v-else-if="!ErrorUserJobs"
        class="relative flex flex-col justify-center items-center "
      >
        <ContentEmpty
          nameIcons="RiBriefcaseLine"
          heading="Aucune offre d'emploi"
          subHeading="Ajoutez une offre d'emploi ! Afin de renforcer votre personnel de maison."
        />
      </div>

      <!-- ✅ Erreur de récupération des données -->
      <ContentE404 v-if="ErrorUserJobs" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { ref } from "vue";
import { RouterLink } from "vue-router";
import CardJob from "@/views/job/_partiels/cardJob.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { StorageUtils } from "@/utils/store.utils";
import ContentEmpty from "@/components/errors/contentEmpty.vue";
import ContentE404 from "@/components/errors/contentE404.vue";
import ContentLoader from "@/components/loaders/contentLoader.vue";

defineProps(["isOwner"]);

// ✅ Récupération de l'ID de l'utilisateur
const userId = ref<string | null>(null);
StorageUtils().getStore("nUser_Id").then((id) => (userId.value = id.value));

// ✅ Fetch des offres d'emploi de l'utilisateur
const ListUserJobs = async () => {
  if (!userId.value) throw new Error("User ID not found");
  return SettingServices().listSetting(`${URL_API_ROUTE.JOB_USER}/${userId.value}`);
};

// ✅ Utilisation de useQuery pour récupérer les données
const {
  data: DataUserJobs,
  error: ErrorUserJobs,
  isLoading: LoadingUserJobs,
} = useQuery({
  queryKey: ["UserJobs_1", userId],
  queryFn: ListUserJobs,
  // Active la requête uniquement si userId est disponible
});
</script>