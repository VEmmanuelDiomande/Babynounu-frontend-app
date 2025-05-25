<template>
  <ion-page>
    <ion-content class="bg-gray-50 font-love">
      <IonRefresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <IonRefresherContent />
      </IonRefresher>

      <HeaderMenuLayout
        Title="Listes des contrats"
        PlaceholderSearch="Rechercher dans contrats"
        :countScroll="scrollAdminCount"
      >
        <template v-slot:ContentSearchUp>
          <input
            type="text"
            placeholder="Rechercher..."
            class="h-11 outline-none font-love text-base w-full bg-transparent border-b border-gray-300 focus:border-primary"
            v-model="searchQueryAdminUser"
          />
        </template>
      </HeaderMenuLayout>

      <PageLoader
        class-custom="h-[100vh] fixed inset-0 z-50"
        size="large"
        v-if="isLoading"
      />

      <div v-if="isError && !isLoading" class="p-4 text-red-500 text-center">
        <ion-icon :icon="alertCircleOutline" class="text-4xl mb-2"></ion-icon>
        <p>Erreur lors du chargement des contrats:</p>
        <p class="text-sm">{{ error?.message }}</p>
        <ion-button fill="outline" @click="refetchContracts" class="mt-4">
          Réessayer
        </ion-button>
      </div>

      <div  class="p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
          <ion-card
            v-for="contract in filteredData"
            :key="contract.id"
            :class="['rounded-xl shadow-none overflow-hidden border font-love border-l-4', getBorderColor(contract.status)]"
          >
            <ion-card-header class="pb-2">
              <div class="flex justify-between items-start">
                <div>
                  <ion-card-title class="text-lg font-semibold text-gray-800">{{ contract.title }}</ion-card-title>
                  <ion-card-subtitle class="text-xs text-gray-500 mt-1 flex items-center">
                    <ion-icon :icon="calendarOutline" class="mr-1"></ion-icon>
                    {{ JSON.parse(contract?.message?.content)?.duration }} Jours
                  </ion-card-subtitle>
                </div>
                 <ion-button :id="'popover-trigger-' + contract.id" fill="clear" color="medium" size="small" class="-mt-2 -mr-2">
                  <ion-icon slot="icon-only" :icon="ellipsisVertical"></ion-icon>
                </ion-button>
              </div>
            </ion-card-header>

            <ion-card-content class="pt-2">
              <div class="space-y-2 text-sm mb-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 flex items-center">
                    <ion-icon :icon="informationCircleOutline" class="mr-1 text-base"></ion-icon> Statut:
                  </span>
                  <ion-badge :color="getStatusColor(contract.status)" class="capitalize font-medium px-2 py-0.5 rounded-md">
                    {{ contract.status }}
                  </ion-badge>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-gray-600 flex items-center">
                     <ion-icon :icon="cashOutline" class="mr-1 text-base"></ion-icon> Montant:
                  </span>
                  <span class="font-semibold text-gray-800">{{ formatCurrency(JSON.parse(contract?.message?.content)?.price) }}</span>
                </div>

                <div class="flex justify-between items-center">
                   <span class="text-gray-600 flex items-center">
                     <ion-icon :icon="personOutline" class="mr-1 text-base"></ion-icon> Client:
                   </span>
                  <span class="text-gray-700 truncate">{{ contract?.room?.parent?.fullname }}</span>
                </div>
              </div>

              <ion-popover
                :trigger="'popover-trigger-' + contract.id"
                trigger-action="click"
                :dismiss-on-select="true"
                side="bottom"
                alignment="end"
                size="auto"
              >
                <ion-content class="ion-padding-vertical font-love">
                  <ion-list lines="none">
                    <ion-item button :detail="false" @click="viewDetails(contract.id)">
                      <ion-icon :icon="eyeOutline" slot="start" class="text-gray-600"></ion-icon>
                      <span class="text-sm font-love">Voir le détail</span>
                    </ion-item>
                    <template v-if="isAdmin">
                       <ion-item
                         v-if="contract.status === 'pending'"
                         button
                         :detail="false"
                         @click="confirmContractWrapper(contract.id)"
                       >
                         <ion-icon :icon="checkmarkCircleOutline" slot="start" color="success"></ion-icon>
                         <span class="text-sm font-love">Confirmer</span>
                       </ion-item>

                       <ion-item
                         v-if="contract.status === 'active'"
                         button
                         :detail="false"
                         @click="terminateContractWrapper(contract.id)"
                         color="danger"
                       >
                         <ion-icon :icon="closeCircleOutline" slot="start"></ion-icon>
                         <span class="text-sm font-love">Résilier</span>
                       </ion-item>

                       <ion-item
                         button
                         :detail="false"
                         @click="callClient(contract.room?.parent?.phone)"
                       >
                         <ion-icon :icon="callOutline" slot="start" class="text-gray-600"></ion-icon>
                         <span class="text-sm font-love">Appeler le client</span>
                       </ion-item>
                    </template>

                    <template v-if="isParent && contract.status === 'active'">
                       <ion-item
                         button
                         :detail="false"
                         @click="requestTerminationWrapper(contract.id)"
                         color="warning"
                       >
                          <ion-icon :icon="alertCircleOutline" slot="start"></ion-icon>
                         <span class="text-sm font-love">Demander résiliation</span>
                       </ion-item>
                    </template>
                  </ion-list>
                </ion-content>
              </ion-popover>

            </ion-card-content>
          </ion-card>
        </div>

      </div>

      <EmptyError
          v-if="filteredData && filteredData?.length == 0"
          nameIcons="RiUser3Line"
          heading="Aucun contrat trouvé"
          subHeading="Aucune contrat trouvé. Modifiez vos critères de recherche."
        />
        <E404Error v-if="isError" />


    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import {
  IonPage, IonContent, IonRefresher, IonRefresherContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonButton, IonIcon, IonBadge, IonSpinner, IonPopover, IonList, IonItem, IonLabel,
  toastController, alertController // Ajout de alertController pour confirmation
} from '@ionic/vue';
import {
  ellipsisVertical, documentTextOutline, calendarOutline, cashOutline,
  personOutline, informationCircleOutline, eyeOutline, checkmarkCircleOutline,
  closeCircleOutline, callOutline, alertCircleOutline
} from 'ionicons/icons';
import {
  fetchContracts,
  confirmContract as apiConfirmContract,
  terminateContract as apiTerminateContract,
  requestTermination as apiRequestTermination
} from '@/services/contract.services';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import HeaderMenuLayout from '@/layouts/HeaderMenuLayout.vue';
import PageLoader from '@/components/loaders/pageLoader.vue';
import E404Error from '@/components/errors/e404.error.vue';
import EmptyError from '@/components/errors/empty.error.vue';

const authStore = useAuthStore();
const router = useRouter();
const queryClient = useQueryClient();
// Note: openDropdownId n'est plus nécessaire avec ion-popover et trigger
const scrollAdminCount = ref(0);
const searchQueryAdminUser = ref("");

// const searchAdminUser = () => {
//   // Trigger the filtering logic based on search query
//   filteredData.value = data.value.filter((contract:any) =>
//     contract.title.toLowerCase().includes(searchQueryAdminUser.value.toLowerCase()) ||
//     contract.clientName.toLowerCase().includes(searchQueryAdminUser.value.toLowerCase()) ||
//     contract.status.toLowerCase().includes(searchQueryAdminUser.value.toLowerCase())
//   );
// };


// --- Gestion du rafraîchissement ---
const handleRefresh = async (event: CustomEvent) => {
  await queryClient.invalidateQueries({ queryKey: ['contracts'] });
  event.detail.complete();
};

const refetchContracts = () => {
  queryClient.invalidateQueries({ queryKey: ['contracts'] });
}

// --- Recherche/Filtrage (simple exemple côté client) ---
const filteredData = computed(() => {
  if (!data.value) return [];
  if (!searchQueryAdminUser.value) {
    return data.value;
  }
  const query = searchQueryAdminUser.value.toLowerCase();
  return data.value.filter((contract:any) =>
    contract.title.toLowerCase().includes(query) ||
    contract.clientName.toLowerCase().includes(query) ||
    contract.status.toLowerCase().includes(query)
  );
});

// --- Toast helper ---
const showToast = async (message: string, color: string = 'success', duration: number = 2500) => {
  const toast = await toastController.create({
    message,
    duration,
    color,
    position: 'top',
    cssClass: 'font-love' // Applique la font si besoin
  });
  await toast.present();
};

// --- Alert helper (pour confirmation) ---
const showConfirmationAlert = async (header: string, message: string, confirmHandler: () => void) => {
  const alert = await alertController.create({
    header,
    message,
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
      },
      {
        text: 'Confirmer',
        role: 'confirm',
        cssClass: 'alert-button-confirm',
        handler: confirmHandler,
      },
    ],
    cssClass: 'font-love' // Applique la font si besoin
  });
  await alert.present();
};

// --- Fetch contracts query ---
const { isLoading, isError, error, data, refetch } = useQuery({
  queryKey: ['contracts'],
  queryFn: fetchContracts,
  staleTime: 5 * 60 * 1000, // Données considérées fraîches pendant 5 minutes
});

// --- Mutations ---
const createMutationOptions = (successMessage: string, mutationFn: (id: string) => Promise<any>) => ({
  mutationFn,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['contracts'] });
    showToast(successMessage);
  },
  onError: (err: any) => {
    console.error("Mutation Error:", err);
    const message = err?.response?.data?.message || err?.message || 'Une erreur est survenue.';
    showToast(`Erreur: ${message}`, 'danger', 4000);
  }
});

const { mutate: confirmContract } = useMutation(createMutationOptions(
  'Contrat confirmé avec succès',
  apiConfirmContract
));

const { mutate: terminateContract } = useMutation(createMutationOptions(
  'Contrat résilié avec succès',
  apiTerminateContract
));

const { mutate: requestTermination } = useMutation(createMutationOptions(
  'Demande de résiliation envoyée',
  apiRequestTermination
));

// --- Wrappers pour confirmation ---
const confirmContractWrapper = (contractId: string) => {
  showConfirmationAlert(
    'Confirmation',
    'Voulez-vous vraiment confirmer ce contrat ?',
    () => confirmContract(contractId)
  );
};

const terminateContractWrapper = (contractId: string) => {
  showConfirmationAlert(
    'Confirmation de résiliation',
    'Êtes-vous sûr de vouloir résilier ce contrat ? Cette action est irréversible.',
    () => terminateContract(contractId)
  );
};

const requestTerminationWrapper = (contractId: string) => {
   showConfirmationAlert(
    'Demande de résiliation',
    'Souhaitez-vous envoyer une demande de résiliation pour ce contrat ?',
    () => requestTermination(contractId)
  );
};

// --- Vérification des rôles ---
const isAdmin = computed(() => authStore.toRole === 'admin');
const isParent = computed(() => authStore.toRole === 'parent');

// --- Fonctions utilitaires ---
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (e) {
    return 'Date invalide';
  }
};

const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount);
};

// Couleur pour le badge de statut
const getStatusColor = (status: string | undefined): string => {
  switch (status?.toLowerCase()) {
    case 'active': return 'success';
    case 'pending': return 'warning';
    case 'terminated': return 'danger';
    case 'expired': return 'medium';
    default: return 'primary';
  }
};

// Couleur pour la bordure latérale de la carte
const getBorderColor = (status: string | undefined): string => {
  switch (status?.toLowerCase()) {
    case 'active': return 'border-green-500';
    case 'pending': return 'border-yellow-500';
    case 'terminated': return 'border-red-500';
    case 'expired': return 'border-gray-400';
    default: return 'border-blue-500'; // Couleur par défaut (primary)
  }
};

// --- Actions ---
const viewDetails = (contractId: string) => {
  router.push(`/contract/${contractId}`);
  // Le popover se ferme automatiquement grâce à dismiss-on-select
};

const callClient = (phoneNumber: string | null | undefined) => {
  if (phoneNumber) {
    window.open(`tel:${phoneNumber}`, '_system'); // _system est souvent mieux sur mobile
  } else {
    showToast("Numéro de téléphone non disponible", "warning");
  }
  // Le popover se ferme automatiquement
};


</script>

<style scoped>
/* Amélioration visuelle des alertes de confirmation */
::global(.alert-button-confirm) {
  color: var(--ion-color-primary) !important; /* Ou une autre couleur comme danger si approprié */
}
::global(.alert-button-cancel) {
   color: var(--ion-color-medium) !important;
}

/* Style pour le popover */
ion-popover {
  --box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  --border-radius: 8px;
}

ion-popover ion-item {
  --inner-padding-end: 16px; /* Ajuster si nécessaire */
  --min-height: 40px; /* Rendre les items un peu plus compacts */
}

ion-popover ion-icon {
  margin-right: 12px; /* Espacement entre icône et label */
  font-size: 1.1em; /* Taille des icônes dans le popover */
}

/* Ajustement pour le header (optionnel, si le titre prend trop de place) */
ion-card-header ion-card-title {
  line-height: 1.3;
}


</style>