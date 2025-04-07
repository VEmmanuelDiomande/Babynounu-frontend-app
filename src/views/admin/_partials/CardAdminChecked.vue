<template>
  <div class="flex flex-col ">
    <div class="flex pt-4 font-love text-black" v-if="data?.id">
    <RouterLink
      :to="{ name: 'PROFIL_DETAIL', params: { id: data.id } }"
      class="flex flex-col w-full gap-2 w-full text-zinc-900"
    >
      <div class="flex w-full gap-2">
        <!-- La photo -->
        <div class="flex w-calc(100%-32px)">
          <img
            v-lazy="data.images[0]?.originalUrl"
            class="rounded-full size-8"
            alt=""
          />
        </div>

        <!-- Le contexte -->
        <div class="w-full flex flex-col gap-1">
          <span class="text-base font-black"> {{ data.fullname }} </span>
          <span class="text-base">
            exp ({{ data.annees_experience }} ans) &#8226; âge ({{ data.age }}
            ans)
          </span>

          <div class="flex">
            <span class="text-sm text-gray-700 line-clamp-2">
              {{ data.tarif_horaire }} CFA/Heure &#8226;
              {{ data.tarif_mensuel }} CFA/Mois
            </span>
          </div>
        </div>
      </div>

      
    </RouterLink>

    <div class="flex flex-col gap-1 ">
      <div v-for="(item, index) in BtnAdminActions" :key="index">
        <button
          @click="item.actions(data, index)"
          class="text-white font-bold text-sm rounded-lg py-2 px-3"
          :class="item.color"
        >
          <SpinnerLoader v-if="item.loading" />
          <IcIcons :name="item.icon" :size="18" class="text-white" />
        </button>
      </div>
    </div>
  </div>
  <!-- Les documents -->
  <div class="flex gap-2 ml-8"  @click="RedirectViewMedia(data)">
        <div v-for="(item, index) in data.documents" :key="index" >
          <img v-lazy="item.originalUrl" class="rounded-md size-16" alt="" />
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";
import { reactive } from "vue";
import { Dialer } from "capacitor-dialer";
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
import { useRouter } from "vue-router";
import { useMediaStore } from "@/stores/mediaStore";


const router = useRouter();

const { data, updateValidation } = defineProps(["data", "updateValidation"]);

const BtnAdminActions = reactive([
  {
    icon: "RiCheckLine",
    title: "Valider",
    color: "bg-secondary",
    loading: false,
    actions: async (data: any, index: any) => {
      BtnAdminActions[index].loading = true;
      await updateValidation(data.id);
      BtnAdminActions[index].loading = false;
    },
  },
  {
    icon: "RiPhoneLine",
    title: "Contactez",
    color: "bg-primary",
    loading: false,
    actions: (data: any) => {
      Dialer.openDialer({ phoneNumber: data.phone });
    },
  },
]);


const RedirectViewMedia = (data: any) => {
  useMediaStore().state.mediaDocuments = data.documents;
  if(data?.id) router.push({ name: "AdminMediaDetail", params: { id: data.id ?? "" } });
    
}


</script>
