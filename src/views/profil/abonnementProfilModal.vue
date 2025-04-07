<template>
  <ion-modal
    ref="modal"
    class="modal rounded-t-[42px]"
    style="--border-radius: 42px 42px 0px 0px"
    trigger="open-modal-abonnement"
    :can-dismiss="canDismiss"
    :presenting-element="page?.$el"
  >
    <ion-header class="ion-no-border border-b-[1px] border-gray-200 p-2 mb-4">
      <ion-toolbar>
        <ion-title class="text-ng font-love"
          >Choisir votre abonnement</ion-title
        >
        <ion-buttons slot="end">
          <ion-button
            @click="dismiss()"
            id="closeModelAuthProfil"
            class="size-8 bg-gray-100 rounded-full closeModelAuthProfil"
          >
            <IcIcons :name="'RiCloseLine'" :size="20" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <IonContent class="flex flex-col items-center bg-gray-50 font-love">
      <!-- Header -->
      <div class="text-center mb-4">
        <h1 class="text-2xl font-bold">Choisissez votre plan</h1>
        <p class="text-gray-600 mt-2">
          Des tarifs abordables pour tout le monde !
        </p>
      </div>

      <!-- Pricing Cards -->
      <div class="w-full max-w-md px-4 pb-16 divide-y-[1px]">
        <div v-for="(item, index) in PlanPricing" :key="index">
          <div class="bg-white rounded-lg px-6 py-4 border-gray-200">
            <h2
              class="text-xl font-anton uppercase"
              :class="item.name == 'Nounou' ? 'text-primary' : 'text-secondary'"
            >
              {{ item.name }}
            </h2>
            <p class="text-gray-700 mt-2 text-base">
              {{ item.description }}
            </p>
            <p
              class="text-2xl mt-4 mb-4 font-love"
              :class="item.name == 'Nounou' ? 'text-primary' : 'text-secondary'"
            >
              {{ item.price }}
            </p>
            <ul
              class="text-gray-600 mt-2 space-y-1"
              v-for="fea in item.features"
            >
              <li class="flex items-center">
                <IcIcons
                  name="RiCheckboxCircleLine"
                  :size="20"
                  class="mr-2"
                  :class="
                    item.name == 'Nounou' ? 'text-primary' : 'text-secondary'
                  "
                ></IcIcons>
                <span class="text-sm"> {{ fea }}</span>
              </li>
            </ul>

            <div class="w-full mt-4">
              <button
              :disabled="item.disable"
                @click="initierPaiement(item)"
                :class="item.name == 'Nounou' ? 'bg-primary' : 'bg-secondary'"
                class="border-2 text-white rounded-lg py-4 w-full text-lg font-bold"
              >
                <SpinnerLoader
                  size="medium"
                  classCustom="text-white"
                  v-show="item.loading"
                />
                <span v-show="!item.loading">Commencer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </IonContent>
  </ion-modal>
</template>

<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";
import axios from "axios";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
} from "@ionic/vue";

import { onMounted, reactive, ref } from "vue";
import {
  HOST_URL,
  URL_API_ROUTE,
  URL_PROVIDER_APP,
} from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import { useRouter } from "vue-router";
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
import { Browser } from "@capacitor/browser";

const PlanPricing = reactive([
  {
    name: "Nounou",
    price: "100 Fcfa",
    description:
      "Pour les nounous qui souhaitent se connecter avec les parents",
    loading: false,
    disable: false,
    features: [
      "Accès aux demandes des parents",
      "Visibilité du profil",
      "Messagerie sécurisée avec les parents",
      "Accès aux évaluations des parents",
      "Statistiques de vues de profil",
      "Support prioritaire",
    ],
  },
  {
    name: "Parent",
    price: "100 Fcfa",
    loading: false,
    disable: false,
    description: "Pour les parents à la recherche de nounous de confiance",
    features: [
      "Recherche illimitée de nounous",
      "Discussion avec les nounous",
      "Accès aux profils vérifiés",
      "Historique des nounous contactées",
      "Planification et gestion des rendez-vous",
      "Support dédié",
    ],
  },
]);

const page = ref();
const modal = ref();
const router = useRouter();
const User = ref();

onMounted(async () => {});
function dismiss() {
  modal.value.$el.dismiss();
}

async function canDismiss(data?: any, role?: string) {
  return role !== "gesture";
}

const payLoading = ref(false)

// Données de la transaction
const transactionData = ref(<any>{
  userId: null,
  amount: 1000, // Montant en XOF
  transaction_id: new Date().getTime().toString(), //
  currency: "XOF",
  description: "TEST INTEGRATION ",
  return_url: HOST_URL,
  notify_url: HOST_URL,
  channels: "ALL",
  metadata: "user1",
  status: "PENDING",
  paymentMethod: "ALL",
});

// Fonction pour initier le paiement
const initierPaiement = async (items: any) => {


  try {
    payLoading.value = true;
    const [nToken, nUser_Id] = await Promise.all([
  StorageUtils().getStore("nToken"),
  StorageUtils().getStore("nUser_Id"),
]);
    if (!nToken.value) {
      dismiss();
      router.push({ name: "SignAuth" });
      return;
    }

    PlanPricing.find((item) => {
      if (item.name == items.name) {
        item.loading = true;
      }else{
        item.disable = true
      }
    });

    transactionData.value.amount = parseInt(items.price.replace(" Fcfa", ""));
    transactionData.value.description = items.description;
    transactionData.value.metadata = items.name;
    transactionData.value.userId = nUser_Id.value;
    transactionData.value.notify_url= "https://provider.babynounu.com/?userId=" + nUser_Id.value + "&transactionId=" + transactionData.value.transaction_id ;
    transactionData.value.return_url = transactionData.value.notify_url
    const response = await axios.post(
      URL_API_ROUTE.PAYMENTS_INITIER,
      transactionData.value
    );

    if (response.data.code === "201") {
      // Rediriger l'utilisateur vers la page de paiement CinetPay
      const closeModal = document.getElementById("closeModelAuthProfil");
      closeModal?.click();
      payLoading.value = false;

      
      StorageUtils().setStore("nTransactionId", transactionData.value.transaction_id);
      await Browser.open({ url: response.data.data.payment_url });
    } else {
      console.error("Erreur lors de l'initiation du paiement :", response.data);
    }
  } catch (error) {
    console.error("Erreur :", error);
  }
};
</script>
