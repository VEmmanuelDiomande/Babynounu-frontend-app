<template>
  <IonPage>
    <!-- En-tête pour le propriétaire du profil -->
    <HeaderMenuLayout
      v-if="isOwnerProfile"
      :Title="PARENT?.fullname"
      PlaceholderSearch="Rechercher..."
      :countScroll="0"
      :isNoSerach="true"
      :hasFilter="true"
      :isProfil="true"
      :id_profil="PARENT?.id"
    />

    <!-- En-tête pour les visiteurs -->
    <ion-header
      class="shadow-none font-love"
      v-if="!isOwnerProfile"
    >
      <ion-toolbar
        color="white"
        class="border-b-[1px] shadow-none w-11/12 m-auto flex justify-between"
      >
        <ion-buttons slot="start">
          <div @click="$router.go(-1)">
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

    <!-- Contenu principal -->
    <IonContent
      class="font-love"
      :scroll-y="useAbonnementStore().iscroll(isOwnerProfile)"
      @ion-scroll="handleScroll"
      :scroll-events="true"
      v-if="PARENT"
    >
      <!-- Bannière de profil -->
      <section class="flex flex-col gap-4 rounded-b-3xl w-full">
        <div class="flex justify-between items-center px-4 py-4 h-auto">
          <div class="w-10/12 gap-4 flex flex-col">
            <div class="flex items-center gap-1">
              <span class="text-lg font-bold text-black">
                {{ PARENT.fullname }}
                <span v-if="PARENT.age">({{ PARENT.age }} ans)</span>
              </span>
              <IcIcons
                v-if="PARENT.certif === 'Approuved'"
                name="RiVerifiedBadgeFill"
                :size="20"
                class="text-primary"
              />
            </div>

            <!-- Points disponibles (visible uniquement pour le propriétaire) -->
            <div v-if="isOwnerProfile" class="flex items-center gap-2">
              <div class="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                <IcIcons name="RiCoinsFill" :size="16" class="text-primary" />
                <span class="text-sm font-semibold text-primary">
                  {{ PARENT?.points || 0 }} Points disponibles
                </span>
              </div>
            </div>

       
          </div>
          <Avatar 
            size="14" 
            :src="PARENT.image?.originalUrl" 
            shape="circle"
            :alt="`Photo de ${PARENT.fullname}`"
          />
        </div>
      </section>

      <!-- Statistiques (visible uniquement pour le propriétaire) -->
      <section v-if="isOwnerProfile" class="w-11/12 mx-auto my-2 hidden">
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-primary/10 rounded-lg p-3 flex flex-col items-center">
            <span class="text-2xl font-bold text-primary">{{ statsData.jobsPosted }}</span>
            <span class="text-xs text-gray-600">Offres publiées</span>
          </div>
          <div class="bg-green-100 rounded-lg p-3 flex flex-col items-center">
            <span class="text-2xl font-bold text-green-600">{{ statsData.applicationsReceived }}</span>
            <span class="text-xs text-gray-600">Candidatures</span>
          </div>
          <div class="bg-blue-100 rounded-lg p-3 flex flex-col items-center">
            <span class="text-2xl font-bold text-blue-600">{{ statsData.completedJobs }}</span>
            <span class="text-xs text-gray-600">Missions terminées</span>
          </div>
        </div>
      </section>

      <!-- Boutons d'action -->
      <CntBtnProfil
        :Data="PARENT"
        :isOwner="isOwnerProfile"
        type="parent"
      />

      <!-- Menu de navigation -->
      <CntMenuProfil
        :isOwner="isOwnerProfile"
        :MenuActive="MenuActive"
        @update:menu-active="MenuActive = $event"
        :Data="menuItems"
      />

      <!-- Contenu principal selon l'onglet sélectionné -->
      <main
        class="flex flex-col w-full m-auto pt-4 pb-10"
        :class="{
          'h-[800px]': true,
          'overflow-auto': !isScrollEnabled
        }"
      >
        <!-- Informations -->
        <section
          class="flex flex-col w-full gap-6 px-4"
          v-show="MenuActive === 1"
        >
          <CardInfoProfil
            v-for="(card, index) in cardData()"
            :key="index"
            :dataCardInfo="card.data"
            :type="card.type"
            :title="card.title"
          />
        </section>

        <!-- Statistiques détaillées (nouvel onglet) -->
        <section
          class="flex flex-col w-full gap-6 px-4"
          v-show="MenuActive === 2"
        >
          <div class="bg-white rounded-lg shadow-sm p-4">
            <h3 class="text-lg font-bold mb-4">Statistiques détaillées</h3>
            
            <!-- Graphique d'activité -->
            <div class="mb-6">
              <h4 class="text-md font-semibold mb-2">Activité mensuelle</h4>
              <div class="h-40 bg-gray-50 rounded-lg flex items-end justify-between p-2">
                <div v-for="(month, index) in statsData.monthlyActivity" :key="index" 
                     class="w-8 bg-primary hover:bg-primary/80 rounded-t-sm transition-all duration-200"
                     :style="`height: ${month.value}%; min-height: 4px;`">
                  <div class="text-xs text-center mt-2 transform -rotate-45 origin-left">{{ month.label }}</div>
                </div>
              </div>
            </div>
            
            <!-- Statistiques détaillées -->
            <div class="grid grid-cols-2 gap-4">
              <div class="border rounded-lg p-3">
                <div class="text-sm text-gray-500">Taux de réponse</div>
                <div class="text-xl font-bold">{{ statsData.responseRate }}</div>
              </div>
              <div class="border rounded-lg p-3">
                <div class="text-sm text-gray-500">Temps de réponse</div>
                <div class="text-xl font-bold">{{ statsData.responseTime }}</div>
              </div>
              <div class="border rounded-lg p-3">
                <div class="text-sm text-gray-500">Nounous engagées</div>
                <div class="text-xl font-bold">{{ statsData.hiredNounous }}</div>
              </div>
              <div class="border rounded-lg p-3">
                <div class="text-sm text-gray-500">Satisfaction</div>
                <div class="text-xl font-bold">{{ statsData.satisfactionRate }}</div>
              </div>
            </div>
          </div>
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

      <!-- Composant d'abonnement -->
      <CardAbonnementProfil
        v-if="!isOwnerProfile"
        :Data="{
          id: PARENT.id,
          fullname: PARENT.fullname,
          year_experience: PARENT.year_experience,
        }"
      />
    </IonContent>
  </IonPage>
  {{ GetDataProfil }}
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import IcIcons from "@/components/icons/IcIcons.vue";
import Avatar from "@/components/avatars/avatar.vue";
import CardInfoProfil from "./cardInfoProfil.vue";
import { GetGreetingUtils } from "@/utils/greeting.utils";
import { useUserStore } from "@/stores/user.store";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import JobParentProfil from "./jobParentProfil.vue";
import { useAbonnementStore } from "@/stores/abonnementStore";
import { useProfilParentHook } from "@/hooks/Profile/profilParent.hook";
import CardAbonnementProfil from "@/components/cards/abonnements/cardAbonnementProfil.vue";
import { useProfilHook } from "@/hooks/Profile/profil.hook";
import CntMenuProfil from "./cntMenuProfil.vue";
import CntBtnProfil from "./cntBtnProfil.vue";
import CntAboutProfil from "./cntAboutProfil.vue";
import CntDemandeProfil from "./cntDemandeProfil.vue";
import { StorageUtils } from "@/utils/store.utils";

// Interface pour les données de statistiques
interface StatsData {
  jobsPosted: number;
  applicationsReceived: number;
  completedJobs: number;
  responseRate: string;
  responseTime: string;
  hiredNounous: number;
  satisfactionRate: string;
  monthlyActivity: Array<{label: string, value: number}>;
}

// Props avec typage
const props = defineProps({
  PARENT: {
    type: Object,
    required: true
  }
});

// Stores et hooks
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// État local
const MenuActive = ref(1);
const isScrollEnabled = ref(true);
const profileId = ref<string | null>(null);

// Hooks pour les données du profil
const { cardData: _cardData, Experiences, Greeting } = useProfilParentHook();
const { isAbonnement } = useProfilHook();

// Données de statistiques (simulées pour l'instant)
const statsData = reactive<StatsData>({
  jobsPosted: 8,
  applicationsReceived: 24,
  completedJobs: 5,
  responseRate: '92%',
  responseTime: '3h',
  hiredNounous: 6,
  satisfactionRate: '4.7/5',
  monthlyActivity: [
    { label: 'Jan', value: 30 },
    { label: 'Fév', value: 45 },
    { label: 'Mar', value: 60 },
    { label: 'Avr', value: 40 },
    { label: 'Mai', value: 75 },
    { label: 'Juin', value: 65 }
  ]
});

// Computed properties
const isOwnerProfile = computed(() => userStore.isOwner);

const isOwner = computed(() => {
  userStore.isOwner = route.params.id
    ? route.params.id == profileId.value
    : true;
  return userStore.isOwner;
});

// Éléments du menu avec l'ajout de l'onglet Statistiques
const menuItems = computed(() => {
  const baseItems = [1, 3, 4, 6]; // Onglets de base
  
  // Ajouter l'onglet Statistiques (2) si l'utilisateur est le propriétaire
  if (isOwnerProfile.value) {
    return [1, 3, 4, 6];
  }
  
  return baseItems;
});

// Méthode pour gérer le défilement
const handleScroll = (event: CustomEvent) => {
  const scrollTop = event.detail.scrollTop;
  isScrollEnabled.value = scrollTop <= 370;
};

// Stockage des données du profil dans le store
const GetDataProfil = computed(() => {
  userStore.dataProfil = props.PARENT;
  return null; // Éviter l'affichage dans le template
});

// Fonction pour charger les statistiques (à implémenter avec votre API)
const loadStatistics = async (parentId: string) => {
  try {
    // Exemple de chargement de statistiques (à remplacer par votre appel API réel)
    // const response = await statisticsService.getParentStats(parentId);
    // Object.assign(statsData, response.data);
    
    // Pour l'instant, nous utilisons des données simulées
    console.log(`Chargement des statistiques pour le parent ID: ${parentId}`);
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques:", error);
  }
};

// Fonction pour générer les données des cartes d'information
const cardData = () => _cardData(props);

// Chargement des données au montage du composant
onMounted(async () => {
  // Récupérer l'ID du profil depuis le stockage
  const storedProfil = await StorageUtils().getStore("nProfil_1_Id");
  profileId.value = storedProfil?.value || null;
  
  // Définir le message de bienvenue
  Greeting.value = GetGreetingUtils();
  
  // Charger les statistiques si l'utilisateur est le propriétaire
  if (isOwnerProfile.value && profileId.value) {
    loadStatistics(profileId.value);
  }
});
</script>

<style scoped>
/* Styles pour les statistiques */
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* Animation pour les cartes de statistiques */
.grid-cols-3 > div, .grid-cols-2 > div {
  transition: transform 0.2s ease;
}

.grid-cols-3 > div:hover, .grid-cols-2 > div:hover {
  transform: translateY(-2px);
}

/* Style pour le graphique d'activité */
.bg-primary {
  background-color: var(--ion-color-primary);
}

.bg-primary\/10 {
  background-color: rgba(var(--ion-color-primary-rgb), 0.1);
}

.bg-primary\/80 {
  background-color: rgba(var(--ion-color-primary-rgb), 0.8);
}

/* Animation pour le graphique */
@keyframes growUp {
  from { height: 0%; }
  to { height: var(--target-height); }
}

.bg-primary.rounded-t-sm {
  animation: growUp 1s ease-out forwards;
  --target-height: attr(data-height);
}
</style>
