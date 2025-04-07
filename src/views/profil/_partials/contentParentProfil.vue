<template>
  <IonPage>
    <HeaderMenuLayout
      v-if="useUserStore().isOwner != false"
      :Title="PARENT?.fullname"
      PlaceholderSearch="Rechercher..."
      :countScroll="0"
      :isNoSerach="true"
    />

    <ion-header class="shadow-none font-love" v-if="useUserStore().isOwner == false">
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
            {{ PARENT?.fullname }}
          </div>
        </div>
      </ion-toolbar>
    </ion-header>
    <IonContent
      class="font-love"
      :scroll-y="useAbonnementStore().iscroll(useUserStore().isOwner)"
      @ion-scroll="handleScroll($event)"
      :scroll-events="true"
      v-if="PARENT"
    >
      <!-- Banner -->

      <section class="flex flex-col gap-4 bg-primary rounded-b-3xl">
        <div class="flex justify-between items-center px-4 h-28">
          <div class="w-10/12 flex flex-col">
            <span class="text text-white font-love"> {{ Greeting }} </span>
            <div class="flex items-center gap-1">
              <span class="text-lg font-bold text-white">
                {{ PARENT.fullname }}
                <span class="" v-if="PARENT.age">({{ PARENT.age }} ans)</span>
              </span>
              <IcIcons
                name="RiVerifiedBadgeFill"
                :size="20"
                class="text-white"
              />
            </div>
          </div>
          <Avatar size="14" :src="PARENT.image?.originalUrl" shape="circle" />
        </div>
      </section>

      <!-- Content Buttons -->
      <CntBtnProfil :Data="PARENT" :isOwner="useUserStore().isOwner" type="parent" />

      <!-- Experience -->
      <section>
        <div class="grid grid-cols-2 gap-2 w-11/12 m-auto mb-8">
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

      <CntMenuProfil
        :MenuActive="MenuActive"
        @update:menu-active="MenuActive = $event"
        :Data="[1, 3, 4, 6]"
      />

      <main
        class="h-[800px] flex flex-col w-full  m-auto pt-4 pb-10"
        :class="BasculeInScroll == false ? ' overflow-auto ' : ''"
      >
        <!-- Informations -->
        <section class="flex flex-col w-full gap-6 px-4" v-show="MenuActive === 1">
          <CardInfoProfil
            v-for="(card, index) in cardData()"
            :key="index"
            :dataCardInfo="card.data"
            :type="card.type"
            :title="card.title"
          />
        </section>

        <!-- Jobs -->
        <section class="flex h-full w-full" v-show="MenuActive === 3">
          <JobParentProfil :isOwner="isOwner" />
        </section>

        <!-- Demandes -->
        <section class="px-4" v-show="MenuActive === 4">
          <CntDemandeProfil />
        </section>

        <!-- Biographie -->
        <section class="px-4" v-show="MenuActive === 6">
          <CntAboutProfil :Data="PARENT" />
        </section>
      </main>

      <CardAbonnementProfil
        :Data="{
          fullname: PARENT.fullname,
          year_experience: PARENT.year_experience,
        }"
        
      />
    </IonContent>

    {{ isOwner }}
  </IonPage>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { IonContent, IonPage } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import IcIcons from "@/components/icons/IcIcons.vue";
import Avatar from "@/components/avatars/avatar.vue";
import ActionProfilButton from "@/components/buttons/actionProfilButton.vue";
import CardInfoProfil from "./cardInfoProfil.vue";
import { GetGreetingUtils } from "@/utils/greeting.utils";
import { BASE_URL_CENTER } from "@/routes/_requests/index.request";
import { useUserStore } from "@/stores/user.store";
import MenuButtonHeader from "@/components/headers/MenuButtonHeader.vue";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import JobParentProfil from "./jobParentProfil.vue";
import { useAbonnementStore } from "@/stores/abonnementStore";
import ProfilHeader from "@/components/headers/ProfilHeader.vue";
import { useProfilStore } from "@/stores/authProfilStore";
import { useProfilParentHook } from "@/hooks/Profile/profilParent.hook";
import CardAbonnementProfil from "@/components/cards/abonnements/cardAbonnementProfil.vue";
import { useProfilHook } from "@/hooks/Profile/profil.hook";
import CntMenuProfil from "./cntMenuProfil.vue";
import CntBtnProfil from "./cntBtnProfil.vue";
import CntAboutProfil from "./cntAboutProfil.vue";
import CntDemandeProfil from "./cntDemandeProfil.vue";
import { StorageUtils } from "@/utils/store.utils";

// Props
const props = defineProps(["PARENT", ]);

const router = useRouter();
const isMainProfil = ref(true);
const MenuActive = ref(1);

const { cardData: _cardData, Experiences, Greeting } = useProfilParentHook();
const {
  isAbonnement: _isAbonnement,
  OpenEditProfil: _OpenEditProfil,
  OpenEchange: _OpenEchange,
  OpenToggleProfil: _OpenToggleProfil,
} = useProfilHook();

const cardData = () => _cardData(props);
const isAbonnement = () => _isAbonnement();

const BasculeInScroll = ref(true); // Scroll du premier IonContent activé par défaut

const handleScroll = (event: CustomEvent) => {
  const scrollTop = event.detail.scrollTop;
  console.log(scrollTop);
  if (scrollTop > 370) {
    BasculeInScroll.value = false;
  } else if (scrollTop < 370) {
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
});

// Chargement de l'ID du profil utilisateur depuis le stockage
onMounted(async () => {
  const storedProfil = await StorageUtils().getStore("nProfil_1_Id");
  GetProfil.value = storedProfil?.value || null;
});

// Lifecycle
onMounted(() => {
  Greeting.value = GetGreetingUtils();
});
</script>
