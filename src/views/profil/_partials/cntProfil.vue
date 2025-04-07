<template>
  <IonPage>
    <HeaderMenuLayout
      v-if="useUserStore().isOwner"
      :Title="Data.fullname"
      PlaceholderSearch="Rechercher..."
      :countScroll="0"
      :isNoSerach="true"
    />
    <ion-header
      class="shadow-none font-love"
      v-if="useUserStore().isOwner == false"
    >
      <ion-toolbar
        color="white"
        class="border-b-[1px] shadow-none w-11/12 m-auto flex justify-between"
      >
        <ion-buttons slot="start">
          <div @click="$router.go(-1)" v-if="useUserStore().isOwner == false">
            <IcIcons name="RiArrowLeftLine" :size="24" class="text-zinc-800" />
          </div>
        </ion-buttons>
        <div class="flex justify-center w-full">
          <div class="font-love text-lg font-bold text-center truncate w-32">
            {{ Data?.fullname }}
          </div>
        </div>
        <ion-buttons slot="end" class="flex gap-2">
          <RouterLink
            :to="{ name: 'NOTIFICATIONS' }"
            v-if="useUserStore().isLogged"
          >
            <div
              class="border-[1px] h-8 gap-1 px-2 flex items-center border-primary/50 justify-center z-40 rounded-full"
            >
              <IcIcons
                name="RiNotification2Line"
                :size="18"
                class="text-primary"
              />
            </div>
          </RouterLink>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Premier IonContent pour la section principale -->
    <IonContent
      class="font-love"
      :scroll-y="useAbonnementStore().iscroll(useUserStore().isOwner)"
      @ion-scroll="handleScroll($event)"
      :scroll-events="true"
    >
      <!-- Section Profil -->
      <section class="w-11/12 m-auto py-4">
        <div class="flex flex-col w-full">
          <div class="flex flex-row justify-between gap-4">
            <div class="flex flex-col w-[calc(100%-100px)] gap-2">
              <div class="flex">
                <span class="flex flex-row font-semibold text-xl"
                  >{{ Greeting }} : {{ Data?.fullname }}
                  {{ Data.age ? `(${Data.age} ans)` : `` }} 
                </span>
                
              </div>
            </div>
            <div class="flex bg-zinc-400 size-16 rounded-full">
              <img
                v-lazy="Data.image?.originalUrl"
                class="rounded-full h-full w-full"
                alt=""
              />
            </div>
          </div>
          <div class="flex flex-row items-center gap-2">
            <span class="flex items-center font text-base font-semibold">
              <IcIcons v-if="Data.certif"
                  name="RiVerifiedBadgeFill"
                  :size="28"
                  class="text-primary"
                />
              {{ Data.annees_experience }} Experience
            </span>
            <span class="font text-base font-semibold">|</span>
            <span class="font text-base font-semibold">
              {{ Data.tarif_horaire }} CFA/Heure
            </span>
            
            <!-- <CntAvailableProfil v-if="useUserStore().isOwner" /> -->
          </div>
          <div>
            <span class="font-love text-sm line-clamp-3 mt-2">
              {{ Data.courte_biographie }}
            </span>
          </div>
        </div>
      </section>

      <!-- Content Buttons -->
      <CntBtnProfil
        :Data="Data"
        :isOwner="useUserStore().isOwner"
        type="nounu"
      />
      <!-- 
      <button @click="GetAllConversations(Data.user?.id)"  class="px-6 py-3 bg-secondary text-white rounded-lg" >Echanger Test</button> -->

      <CntMenuProfil
        :MenuActive="MenuActive"
        @update:menu-active="MenuActive = $event"
        :Data="[1, 2, 5, 6]"
      />

      <!-- Espace réservé pour le contenu principal -->

      <main
        class="h-[800px] flex flex-col w-full px-4 m-auto py-4"
        :class="BasculeInScroll == false ? ' overflow-auto ' : ''"
      >
        <!-- Informations -->
        <section v-show="MenuActive === 1" class="h-full flex flex-col gap-6">
          <CardInfoProfil
            v-for="(card, index) in cardData()"
            :key="index"
            :dataCardInfo="card.data"
            :type="card.type"
            :title="card.title"
          />
        </section>

        <!-- Galerie -->
        <section v-show="MenuActive === 2">
          <CntGalerieProfil :DataGaleries="Data.gallery" />
        </section>

        <!-- Postuler -->
        <section v-show="MenuActive === 5">
          <CntPostulerProfil />
        </section>

        <!-- Biographie -->
        <section v-show="MenuActive === 6">
          <CntAboutProfil :Data="Data" />
        </section>
      </main>

      <!-- Deuxième IonContent pour le contenu spécifique (Profil) -->

      <CardAbonnementProfil
        :Data="{
          fullname: Data.fullname,
          year_experience: Data.year_experience,
        }"
      />
    </IonContent>
  </IonPage>
  {{ isOwner }}
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTabBar,
} from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import IcIcons from "@/components/icons/IcIcons.vue";
import { GetGreetingUtils } from "@/utils/greeting.utils";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import { useProfilNounuHook } from "@/hooks/Profile/profilNounu.hook";
import { useProfilHook } from "@/hooks/Profile/profil.hook";
import ActionProfilButton from "@/components/buttons/actionProfilButton.vue";
import CardInfoProfil from "./cardInfoProfil.vue";
import { useAbonnementStore } from "@/stores/abonnementStore";
import CardAbonnementProfil from "@/components/cards/abonnements/cardAbonnementProfil.vue";
import ProfilGalleryPage from "../profilGalleryPage.vue";
import { useUserStore } from "@/stores/user.store";
import Heading2Text from "@/components/texts/heading2Text.vue";
import { formatDate } from "@/utils/date.utils";
import CntMenuProfil from "./cntMenuProfil.vue";
import CntBtnProfil from "./cntBtnProfil.vue";
import CntAboutProfil from "./cntAboutProfil.vue";
import CntPostulerProfil from "./cntPostulerProfil.vue";
import CntGalerieProfil from "./CntGalerieProfil.vue";
import { StorageUtils } from "@/utils/store.utils";
import { useConversationHook } from "@/hooks/messagerieHooks/conversation.hook";
import CntAvailableProfil from "./cntAvailableProfil.vue";

const router = useRouter();
const props = defineProps([
  "Greeting",
  "Data",
  "cardData",
  "OpenEditProfil",
  "OpenEchange",
  "OpenGalery",
  "isAbonnement",
]);

const BasculeInScroll = ref(true); // Scroll du premier IonContent activé par défaut
const MenuActive = ref(1); // Par défaut, le premier onglet est actif

const handleScroll = (event: CustomEvent) => {
  const scrollTop = event.detail.scrollTop;
  console.log(scrollTop);
  if (scrollTop > 190) {
    BasculeInScroll.value = false;
  } else if (scrollTop < 190) {
    BasculeInScroll.value = true;
  }
};

const route = useRoute();
const GetProfil = ref<string | null>();
const isOwner = computed(() => {
  useUserStore().isOwner = route.params.id
    ? route.params.id == GetProfil.value
      ? true
      : false
    : true;

  console.log(useUserStore().isOwner);
});

// Chargement de l'ID du profil utilisateur depuis le stockage
onMounted(async () => {
  const storedProfil = await StorageUtils().getStore("nProfil_1_Id");
  GetProfil.value = storedProfil?.value || null;
});

const { GetAllConversations } = useConversationHook();
</script>
