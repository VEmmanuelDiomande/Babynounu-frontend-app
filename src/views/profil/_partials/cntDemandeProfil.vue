<template>
  <main class="relative">
    <div v-if="!LoadingParentDemands && DataParentDemands?.length > 0"
      class="flex flex-col divide-y-[1px] rel divide-gray-300 font-love"
    >
      <div v-for="(item, index) in DataParentDemands" :key="index" class="pb-4">
        <div class="flex flex-col gap-2 pt-4">
          <div class="flex items-center gap-2">
            <div class="size-12 rounded-full bg-slate-200">
                <img v-lazy="item.image?.originalUrl" class="w-full h-full rounded-full object-cover" alt="">
            </div>

            <div class="w-[calc(100%-3rem)] flex flex-col gap-1">
              <span class="text-base font-semibold"> {{ item.user?.nounu[0]?.fullname }} </span>
              <span class="text-sm"
                >Age <strong>( {{ item.user?.nounu[0]?.age }} ans)</strong> | Experience
                <strong>{{ item.user?.nounu[0]?.annees_experience }} ans</strong>
              </span>
            </div>
          </div>

          <div class="">
            <span class="text-ng text-gray-700 line-clamp-2"
              >A postuler à votre offre,  <span class="underline underline-offset-2 font-semibold text-primary" >{{ item.jobs?.titre }}</span> </span
            >
          </div>

          <div class="flex flex-row gap-1">
            <div v-for="btn in btnDemande">
              <button
                @click="btn.action(item.user?.nounu[0]?.id)"
                class="flex items-center gap-1 px-2 py-2 text-white rounded-lg text-sm font-semibold"
                :class="btn.bgColor"
              >
                <IcIcons :name="btn.icon" :size="16" />
                <span>{{ btn.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ContentLoader v-if="LoadingParentDemands" size="large"  />

    <ContentEmpty 
      v-else-if="!LoadingParentDemands && DataParentDemands?.length == 0"
      nameIcons="RiUserLine"
      heading="Aucun candidate"
      subHeading="Aucun candidate disponible. Ajoutez une offre ! Avez-vous des offres de nounou ?"
    />

    <ContentE404 v-if="ISErrorParentDemands" />
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
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";


const fetchProfilParentDemands = async () => {
  return await SettingServices().listSetting(
    `${URL_API_ROUTE.JOB_APPLICATION_USER}/${(await StorageUtils().getStore("nUser_Id")).value}`
  );
};

// Utilisation de Vue Query pour gérer la requête
const {
  data: DataParentDemands,
  error: ErrorParentDemands,
  isLoading: LoadingParentDemands,
  isError: ISErrorParentDemands,
} = useQuery({
  queryKey: ["ListProfilParentDemands"],
  queryFn: fetchProfilParentDemands,
  retry: 2, // Réessayer deux fois en cas d'échec
  refetchOnWindowFocus: false, // Ne pas recharger les données lors du focus de la fenêtre
});

const router = useRouter();
const route = useRoute();

const btnDemande = ref([
  {
    name: "Voir le profil",
    icon: "RiUser3Line",
    bgColor: "bg-primary",
    action: (id:any) => {
        router.push({name: 'PROFIL_DETAIL', params: {id: id }})
    },
  },
  // {
  //   name: "Echanger",
  //   icon: "RiMessage3Line",
  //   bgColor: "bg-indigo-500",
  //   action: () => {},
  // },
]);
</script>
