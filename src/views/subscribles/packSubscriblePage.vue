<template>
  <ion-page class="subscription-modal">
    <ion-header class="bg-gradient-to-r p-4">
      <div class="flex justify-between items-center">
        <ion-title class="text-ng font-light font-anton">Abonnements Premium</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal" class="text-gray-600" id="closeModelAuthProfil">
            <IcIcons name="RiCloseLine" :size="24" />
          </ion-button>
        </ion-buttons>
      </div>
    </ion-header>

    <ion-content class="bg-gradient-to-br from-gray-50 to-gray-100 font-love">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <!-- Section Packs - Visible seulement si l'utilisateur n'est pas abonné -->
        <section class="mb-12" v-if="!isUserSubscribed">
          <h2 class="text-2xl font-extrabold text-gray-900 mb-6 flex items-center">
            <span class="bg-indigo-100 text-indigo-800 p-2 rounded-full mr-3">
              <ion-icon :icon="star" class="text-lg" />
            </span>
            Nos Packs Abonnements
          </h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Pack Nounu -->
            <div 
              class="relative overflow-hidden rounded-2xl shadow-none border border-gray-200 bg-white transform transition-all hover:scale-[1.02] hover:shadow-2xl"
            >
              <div class="p-8">
                <div class="flex justify-between items-start mb-6">
                  <div>
                    <h3 class="text-2xl font-bold text-gray-900">Pack Nounu</h3>
                    <p class="text-primary font-medium">Pour les nounous professionnelles</p>
                  </div>
                  <div class="text-right">
                    <span class="text-3xl font-extrabold text-gray-900">2500 FCFA</span>
                    <span class="block text-sm text-gray-500">par mois</span>
                  </div>
                </div>
                
                <ul class="space-y-3 mb-8">
                  <li class="flex items-start" v-for="feature in nounuPlan.features" >
                    <ion-icon :icon="checkmarkCircle" class="text-secondary mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700"> {{ feature }} </span>
                  </li>
                
                </ul>
                
                <button 
                  expand="block" 
                  :disabled="nounuPlan.loading"
                  @click="initierPaiement(nounuPlan)"
                  class="h-full text-lg font-bold py-5 w-full rounded-xl text-white bg-primary hover:bg-primary/80"
                  size="large"
                >
                  <ion-spinner v-if="nounuPlan.loading" name="crescent" class="mr-2" />
                  {{ nounuPlan.loading ? 'Traitement...' : 'Souscrire maintenant' }}
                </button>
              </div>
            </div>
            
            <!-- Pack Parent -->
            <div 
              class="relative overflow-hidden rounded-2xl shadow-none border border-gray-200 bg-white transform transition-all hover:scale-[1.02] hover:shadow-2xl"
            >
              <div class="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                POPULAIRE
              </div>
              
              <div class="p-8">
                <div class="flex justify-between items-start mb-6">
                  <div>
                    <h3 class="text-2xl font-bold text-gray-900">Pack Parent</h3>
                    <p class="text-primary font-medium">Pour les parents exigeants</p>
                  </div>
                  <div class="text-right">
                    <span class="text-3xl font-extrabold text-gray-900">5000 FCFA</span>
                    <span class="block text-sm text-gray-500">par mois</span>
                  </div>
                </div>
                
                <ul class="space-y-3 mb-8">
                  <li class="flex items-start" v-for="feature in parentPlan.features" >
                    <ion-icon :icon="checkmarkCircle" class="text-secondary mt-1 mr-3 flex-shrink-0" />
                    <span class="text-gray-700"> {{ feature }} </span>
                  </li>
                </ul>
                
                <button 
                  expand="block" 
                  :disabled="parentPlan.loading"
                  @click="initierPaiement(parentPlan)"
                  class="h-full text-lg font-bold py-5 w-full rounded-xl text-white bg-primary hover:bg-primary/80"
                  size="large"
                >
                  <ion-spinner v-if="parentPlan.loading" name="crescent" class="mr-2" />
                  {{ parentPlan.loading ? 'Traitement...' : 'Souscrire maintenant' }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Section Points - Grille 3x2 -->
        <section class="mb-12">
          <h2 class="text-2xl font-extrabold text-gray-900 mb-6 flex items-center">
            <span class="bg-primary/5 text-primary p-2 rounded-full mr-3">
              <ion-icon :icon="flash" class="text-lg" />
            </span>
            Points de Disponibilité et Recrutements
          </h2>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div 
              v-for="(point, index) in pointOptions" 
              :key="'point-'+index"
              @click="selectPoints(point)"
              class="relative bg-white rounded-xl shadow-sm border-[1px] overflow-hidden transition-all transform hover:scale-105"
              :class="{ 
                'border-primary ring-2 ring-primary/5': selectedPoints?.points === point.points,
                'border-gray-200': selectedPoints?.points !== point.points,
                'opacity-70': pointsLoading && selectedPoints?.points !== point.points
              }"
            >
              <div class="p-6 text-center">
                <div class="mb-4">
                  <span class="text-4xl font-bold text-gray-900">{{ point.points }}</span>
                  <span class="block text-sm text-gray-500">points</span>
                </div>
                <div class="text-primary font-bold text-xl mb-2">{{ point.price }} FCFA</div>
                <p class="text-gray-600 text-sm">{{ point.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section Code Promo -->
        <section class="mb-12">
          <h2 class="text-2xl font-extrabold text-gray-900 mb-6 flex items-center">
            <span class="bg-primary/10 text-primary p-2 rounded-full mr-3">
              <IcIcons name="RiDiscountPercentFill" :size="20" class="text-lg" />
            </span>
            Code Promotionnel
          </h2>
          
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-grow relative flex items-center border-[1px] px-4 py-2 rounded-xl gap-2">
              <div class="text-primary">
                <IcIcons name="RiDiscountPercentFill" :size="20" class="text-2xl" />
              </div>
              <ion-input 
                v-model="promoCode"
                placeholder="Entrez votre code promo" 
                class="promo-input pl-2 py-4 text-lg border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button 
              @click="applyPromoCode"
              :disabled="!promoCode"
              class="md:w-1/4 text-lg font-bold py-4 px-6 rounded-xl text-white bg-primary hover:bg-primary/80 disabled:opacity-50"
            >
              Appliquer
            </button>
          </div>
          
          <div v-if="promoApplied" class="mt-4 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center">
            <ion-icon :icon="checkmarkCircle" class="text-green-500 mr-2 text-xl" />
            <span>Code promo appliqué avec succès!</span>
          </div>
          <div v-if="promoError" class="mt-4 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center">
            <ion-icon :icon="closeCircle" class="text-red-500 mr-2 text-xl" />
            <span>{{ promoError }}</span>
          </div>
        </section>

        <!-- Bouton de paiement pour points -->
        <div v-if="selectedPoints && !selectedPlan" class="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-10">
          <ion-button 
            expand="block" 
            size="large" 
            @click="initierPaiementPoints(selectedPoints)"
            :disabled="pointsLoading"
            class="confirm-btn text-xl font-bold h-16"
          >
            <ion-spinner v-if="pointsLoading" name="crescent" class="mr-3" />
            <span v-else>Payer {{ selectedPoints.price }} FCFA</span>
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonButtons,
  IonIcon,
  IonInput,
  IonSpinner,
  modalController,
} from '@ionic/vue';
import { star, checkmarkCircle, closeCircle, flash } from 'ionicons/icons';
import IcIcons from '@/components/icons/IcIcons.vue';
import { useUserStore } from '@/stores/user.store';
import { useAbonnementStore } from '@/stores/abonnementStore';
import { useRouter } from 'vue-router';
import { HOST_URL, URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { StorageUtils } from '@/utils/store.utils';
import { Browser } from '@capacitor/browser';

// Initialisation des variables
const userStore = useUserStore();
const abonnementStore = useAbonnementStore();
const router = useRouter();


// Vérifier si l'utilisateur est déjà abonné
const isUserSubscribed = computed(() => {
  return useAbonnementStore().isSubscribed;
});

// Définition des plans d'abonnement
const nounuPlan = reactive({
  id: 'nounu_plan',
  name: 'Pack Nounu',
  price: '2500 FCFA',
  priceValue: 2500,
  description: 'Pour les nounous professionnelles',
  features: [
    'Accès à toutes les offres d\'emploi',
    'Postuler à des offres d\'emploi',
    'Profil mis en avant',
    '500 points de disponibilité',
    'Support prioritaire'
  ],
  loading: false
});

const parentPlan = reactive({
  id: 'parent_plan',
  name: 'Pack Parent',
  price: '5000 FCFA',
  priceValue: 5000,
  description: 'Pour les parents exigeants',
  features: [
    'Accès à toutes les nounous vérifiées',
    'Recherche avancée de nounous',
    'Detail des profils nounous',
    'Messagerie illimitée',
    '500 points de disponibilité',
    'Certifications automatique',
    'Support prioritaire 24/7'
  ],
  loading: false
});

// Options de points
const pointOptions = ref([
  { points: 100, price: 1000, description: 'Idéal pour débuter' },
  { points: 250, price: 2000, description: 'Pack économique' },
  { points: 500, price: 3500, description: 'Meilleure valeur' },
  { points: 1000, price: 6000, description: 'Pour utilisateurs réguliers' },
  { points: 2000, price: 10000, description: 'Pack professionnel' },
  { points: 5000, price: 20000, description: 'Pack premium illimité' }
]);

const selectedPoints:any = ref(null);
const selectedPlan = ref(null);
const pointsLoading = ref(false);
const promoCode = ref('');
const promoApplied = ref(false);
const promoError = ref('');


// Données de la transaction
const transactionData = ref<any>({
amount: null, // Montant en XOF
transaction_id: new Date().getTime().toString(),
currency: "XOF",
description: "Achat points disponibilité",
return_url: null,
notify_url: null,
status: "PENDING",
paymentMethod: "ALL",
payment_type: "ABONNEMENT",
});

// Sélectionner un pack de points
const selectPoints = (point: { points: number; price: number; description: string }) => {
  selectedPoints.value = point;
  selectedPlan.value = null;
};

// Initier le paiement pour un plan d'abonnement
const initierPaiement = async (plan: { loading: boolean; name: string; priceValue: number }) => {
try {
  plan.loading = true;
  const [nToken, nUser_Id] = await Promise.all([
    StorageUtils().getStore("nToken"),
    StorageUtils().getStore("nUser_Id"),
  ]);
  
  if (!nToken.value) {
    closeModal();
    router.push({ name: "SignAuth" });
    return;
  }

  // Update loading states
  if (plan.name === nounuPlan.name) {
    nounuPlan.loading = true;
    parentPlan.loading = false;
  } else {
    parentPlan.loading = true; 
    nounuPlan.loading = false;
  }

  transactionData.value.payment_type = 'ABONNEMENT'
  transactionData.value.amount = plan.priceValue;
  transactionData.value.description = `Abonnement ${plan.name}`;
  transactionData.value.metadata = plan.name;
  transactionData.value.userId = nUser_Id.value;
  transactionData.value.notify_url = `${HOST_URL}/notify`;
  transactionData.value.return_url = `${HOST_URL}/?userId=${nUser_Id.value}&transactionId=${transactionData.value.transaction_id}`;

  const response = await axios.post(
    URL_API_ROUTE.PAYMENTS_INITIER,
    transactionData.value
  );

  if (response.data.code === "201") {
    plan.loading = false;
    await StorageUtils().setStore("nTransactionId", transactionData.value.transaction_id);
    await Browser.open({ url: response.data.data.payment_url });
    closeModal();
  } else {
    console.error("Erreur lors de l'initiation du paiement :", response.data);
    nounuPlan.loading = false;
    parentPlan.loading = false;
  }
} catch (error) {
  console.error("Erreur :", error);
  nounuPlan.loading = false;
  parentPlan.loading = false;
} finally {
  plan.loading = false;
}
};

// Initier le paiement pour des points
const initierPaiementPoints = async (point: any) => {
try {
  pointsLoading.value = true;
  const [nToken, nUser_Id] = await Promise.all([
    StorageUtils().getStore("nToken"),
    StorageUtils().getStore("nUser_Id"),
  ]);
  
  if (!nToken.value) {
    closeModal();
    router.push({ name: "SignAuth" });
    return;
  }

  transactionData.value.payment_type = 'POINTS'
  transactionData.value.amount = point.price;
  transactionData.value.description = `Achat de ${point.points} point(s) de disponibilité`;
  transactionData.value.metadata = `points_${point.points}`;
  transactionData.value.userId = nUser_Id.value;
  transactionData.value.notify_url = `${HOST_URL}/?userId=${nUser_Id.value}&transactionId=${transactionData.value.transaction_id}`;
  transactionData.value.return_url = transactionData.value.notify_url;

  const response = await axios.post(
    URL_API_ROUTE.PAYMENTS_INITIER,
    transactionData.value
  );

  if (response.data.code === "201") {
    await StorageUtils().setStore("nTransactionPointId", transactionData.value.transaction_id);
    await StorageUtils().setStore("nPoints", point.points);
    await StorageUtils().setStore("nUserPointsId", nUser_Id.value);
    await Browser.open({ url: response.data.data.payment_url });
    closeModal();
  } else {
    console.error("Erreur lors de l'initiation du paiement :", response.data);
  }
} catch (error) {
  console.error("Erreur :", error);
} finally {
  pointsLoading.value = false;
}
};

// Appliquer un code promo
const applyPromoCode = () => {
  if (!promoCode.value) {
    promoError.value = 'Veuillez entrer un code promo';
    promoApplied.value = false;
    return;
  }
  
  // Simuler la vérification du code promo
  if (promoCode.value === 'BABYNOUNU2023') {
    promoApplied.value = true;
    promoError.value = '';
    // Appliquer la réduction
    pointOptions.value.forEach(point => {
      point.price = Math.round(point.price * 0.9); // 10% de réduction
    });
  } else {
    promoApplied.value = false;
    promoError.value = 'Code promo invalide ou expiré';
  }
};

// Fermer la modal
const closeModal = async () => {
  try {
    // Essayer d'abord avec modalController
    await modalController.dismiss();
  } catch (error) {
    // Si ça échoue, essayer avec la méthode alternative
    if (window.history.length > 1) {
      router.back(); // Retour à la page précédente
    } else {
      // Si pas d'historique, rediriger vers la page d'accueil
      router.push({ name: 'HOME' });
    }
    console.log("Modal fermée via méthode alternative");
  }
};

onMounted(() => {
  // Initialiser les données nécessaires au chargement
});
</script>

<style scoped>
.subscription-modal {
  --background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
}

.confirm-btn {
  --background: var(--ion-color-primary);
  --color: white;
  --border-radius: 12px;
  --box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.promo-input {
  --padding-start: 2.5rem;
}
</style>