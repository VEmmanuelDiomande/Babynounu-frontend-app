<script setup lang="ts">
import InputCurrencyForm from "@/components/forms/inputCurrencyForm.vue";
import InputForm from "@/components/forms/inputForm.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { SocketService } from "@/services/socket.services";
import { useNotificationStore } from "@/stores/notificationStore";
import { StorageUtils } from "@/utils/store.utils";
import { Toast } from "@capacitor/toast";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";
import axios from "axios";
import { reactive, ref } from "vue";

const { data } = defineProps(["data"]);
const socketService = new SocketService()

const InputContrats = reactive({
  price: 0,
  duration: 0,
});
const isLoading = ref(false);

const openModal = ref(false);

// Fonction pour fermer le modal
const closeModal = () => {
  openModal.value = false;
};

// Fonction pour ouvrir le modal
const openModalForm = () => {
  openModal.value = true;
};

const validateForm = () => {
  if (InputContrats.price > 0 && InputContrats.duration > 0) return true;
  else return false;
};

// Fonction pour soumettre le formulaire
const submitForm = async () => {
  if (validateForm()) {
    isLoading.value = true;
    try {
      const settingServices = SettingServices();
      const reponse = await settingServices.createSetting(
        `${URL_API_ROUTE.CONTRACT_CREATE}`,
        {
          price: parseInt(InputContrats.price.toString()),
          duration: parseInt(InputContrats.duration.toString()),
          nounuId: data.nounu,
          parentId: data.parent,
        }
      );

      if (reponse) {
        Toast.show({
          text: "Contrat cree avec success",
          duration: "long",
        });
        console.log('userId : ', data.userId, (await StorageUtils().getStore("nUser_Id")).value)
        if(data.userId == (await StorageUtils().getStore("nUser_Id")).value) {
            await useNotificationStore().getNotificationCount(data.userId);
        }
        
        closeModal()
      }
      isLoading.value = false;
    } catch (error) {
      isLoading.value = false;
      Toast.show({
        text: "Une erreur est survenue lors de la soumission du formulaire",
      });
    }
  }
};
</script>

<template>
  <div class="flex justify-between p-2 items-center">
    <span class="text-sm">Demarer un nouvelle mission</span>
    <button
      @click="openModal = !openModal"
      class="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
    >
      <IcIcons name="RiContractLine" :size="20" />
      <span class="">Missions</span>
    </button>
  </div>

  <div
    v-if="openModal"
    class="fixed inset-0 h-screen font-love flex items-center justify-center bg-black/50 z-50"
  >
    <IonCard class="font-love">
      <IonCardHeader>
        <IonCardTitle class="font-bold">Contrats</IonCardTitle>
        <ion-card-subtitle>
          <span class="">
            Vous etablissez un contrat pour une mission. Cette missons doit être
            valider par le client.
          </span>
        </ion-card-subtitle>
      </IonCardHeader>

      <IonCardContent>
        <InputCurrencyForm
          label="Budget"
          LabelSub="Entrez un montant exacte de cette mission."
          currency="XOF"
          locale="fr-FR"
          v-model="InputContrats.price"
        />

        <div class="">
          <InputForm
            label="Durée"
            type="number"
            LabelSub="Indiquez la durée que vous souhaitez pour cette mission."
            name="budget_estimated"
            placeholder="45 jours"
            v-model="InputContrats.duration"
          />
        </div>
      </IonCardContent>

      <ion-button
        @click="openModal = !openModal"
        class="text-red-500 font-love"
        fill="clear"
        >Annuler</ion-button
      >
      <ion-button
        @click="submitForm"
        :disabled="!validateForm()"
        class="font-love text-secondary"
        fill="clear"
      >
        <span v-if="!isLoading">Valider</span>
        <ion-spinner v-if="isLoading" name="crescent" />
      </ion-button>
    </IonCard>
  </div>
</template>
<style scoped>
ion-spinner {
  --color: #55c4bd;
}
</style>
