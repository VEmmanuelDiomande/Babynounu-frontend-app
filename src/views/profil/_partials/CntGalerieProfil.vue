<template>
  <main class="relative">
    <div v-if="_DataGaleries?.length > 0">
      <section class="grid grid-cols-2 mb-8 gap-2">
        <div v-for="(img, index) in _DataGaleries" key="">
          <div class="w-full h-48">
            <img
              v-lazy="img.originalUrl"
              class="w-full h-full object-cover rounded-lg"
              alt=""
            />
          </div>
        </div>
      </section>
    </div>

    <ContentLoader v-if="LoadingGaleries" size="large" />

    <ContentEmpty
      v-else-if="_DataGaleries?.length == 0"
      nameIcons="RiGalleryLine"
      heading="Aucune images"
      subHeading="Aucune image disponible. Ajoutez des images, afin de mieux vous présenter !"
    />

    <ContentE404 v-if="ISErrorGaleries" />
  </main>
</template>

<script setup lang="ts">
import ContentE404 from "@/components/errors/contentE404.vue";
import ContentEmpty from "@/components/errors/contentEmpty.vue";
import E404Error from "@/components/errors/e404.error.vue";
import EmptyError from "@/components/errors/empty.error.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import ContentLoader from "@/components/loaders/contentLoader.vue";
import PageLoader from "@/components/loaders/pageLoader.vue";
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { StorageUtils } from "@/utils/store.utils";
import CardJob from "@/views/job/_partiels/cardJob.vue";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

defineProps(["DataGaleries"]);

const router = useRouter();

const GetUserId:any = ref("");

const fetchProfilGaleries = async () => {
  GetUserId.value = route.params.id
    ? route.params.id
    : (await StorageUtils().getStore("nProfil_1_Id")).value;
  return await SettingServices().listSetting(
    `${URL_API_ROUTE.MEDIA_GALLERY.replace(":userId", GetUserId.value)}`
  );
};

// Utilisation de Vue Query pour gérer la requête
const {
  data: _DataGaleries,
  error: ErrorGaleries,
  isLoading: LoadingGaleries,
  isError: ISErrorGaleries,
} = useQuery({
  queryKey: ["ListProfilGaleries", GetUserId.value],
  queryFn: fetchProfilGaleries,
  retry: 2, // Réessayer deux fois en cas d'échec
  refetchOnWindowFocus: false, // Ne pas recharger les données lors du focus de la fenêtre
});

const route = useRoute();

const btnGaleriee = ref([
  {
    name: "Voir le profil",
    icon: "RiUser3Line",
    bgColor: "bg-primary",
    action: (id: any) => {
      router.push({ name: "PROFIL_DETAIL", params: { id: id } });
    },
  },
  {
    name: "Echanger",
    icon: "RiMessage3Line",
    bgColor: "bg-indigo-500",
    action: () => {},
  },
]);
</script>
