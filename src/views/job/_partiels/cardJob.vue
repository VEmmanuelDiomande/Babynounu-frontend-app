<template>
  <div class="grid grid-cols-1 gap-2 divide-y-[1px] font-love" v-if="JobData">
    <div
      v-for="(item, index) in JobData"
      :key="index"
      class="w-11/12 m-auto text-black flex flex-col gap-4 py-4"
    >
      <!-- En-tête : Photo et informations -->
      <RouterLink
        :to="{
          name: 'PROFIL_DETAIL_PARENT',
          params: { id: item?.user?.parent[0].id },
        }"
        class="flex items-center w-full"
        v-if="!isOwer && item?.user?.parent?.length != 0"
      >
        <div class="size-12 rounded-full overflow-hidden">
          <img
            v-lazy="item.image?.originalUrl"
            alt="Photo de {{ item.user?.parent[0]?.fullname }}"
            class="w-full h-full object-cover"
          />
        </div>

        <div
          class="flex justify-between gap-4 w-[calc(100%-55px)] text-zinc-700 ml-2"
        >
          <div class="flex flex-col gap-1 w-full">
            <div class="text-ng font-extrabold truncate w-auto">
              {{ item.user?.parent[0]?.fullname }}
            </div>
            <div class="text-xs opacity-70 truncate w-auto font-semibold">
              {{ item.preferences?.adress[0]?.name }} |
              {{ item.user?.parent[0]?.number_of_children }} enfants
            </div>
          </div>

          <div
            class="flex justify-center items-center w-[100px] h-8 text-xs mt-1 bg-red-500 text-white py-1 px-2 rounded-xl opacity-70 font-medium"
            v-if="item.missionUrgente"
          >
            <IcIcons name="RiAlarmWarningLine" :size="16" class="mr-1" />
            <span class="text-xs font-bold">Urgent</span>
          </div>
        </div>
      </RouterLink>

      <!-- Description et détails -->
      <div class="flex flex-col gap-1" @click="RedirectToJob(item)">
        <div>
          <span class="text-base opacity-80 font-bold line-clamp-3 mb-1">
            {{ item?.titre }}
          </span>
          <p class="text-sm opacity-70 font-medium line-clamp-3">
            {{ item?.descriptionComplementaire }}
          </p>
        </div>

        <!-- Informations complémentaires -->
         <div class=""  >
          <CardJobInfo :seedDataInfo="seedDataInfo(item)" />
         </div>
        
      </div>

      <div class="mt-2" v-if="isToApply">
        <div class="flex flex-row gap-1">
          <button
            class="flex items-center gap-1 px-2 py-2 text-white rounded-lg text-sm font-semibold"
            @click="mutate"
            v-if="!isOwer"
            :disabled="isPending"
            :class="
              item?.job_application[0]?.is_apply ? 'bg-gray-400' : 'bg-primary'
            "
          >
            <div class="flex w-full">
              <IcIcons name="RiCoinsFill" :size="16" />
              <span>
                {{
                  item?.job_application[0]?.is_apply
                    ? "Rétirer ma condidature"
                    : "Postuler maintenant"
                }}
              </span>
            </div>
            <SpinnerLoader
              size="small"
              classCustom="text-white"
              v-show="isPending"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import {
  BASE_URL_CENTER,
  URL_API_ROUTE,
} from "@/routes/_requests/index.request";
import { useAbonnementStore } from "@/stores/abonnementStore";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { StorageUtils } from "@/utils/store.utils";
import { SettingServices } from "@/services/setting.services";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import CardJobInfo from "./cardJobInfo.vue";

const props = defineProps(["JobData", "isOwer", "isToApply"]);

// Requête pour récupérer le détail d'un job
// Utilisation de TanStack Query pour gérer les requêtes
// et les erreurs
const CreateJobApplications = async () => {
  const settingServices = SettingServices();
  if (settingServices && settingServices.createSetting) {
    await settingServices.createSetting(URL_API_ROUTE.JOB_APPLICATION_CREATE, {
      is_apply: true,
      userId: (await StorageUtils().getStore("nUser_Id")).value,
      jobId: route.params.id,
    });
  }
};

const queryClient = useQueryClient(); // Accès au cache global
const { mutate, isPending, isError, error, isSuccess } = useMutation({
  mutationKey: ["create-job-applications"],
  mutationFn: CreateJobApplications,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["ListProfilToApplys"],
    });
  },
});

// Données simulées pour les icônes
// Données simulées pour les icônes
const seedDataInfo = (props: any) =>{
 return [
 
{
    icon: "RiCoinsFill",
    name: props.tarifPropose + " Fcfa",
  }, 
  {
    icon: "RiBriefcaseFill",
    name: props.preferences?.frequence_des_services[0]?.name,
  },
  {
    icon: "RiMapPin2Fill",
    name: props.preferences?.zone_de_travail[0]?.name,
  },
  {
    icon: "RiTimeFill",
    name: props.preferences?.horaire_souhaites[0]?.name,
  }
]
}

const router = useRouter();
const route = useRoute();

const OpenModelAbonnement = () => {
  const Modal = document.getElementById("open-modal-abonnement");
  Modal?.click();
};

const RedirectToJob = async (jobs: any) => {
  const nUser_Id = await StorageUtils().getStore("nUser_Id");
  console.log(useAbonnementStore().isAbonnement)
  if (jobs.user.id == nUser_Id.value  || useAbonnementStore().isAbonnement == true) {
    router.push(`/job/${jobs.id}`);
  } else {
    return useAbonnementStore().iscroll(jobs.user.id === nUser_Id.value)
      ? router.push(`/job/${jobs.id}`)
      : OpenModelAbonnement();
  }
};
</script>
