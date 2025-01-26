<template>
  <IonPage>
    <ModalHeaderClose :title="'Agence de livraison'" />
    <ion-content class="ion-padding">
      <div class="flex flex-col gap-2">
        <InputForm label="Nom de l'agence" placeholder="Nom de l'agence" />
        <InputForm label="Adresse email" placeholder="Adresse email" />
        <InputForm  label="Numero de télephone" placeholder="Numero de télephone" />

        <!-- Defined Type delivery -->
        <div class="flex flex-col gap-2 mt-4">
          <Heading2Text
            title="Type de livraison"
            desc="Quels types de livraisons propose votre agence, quelles sont les zones
      couvertes, et quels sont vos tarifs ?"
          />

          <div class="flex gap-2 overflow-x-auto no-scrollbar">
            <div v-for="(dtype, index) in state.deliveryType" :key="index">
              <CardTypeDeliveryAgency :Type="dtype" />
            </div>
          </div>

          <!-- Add to place -->
          <div class="border-[1px] rounded-lg relative mt-4">
            <div class="absolute -top-3 left-3 px-4 bg-white">
              <div class="flex">
                <IcIcons
                  name="RiMapPin2Line"
                  :size="20"
                  class="text-zinc-800"
                />
                <span class="text-lg font-anton"> Trajet & Prix</span>
              </div>
            </div>

            <div class="flex p-4 gap-2 w-full">
              <!-- Button to add new place -->

              <div class="w-[50px] ">
                <IonButton
                id="open-modal"
                class="flex justify-center items-center border-2 h-12 bg-gradient-to-r from-orange-400 to-red-500  rounded-xl"
              >
                <IcIcons name="RiAddLine" :size="24" class="text-white" />
              </IonButton>
              </div>

              <!--  -->
              <div class="flex overflow-x-auto no-scrollbar gap-2">
                <div v-for="(Place, index) in Data__Standard" :key="index">
                  <CardPlaceAndPriceAgency :data="Place" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  
      <BasicModalSheet />
      
    </ion-content>

    <ion-footer class="shadow-sm">
      <div class="flex gap-1 shadow-sm p-4">
        <AuthButton title="Ajouter mon agence" />
      </div>
    </ion-footer>
  </IonPage>
</template>

<script lang="ts" setup>
import { IonContent, IonFooter, IonPage } from "@ionic/vue";

import ModalHeaderClose from "@/components/headers/ModalHeaderClose.vue";
import InputForm from "@/components/forms/inputForm.vue";
import AuthButton from "@/components/buttons/authButton.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import CardTypeDeliveryAgency from "@/views/agency/partials/cardTypeDeliveryAgency.vue";
import { useCreateAgencyHook } from "@/hooks/agencyHooks/createAgencyHook";
import CardPlaceAndPriceAgency from "./partials/cardPlaceAndPriceAgency.vue";
import BasicModalSheet from "@/components/modals/sheets/basicModalSheet.vue";
import Heading2Text from "@/components/texts/heading2Text.vue";
import { useAgencyStore } from "@/stores/agencyStore";
import { computed } from "vue";

const { state } = useCreateAgencyHook();
const { DATA_type_delivery_standard } = useAgencyStore()


const Data__Standard = computed(() => {
    return DATA_type_delivery_standard
})
</script>
<style scoped></style>
