<template>
  <ion-page class="font-love">
    <ion-header>
      <ion-toolbar class="bg-indigo-600 text">
        <div class="flex px-4">
          <IcIcons
            @click="$router.go(-1)"
            :size="24"
            name="RiArrowLeftLine"
            class="text-black/90"
          />
          <ion-title class="text-black font-anton text-lg"
            >Mon Abonnement</ion-title
          >
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-gray-50 font-love">
      <IonRefresher
        slot="fixed"
        @ionRefresh="refetch()"
        :pullFactor="0.5"
        :pullMin="100"
        :pullMax="200"
      >
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      <PageLoader
        class-custom="h-[100vh] fixed inset-0"
        size="large"
        v-if="isLoading"
      />

      <!-- Success state -->
      <div
        v-else-if="subscriptionData && subscriptionData?.id"
        class="max-w-md mx-auto py-6 px-4"
      >
        <!-- Carte d'abonnement actuel -->
        <div
          class="bg-gradient-to-r from-zinc-800 to-zinc-600 rounded-2xl shadow-lg overflow-hidden mb-6 text-white"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="font-bold text-xl">
                  {{ subscriptionData?.planName || "Abonnement Premium" }}
                </h2>
                <p class="text-indigo-100 text-sm mt-1">
                  {{
                    subscriptionData?.description ||
                    "Accès complet à toutes les fonctionnalités"
                  }}
                </p>
              </div>
              <span
                class="bg-secondary/50 px-3 py-1 rounded-full text-xs font-semibold"
              > 
                {{ subscriptionData?.isActived ? "Actif" : "Inactif" }}
              </span>
            </div>

            <div class="flex items-center justify-between mt-6">
              <div>
                <p class="text-indigo-100 text-sm">Prochain renouvellement</p>
                <p class="font-medium">
                  {{ formatDate(subscriptionData?.paiement?.createdAt) }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-indigo-100 text-sm">Prix</p>
                <p class="font-medium">
                  {{ subscriptionData?.paiement?.amount + ' F/Mois' || "5.000 F / mois" }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="bg-white/10 p-4 flex justify-between items-center"
            v-if="subscriptionData?.paiement?.paymentMethod"
          >
            <span class="text-sm"
              >Moyens de paiement
              {{ subscriptionData?.paiement?.paymentMethod }}</span
            >
            <IcIcons name="RiBankCardFill" :size="24" class="text-white" />
          </div>
        </div>

        <!-- Avantages de l'abonnement -->
        <div class="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div class="p-4 border-b border-gray-100">
            <h2 class="font-semibold text-lg text-gray-800">Vos avantages</h2>
          </div>
          <ion-list lines="none" class="font-love">
            <ion-item v-for="benefit in benefits" :key="benefit">
              <IcIcons
                slot="start"
                name="RiCheckboxCircleFill"
                :size="20"
                class="text-green-500"
              />
              <span class="text-gray-700 font-love">{{ benefit }}</span>
            </ion-item>
          </ion-list>
        </div>

        <!-- Options d'abonnement -->
        <div
          class="bg-white rounded-xl shadow-sm mb-6 hidden overflow-hidden font-love"
        >
          <div class="p-4 border-b border-gray-100">
            <h2 class="font-semibold text-lg text-gray-800">Options</h2>
          </div>
          <ion-list lines="none">
            <ion-item button detail>
              <IcIcons
                slot="start"
                name="RiBillFill"
                :size="20"
                class="text-primary"
              />
              <span class="font-love">Historique des paiements</span>
            </ion-item>
            <ion-item button detail>
              <IcIcons
                slot="start"
                name="RiBankCardFill"
                :size="20"
                class="text-primary"
              />
              <span class="font-love">Méthode de paiement</span>
            </ion-item>
            <ion-item button detail @click="openChangePlanModal" class="font-love hidden">
              <IcIcons
                slot="start"
                name="RiSwapBoxFill"
                :size="20"
                class="text-primary"
              />
              <span class="font-love">Changer d'abonnement</span>
            </ion-item>
          </ion-list>
        </div>

        <!-- Bouton de résiliation -->
        <div class="text-center">
          <ion-button
            fill="clear"
            color="warning"
            size="small"
            @click="showCancelConfirm"
            class="font-semibold text-red-500"
            :desisabled="!subscriptionData?.isActived"
            :class="{
              'pointer-events-none opacity-20': !subscriptionData?.isActived,
            }"
          >
            <IcIcons name="RiCloseCircleFill" :size="18" class="mr-2" />
            Résilier mon abonnement
          </ion-button>
        </div>

        <!-- Modal pour changer d'abonnement -->
        <ion-modal
          :is-open="changePlanModalOpen"
          @didDismiss="changePlanModalOpen = false"
        >
          <div class="p-4">
            <h2 class="text-xl font-bold mb-4">Changer d'abonnement</h2>
            <p class="mb-4">Choisissez votre nouvel abonnement:</p>
            <div class="space-y-3">
              <ion-item button @click="selectPlan('basic')">
                <IcIcons
                  slot="start"
                  name="RiLeafFill"
                  :size="20"
                  class="text-green-500"
                />
                <span>
                  <h3>Basique</h3>
                  <p>Gratuit - Fonctionnalités limitées</p>
                </span>
              </ion-item>
              <ion-item button @click="selectPlan('premium')">
                <IcIcons
                  slot="start"
                  name="RiStarFill"
                  :size="20"
                  class="text-yellow-500"
                />
                <span>
                  <h3>Premium</h3>
                  <p>9,99€/mois - Accès complet</p>
                </span>
              </ion-item>
              <ion-item button @click="selectPlan('family')">
                <IcIcons
                  slot="start"
                  name="RiGroupFill"
                  :size="20"
                  class="text-primary"
                />
                <span>
                  <h3>Famille</h3>
                  <p>14,99€/mois - Jusqu'à 5 utilisateurs</p>
                </span>
              </ion-item>
            </div>
            <ion-button
              expand="block"
              color="medium"
              @click="changePlanModalOpen = false"
              class="mt-4"
            >
              <IcIcons name="RiCloseLine" :size="18" class="mr-2" />
              Annuler
            </ion-button>
          </div>
        </ion-modal>
      </div>

      <EmptyError
        v-else-if="subscriptionData && subscriptionData?.id"
        nameIcons="RiNotificationLine"
        heading="Aucune abonnement"
        subHeading="Aucune abonnement disponible. Veuillez contacter un administrateur !"
      />
      <E404Error v-else="isError" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonModal,
  IonSpinner,
  alertController,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  fetchSubscription,
  cancelSubscription,
  changeSubscriptionPlan,
} from "@/services/subscrible.services";
import { StorageUtils } from "@/utils/store.utils";
import PageLoader from "@/components/loaders/pageLoader.vue";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import EmptyError from "@/components/errors/empty.error.vue";
import { s } from "vitest/dist/reporters-5f784f42";
import E404Error from "@/components/errors/e404.error.vue";

// Fetch subscription data
const {
  data: subscriptionData,
  isLoading,
  isError,
  error,
  refetch,
} = useQuery({
  queryKey: ["subscription"],
  queryFn: async () =>
    fetchSubscription((await StorageUtils().getStore("nUser_Id")).value),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

const queryClient = useQueryClient();

// Mutation for canceling subscription
const { mutate: cancelSub } = useMutation({
  mutationFn: cancelSubscription(subscriptionData?.id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["subscription"] });
    showAlert("Succès", "Votre abonnement a été résilié avec succès.");
  },
  onError: (error: any) => {
    showAlert(
      "Erreur",
      "Une erreur est survenue lors de la résiliation de votre abonnement."
    );
  },
});

// Mutation for changing plan
const { mutate: changePlan } = useMutation({
  mutationFn: changeSubscriptionPlan,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["subscription"] });
    showAlert("Succès", "Votre abonnement a été modifié avec succès.");
    changePlanModalOpen.value = false;
  },
  onError: (error: any) => {
    showAlert(
      "Erreur",
      "Une erreur est survenue lors du changement de votre abonnement."
    );
  },
});

const benefits = ref([
  "Profil recommandé (nounu)",
  "Messagerie illimitée",
  "Recherche illimitée",
  "Contact direct VIP",
  "Consultations profils illimitées",
  "Accès premium aux demandes",
  "Assistance personnalisée",
  "Profils vérifiés",
  "Creation d'offre illimitées",
  "Postule au offre illimitées (nounu)",
  "2 points de disponibilité (nounu)",
  "2 points de recrutement (parent)",
  "Support 24/7",
]);

const changePlanModalOpen = ref(false);

const openChangePlanModal = () => {
  changePlanModalOpen.value = true;
};

const selectPlan = (plan: string) => {
  changePlan(plan);
};

const showCancelConfirm = async () => {
  const alert = await alertController.create({
    header: "Résilier votre abonnement",
    message: "Êtes-vous sûr de vouloir résilier votre abonnement premium?",
    buttons: [
      {
        text: "Annuler",
        role: "cancel",
      },
      {
        text: "Confirmer",
        handler: () => {
          cancelSub();
        },
      },
    ],
  });
  await alert.present();
};

const showAlert = async (title: string, message: string) => {
  const alert = await alertController.create({
    header: title,
    message: message,
    buttons: ["OK"],
  });
  await alert.present();
};
const formatDate = (dateString?: string) => {
  const date = dateString ? new Date(dateString) : new Date();
  date.setDate(date.getDate() + 30);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
</script>

<style scoped>
/* Your existing styles */
</style>
