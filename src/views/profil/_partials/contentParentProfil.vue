<template>
  <IonPage>
    <HeaderMenuLayout
      v-if="isOwner != false"
      :Title="PARENT?.fullname"
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
            {{ PARENT?.fullname }}
          </div>
        </div>
      </ion-toolbar>
    </ion-header>
    <IonContent
      class="font-love"
      :scroll-y="isOwner != true ? false : true"
      v-if="PARENT"
    >
      <!-- Banner -->
      <section class="flex flex-col gap-4 bg-primary rounded-b-3xl">
        <div class="flex justify-between items-center px-4 pt-4 pb-12 h-32">
          <div class="w-10/12 flex flex-col">
            <span class="text text-white font-love"> {{ Greeting }} </span>
            <div class="flex items-center gap-1">
              <span class="text-lg font-bold text-white">
                {{ PARENT.fullname }} <span class="" v-if="PARENT.old">({{ PARENT.old }} ans)</span>
              </span>
              <IcIcons
                name="RiVerifiedBadgeFill"
                :size="20"
                class="text-white"
              />
            </div>
          </div>
          <Avatar size="10" :src="PARENT.photo" shape="circle" />
        </div>
      </section>

      <!-- Content Buttons -->
      <section
        class="grid grid-cols-2 gap-1 w-11/12 m-auto mt-2 relative bottom-8"
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
            :icon="!isMainProfil ? 'RiUserLine' : 'RiBriefcaseLine'"
            sizeText="medium"
            :setcolor="!isMainProfil ? 'bg-zinc-800 text-lg' : 'bg-indigo-500'"
            :title="!isMainProfil ? 'Profil' : 'Jobs'"
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

       

        <div class="flex flex-col gap-8 mb-8">
             <!-- Biography -->
        <section class="flex w-11/12 m-auto flex-col mt-8 gap-4">
          <div class="flex">
            <span class="text-sm text-zinc-600 font-anton">Biographie</span>
          </div>
          <article class="flex flex-col text-sm gap-2 whitespace-wrap">
            {{ PARENT.description }}
          </article>
        </section>
          <CardInfoProfil
            v-for="(card, index) in cardData"
            :key="index"
            :dataCardInfo="card.data"
            :type="card.type"
            :title="card.title"
          />
        </div>
      </main>

      <main class="flex flex-col w-full m-auto" v-show="!isMainProfil">
        <div class="flex border-b-2 pb-2 hidden">
      <span class="text-ng font-love font-semibold text-zinc-800"> Mes Offres d'emploi </span>
    </div>

    <JobParentProfil :JobData="5" />
      </main>

      <div
        v-if="!isOwner"
        class="fixed bottom-0 w-full bg-gradient-to-t from-white to-white/80 z-50 pt-8 px-4 font-love"
      >
        <div class="flex flex-col gap-1 p-4">
          <div class="flex flex-col gap-2 justify-center text-center">
            <span class="text-lg font-bold">Abonnement</span>
            <span class="text-sm">
              Abonnez-vous pour voir davantage d'informations sur
              <strong>{{ PARENT.fullname }}</strong
              >, {{ PARENT.year_experience }} ans d'expérience, Profil(vérifiés)
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
  </IonPage>
  <AbonnementProfilModal />
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
import JobParentProfil from "./jobParentProfil.vue";

const router = useRouter();
const isMainProfil = ref(true);

// Props
const props = defineProps(["PARENT", "isOwner"]);

const Experiences = ref([
  { name: "Contracts", count: 0, color: "bg-primary", icon: "RiServiceFill" },
  { name: "Visites", count: 0, color: "bg-secondary", icon: "RiEye2Fill" },
]);

// Cards Information
const cardData = ref([
  {
    data: props.PARENT.settingSpecificSkills,
    type: "skill",
    title: "Compétences que je recherches",
  },
  {
    data: props.PARENT.settingLanguages,
    type: "language",
    title: "Les langues que je parle",
  },
  {
    data: props.PARENT.settingAreaWorks,
    type: "area",
    title: "Zones d'intervention",
  },
  {
    data: props.PARENT.settingDesiredTimes,
    type: "time",
    title: "Heures préférées pour les enfants",
  },
  {
    data: props.PARENT.settingAgeOfChildrens,
    type: "AgeOfChildrens",
    title: "Ages de mes enfants",
  },
  {
    data: props.PARENT.settingHouseKeepers,
    type: "Housekeepers",
    title: "Infos sur les dames de ménage",
  },
]);

const OpenModelAbonnement = () => {
  const Modal = document.getElementById("open-modal-abonnement");
  Modal?.click();
};

const Greeting = ref("");

// Lifecycle
onMounted(() => {
  Greeting.value = GetGreetingUtils();
});
</script>
