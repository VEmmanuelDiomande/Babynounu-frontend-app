<template>
  <CntProfil
    :Greeting="Greeting"
    :Data="DataNounu"
    :cardData="cardData"
    :OpenEditProfil="OpenEditProfil"
    :OpenGalery="OpenGalery"
    :isAbonnement="isAbonnement()"
    :isOwner="isOwner"
  />
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { IonContent, IonPage } from "@ionic/vue";
import { useRouter } from "vue-router";
import { GetGreetingUtils } from "@/utils/greeting.utils";
import { BASE_URL_CENTER } from "@/routes/_requests/index.request";
import { useProfilNounuHook } from "@/hooks/Profile/profilNounu.hook";
import { useProfilHook } from "@/hooks/Profile/profil.hook";
import CntProfil from "./cntProfil.vue";
import { useUserStore } from "@/stores/user.store";

const router = useRouter();
const isMainProfil = ref(true);
let isVerity = ref(false);
// Props
const props = defineProps(["DataNounu"]);

const {
  Greeting,
  Experiences,
  Functionality,
  cardData: _cardData,
} = useProfilNounuHook();
const {
  isAbonnement: _isAbonnement,
  OpenEditProfil: _OpenEditProfil,
  OpenEchange: _OpenEchange,
  OpenToggleProfil: _OpenToggleProfil,
  OpenGalery: _OpenGalery,
  OpenModelAbonnement,
} = useProfilHook();

const cardData = () => _cardData(props);
const OpenEditProfil = () => _OpenEditProfil(props.DataNounu, "nounu");
const OpenGalery = () => _OpenGalery(props, isMainProfil);
const isAbonnement = () => _isAbonnement();

// Lifecycle
onMounted(() => {
  Greeting.value = GetGreetingUtils();
});

const isOwner = computed(() => {
  return useUserStore().isOwner;
});
</script>
