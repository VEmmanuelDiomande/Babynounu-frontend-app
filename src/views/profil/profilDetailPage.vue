<template>
  <IonPage>
    <IonContent class="font-love fixed" slot="fixed">
      <!-- Banner -->
      <PageLoader v-if="LoadingNounu" />
      <ContentProfil :DataNounu="DataNounu" :isOwner="false" v-else />
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import Avatar from "@/components/avatars/avatar.vue";
import ActionProfilButton from "@/components/buttons/actionProfilButton.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { GetGreetingUtils } from "@/utils/greeting.utils";
import { IonContent, IonPage } from "@ionic/vue";
import { onMounted, ref } from "vue";
import PropositionJobParentProfil from "./_partials/propositionJobParentProfil.vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import CardInfoProfil from "./_partials/cardInfoProfil.vue";
import { StorageUtils } from "@/utils/store.utils";
import ContentProfil from "./_partials/contentProfil.vue";
import PageLoader from "@/components/loaders/pageLoader.vue";
import AbonnementProfilModal from "./abonnementProfilModal.vue";

//   import IcIcons from "@/components/icons/IcIcons.vue";
const route = useRoute();
const router = useRouter();

const ListProfilNounu = async () => {
  return await SettingServices().listSetting(
    URL_API_ROUTE.NOUNU_ALL + "/" + route.params.id
  );
};

const {
  data: DataNounu,
  error: ErrorNounu,
  isLoading: LoadingNounu,
  isError: ISErrorNounu,
} = useQuery({
  queryKey: ["ListProfilNounu"],
  queryFn: ListProfilNounu,
});

const Greeting = ref("Hello");
const Experiences = ref([
  {
    name: "Missons",
    count: 0,
    color: " bg-primary",
    icon: "RiServiceFill",
  },
  {
    name: "Visites",
    count: 0,
    color: " bg-secondary",
    icon: "RiEye2Fill",
  },
]);

const Functionality = ref([
  {
    name: "Missons",
    icon: "RiServiceFill",
  },
  {
    name: "Visites",
    icon: "RiEye2Fill",
  },
  {
    name: "Missons",
    icon: "RiAlarmWarningFill",
  },
  {
    name: "Visites",
    icon: "RiAwardFill",
  },
  {
    name: "Missons",
    icon: "RiParentFill",
  },
  {
    name: "Visites",
    icon: "RiEye2Fill",
  },
  {
    name: "Missons",
    icon: "RiServiceFill",
  },
  {
    name: "Visites",
    icon: "RiEye2Fill",
  },
]);

const categorieExperiences = [
  "Soins aux enfants",
  "Surveillance et sécurité",
  "Communication",
  "Éveil et éducation",
  "Qualités personnelles",
  "Connaissances supplémentaires",
];

onMounted(() => {
  Greeting.value = GetGreetingUtils();
});

defineProps(["Type"]);
</script>
<style scoped></style>
