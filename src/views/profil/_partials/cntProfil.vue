<template>
  <IonPage>
    <!-- En-tête pour le propriétaire du profil -->
    <HeaderMenuLayout
      v-if="useUserStore().isOwner"
      :Title="Data.fullname"
      :data="Data"
      PlaceholderSearch="Rechercher..."
      :countScroll="0"
      :isNoSerach="true"
    />

    <!-- En-tête pour les visiteurs -->
    <ion-header class="shadow-none font-love" v-if="!useUserStore().isOwner">
      <div
        class="border-b-[1px] h-12 items-center shadow-none w-full px-2 m-auto flex justify-between"
      >
        <ion-buttons slot="start">
          <div @click="$router.go(-1)">
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
      </div>
    </ion-header>

    <!-- Contenu principal -->
    <IonContent
      class="font-love"
      :scroll-y="useAbonnementStore().iscroll(useUserStore().isOwner)"
      @ion-scroll="handleScroll($event)"
      :scroll-events="true"
    >
      <!-- Section Profil -->
      <section class="w-11/12 m-auto py-4">
        <div class="flex flex-col w-full">
          <!-- En-tête du profil avec photo -->
          <div class="flex flex-row justify-between gap-4">
            <div class="flex flex-col gap-2">
              <div
                class="flex bg-zinc-400 size-16 rounded-full overflow-hidden"
              >
                <img
                  v-lazy="
                    Data.image?.originalUrl || '/assets/default-avatar.png'
                  "
                  class="rounded-full h-full w-full object-cover"
                  :alt="`Photo de ${Data?.fullname || 'profil'}`"
                />
              </div>
              <div class="flex flex-col">
                <span class="flex flex-row font-semibold text-xl">
                  {{ Data?.fullname }}
                  <IcIcons
                    v-if="Data.certif === 'Approuved'"
                    name="RiVerifiedBadgeFill"
                    :size="28"
                    class="text-primary mx-1"
                  />
                  {{ Data.age ? `(${Data.age} ans)` : `` }}
                </span>
                <span v-if="isOwner" class="font-anton text-sm opacity-50">
                  {{ Data?.points }} Points disponibles
                </span>
              </div>

              <!-- Informations principales -->
              <div class="flex flex-row items-center gap-2 mt-2">
                <span class="flex items-center font text-base font-semibold">
                  {{ Data.annees_experience }} Expérience
                </span>
                <span class="font text-base font-semibold">|</span>
                <div class="flex gap-1 items-center">
                  <span class="font text-base font-semibold">
                    {{
                      new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "XOF",
                      }).format(Number(Data.tarif_horaire))
                    }}
                  </span>
                  <span class="text-sm font-love italic"> .Hrs </span>
                </div>
              </div>

              <!-- Biographie courte -->
              <div>
                <span class="font-love text-sm line-clamp-3 mt-2">
                  {{ Data.courte_biographie }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Statistiques (Nouvelle section) -->
      <section class="w-11/12 m-auto mb-4 hidden">
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-primary/10 rounded-lg p-3 flex flex-col items-center">
            <span class="text-2xl font-bold text-primary">{{
              statsData.missions || 0
            }}</span>
            <span class="text-xs text-gray-600">Missions</span>
          </div>
          <div class="bg-green-100 rounded-lg p-3 flex flex-col items-center">
            <span class="text-2xl font-bold text-green-600">{{
              statsData.completedMissions || 0
            }}</span>
            <span class="text-xs text-gray-600">Terminées</span>
          </div>
          <div class="bg-blue-100 rounded-lg p-3 flex flex-col items-center">
            <span class="text-2xl font-bold text-blue-600">{{
              statsData.rating || "0.0"
            }}</span>
            <span class="text-xs text-gray-600">Note</span>
          </div>
        </div>
      </section>

      <!-- Boutons d'action -->
      <CntBtnProfil :Data="Data" :isOwner="isOwner" type="nounu" />

      <!-- Alerte de statut du profil -->
      <div
        v-if="shouldShowStatusAlert"
        :class="[
          'w-11/12 mx-auto my-4 p-4 border rounded-lg shadow-sm',
          Data.certif === 'Rejected'
            ? 'bg-red-50 border-red-200'
            : 'bg-yellow-50 border-yellow-200',
        ]"
      >
        <div class="flex items-center gap-3">
          <IcIcons
            :name="getStatusIcon"
            :size="24"
            :class="getStatusIconClass"
            class="flex-shrink-0"
          />
          <div class="flex flex-col">
            <span :class="getStatusTextClass" class="font-medium">
              {{ getStatusTitle }}
            </span>
            <span :class="getStatusSubtextClass" class="text-sm">
              {{ getStatusMessage }}
            </span>
          </div>
        </div>

        <!-- Bouton d'action selon le statut -->
        <RouterLink
          v-if="Data.certif === 'Rejected'"
          :to="{
            name: 'PROFIL_DOCUMENT',
            query: { userId: Data.user.id, nounuId: Data.id },
          }"
          class="mt-3 w-full flex justify-center"
        >
          <button
            class="px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700"
          >
            <IcIcons name="RiFileListLine" :size="18" />
            Vérifier mes documents
          </button>
        </RouterLink>
        <div v-else class="mt-3 w-full flex justify-center">
          <button
            disabled
            class="px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 bg-yellow-100 text-yellow-700 opacity-75 cursor-not-allowed"
          >
            <IcIcons name="RiTimeLine" :size="18" />
            Documents en attente
          </button>
        </div>
      </div>

      <!-- Menu de navigation -->
      <CntMenuProfil
        :isOwner="isOwner"
        :MenuActive="MenuActive"
        @update:menu-active="MenuActive = $event"
        :Data="menuItems"
      />

      <!-- Contenu principal selon l'onglet sélectionné -->
      <main
        class="flex flex-col w-full px-4 m-auto py-4"
        :class="{ 'overflow-auto': !BasculeInScroll, 'h-[800px]': true }"
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

        <!-- Statistiques (Nouvel onglet) -->
        <section v-show="MenuActive === 3" class="h-full flex flex-col gap-6">
          <div class="bg-white rounded-lg shadow-sm p-4">
            <h3 class="text-lg font-bold mb-4">Statistiques détaillées</h3>

            <!-- Graphique des missions -->
            <div class="mb-6">
              <h4 class="text-md font-semibold mb-2">Activité mensuelle</h4>
              <div
                class="h-40 bg-gray-50 rounded-lg flex items-end justify-between p-2"
              >
                <div
                  v-for="(month, index) in statsData.monthlyActivity || []"
                  :key="index"
                  class="w-8 bg-primary hover:bg-primary/80 rounded-t-sm transition-all duration-200"
                  :style="`height: ${month.value}%; min-height: 4px;`"
                >
                  <div
                    class="text-xs text-center mt-2 transform -rotate-45 origin-left"
                  >
                    {{ month.label }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Statistiques détaillées -->
            <div class="grid grid-cols-2 gap-4">
              <div class="border rounded-lg p-3">
                <div class="text-sm text-gray-500">Taux de réponse</div>
                <div class="text-xl font-bold">
                  {{ statsData.responseRate || "0%" }}
                </div>
              </div>
              <div class="border rounded-lg p-3">
                <div class="text-sm text-gray-500">Temps de réponse</div>
                <div class="text-xl font-bold">
                  {{ statsData.responseTime || "0h" }}
                </div>
              </div>
              <div class="border rounded-lg p-3">
                <div class="text-sm text-gray-500">Missions terminées</div>
                <div class="text-xl font-bold">
                  {{ statsData.completedMissions || 0 }}
                </div>
              </div>
              <div class="border rounded-lg p-3">
                <div class="text-sm text-gray-500">Heures travaillées</div>
                <div class="text-xl font-bold">
                  {{ statsData.hoursWorked || 0 }}h
                </div>
              </div>
            </div>
          </div>
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

      <!-- Composant d'abonnement -->
      <CardAbonnementProfil
        :Data="{
          id: Data.id,
          fullname: Data.fullname,
          year_experience: Data.annees_experience,
        }"
      />
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, reactive } from "vue";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import IcIcons from "@/components/icons/IcIcons.vue";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import CardInfoProfil from "./cardInfoProfil.vue";
import { useAbonnementStore } from "@/stores/abonnementStore";
import CardAbonnementProfil from "@/components/cards/abonnements/cardAbonnementProfil.vue";
import { useUserStore } from "@/stores/user.store";
import CntMenuProfil from "./cntMenuProfil.vue";
import CntBtnProfil from "./cntBtnProfil.vue";
import CntAboutProfil from "./cntAboutProfil.vue";
import CntPostulerProfil from "./cntPostulerProfil.vue";
import CntGalerieProfil from "./CntGalerieProfil.vue";
import { StorageUtils } from "@/utils/store.utils";
import { useConversationHook } from "@/hooks/messagerieHooks/conversation.hook";

// Interface pour les données de statistiques
interface StatsData {
  missions: number;
  completedMissions: number;
  rating: string;
  responseRate: string;
  responseTime: string;
  hoursWorked: number;
  monthlyActivity: Array<{ label: string; value: number }>;
}

// Props
const props = defineProps({
  Greeting: String,
  Data: {
    type: Object,
    required: true,
  },
  cardData: {
    type: Function,
    required: true,
  },
  OpenEditProfil: Function,
  OpenEchange: Function,
  OpenGalery: Function,
  isAbonnement: Boolean,
  isOwner: Boolean,
});

// État local
const router = useRouter();
const route = useRoute();
const BasculeInScroll = ref(true);
const MenuActive = ref(1);
const GetProfil = ref<string | null>(null);

// Données de statistiques (simulées pour l'instant)
const statsData = reactive<StatsData>({
  missions: 12,
  completedMissions: 8,
  rating: "4.8",
  responseRate: "95%",
  responseTime: "2h",
  hoursWorked: 120,
  monthlyActivity: [
    { label: "Jan", value: 30 },
    { label: "Fév", value: 45 },
    { label: "Mar", value: 60 },
    { label: "Avr", value: 40 },
    { label: "Mai", value: 75 },
    { label: "Juin", value: 65 },
  ],
});

// Éléments du menu avec l'ajout de l'onglet Statistiques
const menuItems = computed(() => {
  const baseItems = [1, 2, 5, 6]; // Onglets de base

  // Ajouter l'onglet Statistiques (3) si l'utilisateur est le propriétaire
  if (props.isOwner) {
    return [1, 2, 5, 6];
  }

  return baseItems;
});

// Computed properties pour l'alerte de statut
const shouldShowStatusAlert = computed(() => {
  return (
    (props.Data.certif === "Rejected" || props.Data.certif === "Pending") &&
    useUserStore().isOwner
  );
});

const getStatusIcon = computed(() => {
  return props.Data.certif === "Rejected" ? "RiErrorWarningLine" : "RiTimeLine";
});

const getStatusIconClass = computed(() => {
  return props.Data.certif === "Rejected" ? "text-red-500" : "text-yellow-500";
});

const getStatusTextClass = computed(() => {
  return props.Data.certif === "Rejected" ? "text-red-700" : "text-yellow-700";
});

const getStatusSubtextClass = computed(() => {
  return props.Data.certif === "Rejected" ? "text-red-600" : "text-yellow-600";
});

const getStatusTitle = computed(() => {
  return props.Data.certif === "Rejected"
    ? "Profil rejeté"
    : "Profil en attente";
});

const getStatusMessage = computed(() => {
  return props.Data.certif === "Rejected"
    ? "Désolé, votre profil a été rejeté. Veuillez vérifier vos documents."
    : "Votre profil est en cours de vérification. Veuillez patienter.";
});

// Méthode pour gérer le défilement
const handleScroll = (event: CustomEvent) => {
  const scrollTop = event.detail.scrollTop;
  BasculeInScroll.value = scrollTop <= 190;
};

// Stockage des données du profil dans le store
const GetDataProfil = computed(() => {
  useUserStore().dataProfil = props.Data;
  return null; // Éviter l'affichage dans le template
});

// Chargement des données au montage du composant
onMounted(async () => {
  const storedProfil = await StorageUtils().getStore("nProfil_1_Id");
  GetProfil.value = storedProfil?.value || null;

  // Ici, vous pourriez charger les statistiques réelles depuis une API
  // loadStatistics(props.Data.id);
});

// Méthode pour charger les statistiques (à implémenter avec votre API)
const loadStatistics = async (profileId: number) => {
  try {
    // Exemple de chargement de statistiques (à remplacer par votre appel API réel)
    // const response = await statisticsService.getProfileStats(profileId);
    // Object.assign(statsData, response.data);
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques:", error);
  }
};

// Récupération de la fonction de conversation
const { GetAllConversations } = useConversationHook();
</script>

<style scoped>
/* Styles pour les statistiques */
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

/* Animation pour les cartes de statistiques */
.grid-cols-3 > div {
  transition: transform 0.2s ease;
}

.grid-cols-3 > div:hover {
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
</style>
