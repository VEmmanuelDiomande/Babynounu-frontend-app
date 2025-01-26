<template>
  <IonPage>
    <HeaderMenuLayout
      v-if="isOwner != false"
      :Title="DataNounu.fullname"
      PlaceholderSearch="Rechercher..."
      :countScroll="0"
      :isNoSerach="true"
    />
    <ion-header class="shadow-none font-love" v-if="isOwner == false">
      <ion-toolbar
        color="white"
        class="border-b-[1px] shadow-none w-11/12 m-auto flex justify-between"
      >
        <ion-buttons slot="start">
          <div @click="$router.go(-1)" v-if="isOwner == false">
            <IcIcons name="RiArrowLeftLine" :size="24" class="text-zinc-800" />
          </div>
        </ion-buttons>
        <div class="flex justify-center w-full">
          <div class="font-love text-lg font-bold text-center truncate w-32">
            {{ DataNounu.fullname }}
          </div>
        </div>
      </ion-toolbar>
    </ion-header>
    <IonContent
      class="font-love"
      :scroll-y="isOwner != true ? false : true"
      v-if="DataNounu"
    >
      <!-- Banner -->
      <section class="flex flex-col gap-4 bg-primary rounded-b-3xl">
        <div class="flex justify-between items-center px-4 pt-4 pb-10 h-32">
          <div class="w-10/12 flex flex-col">
            <span class="text text-white font-love"> {{ Greeting }} </span>
            <div class="flex items-center gap-1">
              <span class="text-lg font-bold text-white">
                {{ DataNounu.fullname }} ({{ DataNounu.old }} ans)
              </span>
              <IcIcons
                name="RiVerifiedBadgeFill"
                :size="20"
                class="text-white"
              />
            </div>
          </div>
          <Avatar size="10" :src="DataNounu.photo" shape="circle" />
        </div>
      </section>

      <!-- Content Buttons -->
      <section
        class="grid grid-cols-2 gap-2 w-10/12 m-auto mt-4 relative bottom-8"
      >
        <ion-button id="open-modal-abonnement" class="hidden" expand="block"
          >Open</ion-button
        >

        <div @click="OpenModelAbonnement()" v-if="isOwner == false">
          <ActionProfilButton
            sizeText="medium"
            icon="RiMessage3Line"
            setcolor="bg-zinc-800 text-lg"
            title="Echanger"
          />
        </div>

        <div v-if="isOwner != false">
          <ActionProfilButton
            sizeText="medium"
            icon="RiEditLine"
            setcolor="bg-zinc-800 text-lg"
            title="Editer"
          />
        </div>
        <div @click="isMainProfil = !isMainProfil">
          <ActionProfilButton
            :icon="!isMainProfil ? 'RiUserLine' : 'RiGalleryLine'"
            sizeText="medium"
            :setcolor="!isMainProfil ? 'bg-zinc-800 text-lg' : 'bg-indigo-500'"
            :title="!isMainProfil ? 'Profil' : 'Galeries'"
          />
        </div>
      </section>

      <main class="flex flex-col" v-show="isMainProfil">
        <!-- Experience -->
        <section>
          <div class="grid grid-cols-2 gap-2 w-11/12 m-auto">
            <div
              v-for="(item, index) in Experiences"
              :key="index"
              class="text-white flex flex-col gap-6 px-4 rounded-xl h-36 justify-center font-love"
              :class="item.color"
            >
              <IcIcons :name="item.icon" :size="36" />
              <div class="flex flex-col gap-1">
                <span class="text-2xl font-anton">{{ item.count }}</span>
                <span class="font-love font-semibold">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Functionalities -->
        <section class="flex w-11/12 m-auto flex-col mt-8 gap-4">
          <div class="flex">
            <span class="text-ng text-zinc-700 font-anton"
              >Fonctionnalités</span
            >
          </div>
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="(item, index) in Functionality"
              :key="index"
              class="border-[1px] text-primary flex flex-col gap-6 items-center rounded-xl size-16 justify-center font-love"
            >
              <IcIcons :name="item.icon" :size="32" />
            </div>
          </div>
        </section>

        <!-- Biography -->
        <section class="flex w-11/12 m-auto flex-col mt-8 gap-4">
          <div class="flex">
            <span class="text-sm text-zinc-600 font-anton">Biographie</span>
          </div>
          <article class="flex text-sm flex-col gap-2 whitespace-wrap">
            {{ DataNounu.biographie }}
          </article>
        </section>

        <!-- Additional Information -->
        <section class="flex w-full m-auto flex-col mt-8 gap-8 mb-8">
          <CardInfoProfil
            v-for="(card, index) in cardData"
            :key="index"
            :dataCardInfo="card.data"
            :type="card.type"
            :title="card.title"
          />
        </section>
      </main>

      <main v-show="!isMainProfil">
        <section class="grid grid-cols-2 mx-4 mb-8 gap-2">
          <div v-for="(img, index) in DataNounu.media" key="">
            <div class="w-full h-48">
              <img
                :src="BASE_URL_CENTER + img.url"
                class="w-full h-full object-cover rounded-lg"
                alt=""
              />
            </div>
          </div>
        </section>
      </main>

      <div
        class="fixed bottom-0 w-full bg-gradient-to-t from-white to-white/80 z-50 pt-8 px-4 font-love"
      >
        <div class="flex flex-col gap-1 p-4">
          <div class="flex flex-col gap-2 justify-center text-center">
            <span class="text-lg font-bold">Abonnement</span>
            <span class="text-sm">
              Abonnez-vous pour voir davantage d'informations sur
              <strong>{{ DataNounu.fullname }}</strong
              >, {{ DataNounu.year_experience }} ans d'expérience,
              Profil(vérifiés)
            </span>
          </div>
          <div class="mt-2" @click="OpenModelAbonnement()">
            <ActionProfilButton
              sizeText="medium"
              icon="RiPaypalLine"
              setcolor="bg-zinc-800 text-lg"
              title="Souscrire"
            />
          </div>
        </div>
      </div>
    </IonContent>

    <AbonnementProfilModal />
  </IonPage>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { IonContent, IonPage } from "@ionic/vue";
import { useRouter } from "vue-router";
import IcIcons from "@/components/icons/IcIcons.vue";
import Avatar from "@/components/avatars/avatar.vue";
import ActionProfilButton from "@/components/buttons/actionProfilButton.vue";
import CardInfoProfil from "./cardInfoProfil.vue";
import { GetGreetingUtils } from "@/utils/greeting.utils";
import { BASE_URL_CENTER } from "@/routes/_requests/index.request";
import AbonnementProfilModal from "../abonnementProfilModal.vue";
import { useUserStore } from "@/stores/user.store";
import MenuButtonHeader from "@/components/headers/MenuButtonHeader.vue";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";

const router = useRouter();
const isMainProfil = ref(true);

// Props
const props = defineProps(["DataNounu", "isOwner"]);

// States
const Greeting = ref("");
const Experiences = ref([
  { name: "Missons", count: 0, color: "bg-primary", icon: "RiServiceFill" },
  { name: "Visites", count: 0, color: "bg-secondary", icon: "RiEye2Fill" },
]);
const Functionality = ref([
  { name: "Missions", icon: "RiServiceFill" },
  { name: "Visites", icon: "RiEye2Fill" },
  { name: "Alerte", icon: "RiAlarmWarningFill" },
  { name: "Récompenses", icon: "RiAwardFill" },
]);

// Cards Information
const cardData = ref([
  {
    data: props.DataNounu.settingSpecificSkills,
    type: "skill",
    title: "Compétences",
  },
  {
    data: props.DataNounu.settingLanguages,
    type: "language",
    title: "Langues",
  },
  {
    data: props.DataNounu.settingAreaWorks,
    type: "area",
    title: "Zones d'intervention",
  },
  {
    data: props.DataNounu.settingDesiredTimes,
    type: "time",
    title: "Heures préférées",
  },
  {
    data: props.DataNounu.settingAgeOfChildrens,
    type: "AgeOfChildrens",
    title: "Ages encadrés",
  },
]);

const OpenModelAbonnement = () => {
  const Modal = document.getElementById("open-modal-abonnement");
  Modal?.click();
};

// Lifecycle
onMounted(() => {
  Greeting.value = GetGreetingUtils();
});
</script>
