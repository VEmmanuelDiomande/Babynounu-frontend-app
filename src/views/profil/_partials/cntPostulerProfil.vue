<template>
    <main class="relative font-love">
      <div v-if="!LoadingToApplys && DataToApplys?.length > 0"
        class="flex flex-col divide-y-[1px] rel divide-gray-300 font-love"
      >
        <div class=" flex flex-col gap-2">
          <div v-for="(item, index) in DataToApplys" :key="index">
            <RouterLink :to="`/job/${item.jobs.id}`" class="w-full p-4 rounded-lg m-auto text-black flex flex-col gap-4 py-4 bg-gray-100">
              
              <div class="flex flex-col gap-2 py-2">
                <span class="text-base font-medium line-clamp-2 " >{{ item.jobs?.titre }}</span>
                <div class="flex justify-between items-center">
                  <span class="font-anton text-sm" > Tarif : {{ item.jobs?.tarifPropose }} </span>
                  <span class="text-sm font-medium">+ Voir Plus</span>
                </div>
              </div>

            </RouterLink>
          </div>
        </div>
      </div>
  
      <ContentLoader v-if="LoadingToApplys" size="large"  />
  
      <ContentEmpty 
        v-else-if="!LoadingToApplys && DataToApplys?.length == 0"
        nameIcons="RiBriefcaseLine"
        heading="Aucune offre postulée."
        subHeading="Vous n'avez pas encore postulé à une offre. Une opportunité pourrait vous intéresser."
      />
  
      <ContentE404 v-if="ISErrorToApplys" />
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
  
  
  const fetchProfilToApplys = async () => {
    return await SettingServices().listSetting(
      `${URL_API_ROUTE.JOB_APPLY_TO_BY_USER}/${(await StorageUtils().getStore("nUser_Id")).value}`
    );
  };
  
  // Utilisation de Vue Query pour gérer la requête
  const {
    data: DataToApplys,
    error: ErrorToApplys,
    isLoading: LoadingToApplys,
    isError: ISErrorToApplys,
  } = useQuery({
    queryKey: ["ListProfilToApplys"],
    queryFn: fetchProfilToApplys,
    retry: 2, // Réessayer deux fois en cas d'échec
    refetchOnWindowFocus: false, // Ne pas recharger les données lors du focus de la fenêtre
  });
  
  const router = useRouter();
  const route = useRoute();
  
  const btnToApplye = ref([
    {
      name: "Voir le profil",
      icon: "RiUser3Line",
      bgColor: "bg-primary",
      action: (id:any) => {
          router.push({name: 'PROFIL_DETAIL', params: {id: id }})
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
  