<template>
  <ion-page class="min-h-screen bg-gray-50 font-love">
    <!-- Header avec bouton retour -->
    <ion-header class="bg-white shadow-sm">
      <ion-toolbar class="px-4">
        <ion-buttons slot="start">
          <ion-button @click="router.back()" class="text-gray-800">
            <IcIcons name="RiArrowLeftLine" :size="24" />
          </ion-button>
        </ion-buttons>
        <ion-title class="text-lg font-bold text-gray-900"
          >Mission Acceptée</ion-title
        >
      </ion-toolbar>
    </ion-header>

    <ion-content class="pb-20 font-love">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center h-full">
        <ion-spinner name="crescent"></ion-spinner>
      </div>

      <!-- Error state -->
      <div v-else-if="isError" class="max-w-md mx-auto px-4 py-6">
        <div
          class="bg-white rounded-xl shadow-xs border border-gray-100 p-6 text-center"
        >
          <IcIcons
            name="RiErrorWarningFill"
            :size="48"
            class="text-red-500 mx-auto mb-4"
          />
          <h2 class="font-bold text-lg mb-2">Erreur de chargement</h2>
          <p class="text-gray-600 mb-4">
            Nous n'avons pas pu charger les détails de la mission.
          </p>
          <ion-button @click="refetch" fill="outline">Réessayer</ion-button>
        </div>
      </div>

      <!-- Success state -->
      <div v-else class="max-w-md mx-auto px-4">
        <!-- Bannière de confirmation -->
        <!-- Bannière dynamique selon le statut -->
        <div
          v-if="missionData?.status === 'Accepted'"
          class="bg-green-50 rounded-xl p-6 mb-6 flex items-start border border-green-100"
        >
          <div class="mr-4 text-green-500">
            <IcIcons name="RiCheckboxCircleFill" :size="32" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-1">
              Mission confirmée !
            </h2>
            <p class="text-gray-600">
              Votre candidature a été acceptée par la famille.
            </p>
          </div>
        </div>

        <div
          v-else-if="missionData?.status === 'Pending'"
          class="bg-blue-50 rounded-xl p-6 mb-6 flex items-start border border-blue-100"
        >
          <div class="mr-4 text-blue-500">
            <IcIcons name="RiTimeFill" :size="32" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-1">
              En attente de réponse
            </h2>
            <p class="text-gray-600">
              La mission a été confirmée par la famille, mais elle est en attente de la confirmation de présence par la nounou.
            </p>
          </div>
        </div>

        <div
          v-else-if="missionData?.status === 'Canceled'"
          class="bg-red-50 rounded-xl p-6 mb-6 flex items-start border border-red-100"
        >
          <div class="mr-4 text-red-500">
            <IcIcons name="RiCloseCircleFill" :size="32" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-1">
              Mission annulée
            </h2>
            <p class="text-gray-600">Cette mission a été annulée.</p>
          </div>
        </div>

        <!-- Carte mission -->
        <div
          class="bg-white rounded-xl shadow-xs border border-gray-100 mb-6 overflow-hidden"
        >
          <div class="p-6">
            <h3 class="flex items-center text-lg font-bold text-gray-900 mb-4">
              <IcIcons
                name="RiCalendarTodoLine"
                :size="20"
                class="text-indigo-500 mr-2"
              />
              Détails de la mission
            </h3>

            <div class="space-y-4">
              <div class="flex hidden">
                <div class="text-gray-400 mr-4">
                  <IcIcons name="RiCalendarLine" :size="20" />
                </div>
                <div>
                  <p class="text-sm text-gray-500">Date</p>
                  <p class="font-medium">
                    {{ formatDate(missionData?.startTime) }}
                  </p>
                </div>
              </div>

              <div class="flex">
                <div class="text-gray-400 mr-4">
                  <IcIcons name="RiTimeLine" :size="20" />
                </div>
                <div>
                  <p class="text-sm text-gray-500">Normbre de jours</p>
                  <p class="font-medium">
                    {{ JSON.parse(missionData?.message.content)?.duration }}
                  </p>
                </div>
              </div>

              <div class="flex hidden">
                <div class="text-gray-400 mr-4">
                  <IcIcons name="RiMapPinLine" :size="20" />
                </div>
                <div>
                  <p class="text-sm text-gray-500">Adresse</p>
                  <p class="font-medium">{{ missionData?.address }}</p>
                  <p class="text-indigo-500 text-sm mt-1 flex items-center">
                    <IcIcons name="RiRoadsterLine" :size="16" class="mr-1" />
                    {{ calculateDistance(missionData?.location) }} km
                  </p>
                </div>
              </div>

              <div class="flex">
                <div class="text-gray-400 mr-4">
                  <IcIcons name="RiMoneyDollarCircleLine" :size="20" />
                </div>
                <div>
                  <p class="text-sm text-gray-500">Rémunération</p>
                  <p class="font-medium text-green-600">
                    {{
                      formatPrice(
                        JSON.parse(missionData?.message.content)?.price
                      )
                    }}
                    Fcfa
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            class="px-6 py-4 hidden bg-gray-50 border-t border-gray-100 flex justify-between items-center"
          >
            <div class="flex items-center text-amber-500">
              <IcIcons name="RiAlarmWarningLine" :size="16" class="mr-2" />
              <span class="text-sm">{{
                getTimeRemaining(missionData?.startTime)
              }}</span>
            </div>
            <button
              class="text-indigo-500 text-sm font-medium flex items-center"
            >
              <IcIcons name="RiMapPin2Line" :size="16" class="mr-1" />
              Voir carte
            </button>
          </div>
        </div>

        <!-- Carte famille -->
        <div
          class="bg-white rounded-xl shadow-xs border border-gray-100 mb-24 p-6"
        >
          <h3 class="flex items-center text-lg font-bold text-gray-900 mb-4">
            <IcIcons
              name="RiUserHeartLine"
              :size="20"
              class="text-indigo-500 mr-2"
            />
            <span> {{ isAdmin ? "Votre Famille" : "Votre Nounu" }} </span>
          </h3>

          <div class="flex items-center mb-4">
            <div class="relative mr-4">
              <img
                v-lazy="
                  isAdmin
                    ? missionData?.photoParent.originalUrl
                    : missionData?.photoNounou.originalUrl
                "
                class="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div
                class="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full"
              >
                <IcIcons name="RiCheckLine" :size="12" />
              </div>
            </div>
            <div>
              <h4 class="font-bold text-gray-900">
                {{
                  !isAdmin
                    ? missionData.room?.nounou.fullname
                    : missionData.room?.parent.fullname
                }}
              </h4>
              <div class="flex items-center mt-1">
                <div class="flex text-amber-400">
                  <IcIcons
                    name="RiStarFill"
                    :size="16"
                    v-for="i in Math.round(missionData?.family?.rating || 0)"
                    :key="i"
                  />
                </div>
                <span class="text-gray-500 text-sm ml-2"
                  >{{
                    missionData?.family?.rating?.toFixed(1) || "0.0"
                  }}/5</span
                >
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button
              @click="callFamily"
              class="flex items-center justify-center py-3 bg-indigo-50 rounded-lg text-indigo-600 font-medium"
            >
              <IcIcons name="RiPhoneLine" :size="18" class="mr-2" />
              Appeler
            </button>

            <button
              @click="messageFamily"
              class="flex items-center justify-center py-3 bg-gray-50 rounded-lg text-gray-700 font-medium"
            >
              <IcIcons name="RiMessage2Line" :size="18" class="mr-2" />
              Message
            </button>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- Actions fixes -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg"
    >
      <div class="max-w-md mx-auto flex gap-3">
        <button
        v-if="isAdmin"
          @click="_confirmMission"
          :disabled="isConfirming || missionData?.status === 'Cancelled'"
          class="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-lg flex items-center justify-center disabled:opacity-50"
        >
          <template v-if="!isConfirming">
            <IcIcons name="RiCheckLine" :size="20" class="mr-2" />
            Confirmer
          </template>
          <template v-else>
            <ion-spinner name="crescent" class="mr-2"></ion-spinner>
            Confirmation...
          </template>
        </button>
        <button
          @click="showCancelModal = true"
          class="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg"
        >
          Annuler
        </button>
      </div>
    </div>

    <!-- Modal d'annulation -->
    <ion-modal
      :is-open="showCancelModal"
      @didDismiss="showCancelModal = false"
      class="auto-height"
    >
      <div class="bg-white rounded-t-3xl p-6 font-love">
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <IcIcons
              name="RiErrorWarningLine"
              :size="32"
              class="text-red-500"
            />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            Annuler la mission ?
          </h3>
          <p class="text-gray-600">
            Vous êtes sur le point d'annuler cette mission. Cette action peut
            affecter votre notation.
          </p>
        </div>

        <div class="space-y-3">
          <button
            @click="_cancelMission"
            :disabled="isCanceling"
            class="w-full py-3 bg-red-500 font-love text-white font-medium rounded-lg flex items-center justify-center disabled:opacity-50"
          >
            <template v-if="!isCanceling">
              <IcIcons name="RiCloseLine" :size="20" class="mr-2" />
              Confirmer l'annulation
            </template>
            <template v-else>
              <ion-spinner name="crescent" class="mr-2"></ion-spinner>
              Annulation...
            </template>
          </button>
          <button
            @click="showCancelModal = false"
            class="w-full py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonModal,
  IonSpinner,
} from "@ionic/vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  fetchMission,
  confirmMission,
  cancelMission,
} from "@/services/contract.services";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const route = useRoute();
const showCancelModal = ref(false);
const queryClient = useQueryClient();
const { toRole } = useAuthStore();

// Get mission ID from route params
const missionId = computed(() => route.params.id as string);
const isAdmin = computed(() => toRole === "admin" || toRole === "nounu");

onMounted(() => {});

// Fetch mission data
const {
  data: missionData,
  isLoading,
  isError,
  error,
  refetch,
} = useQuery({
  queryKey: ["mission", missionId],
  queryFn: () => fetchMission(missionId.value),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// Mutation for confirming mission
const { mutate: confirmMissionMutation, isLoading: isConfirming } = useMutation(
  {
    mutationFn: () => confirmMission(missionId.value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
      showAlert("Succès", "Mission confirmée avec succès");
    },
    onError: (error: any) => {
      showAlert("Erreur", "Échec de la confirmation de la mission");
    },
  }
);

// Mutation for canceling mission
const { mutate: cancelMissionMutation, isLoading: isCanceling } = useMutation({
  mutationFn: () => cancelMission(missionId.value),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["mission", missionId] });
    showCancelModal.value = false;
    showAlert("Succès", "Mission annulée avec succès");
    router.back();
  },
  onError: (error: any) => {
    showAlert("Erreur", "Échec de l'annulation de la mission");
  },
});

const callFamily = () => {
  if (missionData.value?.room) {
    const phone = !isAdmin.value
      ? missionData.value.room.nounou.phone
      : missionData.value?.room.parent.phone;
    window.open(`tel:${phone}`);
  }
};

const messageFamily = () => {
  if (missionData.value?.message) {
    const RoomId = missionData.value?.message.room.id;
    router.push({ name: "CHAT_MESSAGE_DETAIL", params: { id: RoomId } });
  }
};

const _confirmMission = () => {
  confirmMissionMutation();
};

const _cancelMission = () => {
  cancelMissionMutation();
};

const showAlert = async (title: string, message: string) => {
  const alert = document.createElement("ion-alert");
  alert.header = title;
  alert.message = message;
  alert.buttons = ["OK"];
  document.body.appendChild(alert);
  await alert.present();
};

// Utility functions
const formatDate = (dateString?: string) => {
  if (!dateString) return "Date non spécifiée";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTimeRange = (startTime?: string, endTime?: string) => {
  if (!startTime || !endTime) return "Horaire non spécifié";
  const start = new Date(startTime);
  const end = new Date(endTime);
  return `${start.getHours().toString().padStart(2, "0")}:${start
    .getMinutes()
    .toString()
    .padStart(2, "0")} - ${end.getHours().toString().padStart(2, "0")}:${end
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const formatPrice = (price?: number) => {
  if (!price) return "0";
  return price.toLocaleString("fr-FR");
};

const calculateDistance = (location?: { lat: number; lng: number }) => {
  // Simplified distance calculation - replace with real implementation
  if (!location) return 0;
  return (Math.random() * 10).toFixed(1);
};

const getTimeRemaining = (startTime?: string) => {
  if (!startTime) return "Date non spécifiée";
  const now = new Date();
  const start = new Date(startTime);
  const diffInDays = Math.floor(
    (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays <= 0) return "Commence aujourd'hui";
  if (diffInDays === 1) return "Commence demain";
  return `Commence dans ${diffInDays} jours`;
};
</script>

<style scoped>
.auto-height {
  --height: auto;
  --border-radius: 24px 24px 0 0;
}

.shadow-xs {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
</style>
