<template>
  <InfoPersonalParentProfil v-show="useProfilStore().state.stepProfil == 1" />
  <ChildrenInfoParentProfil v-show="useProfilStore().state.stepProfil == 2" />
  <ServicesSoughtParentProfil v-show="useProfilStore().state.stepProfil == 3" />
  <LocalizationPrarentProfil v-show="useProfilStore().state.stepProfil == 4" />
  <PricingParentProfil v-show="useProfilStore().state.stepProfil == 5" />
  <ProviderPreferenceParentProfil
    v-show="useProfilStore().state.stepProfil == 6"
  />
  <PaymentTermsParentProfil v-show="useProfilStore().state.stepProfil == 7" />
  <AutreInfoParentProfil v-show="useProfilStore().state.stepProfil == 8" />

  <ion-footer class="ion-no-border py-4 px-4 font-love">
    <AuthButton
      :title="
        useProfilStore().state.stepProfil == 8 ? 'Enregistré' : 'Continuer'
      "
      setcolor="bg-primary"
      :loading="useNounuStore().loading"
      @click="
        [
          useProfilStore().state.stepProfil == 1
            ? useProfilStore().InfoPersonalParentProfil()
            : useProfilStore().state.stepProfil == 2
            ? useProfilStore().ChildrenInfoParentProfil()
            : useProfilStore().state.stepProfil == 3
            ? useProfilStore().ServicesSoughtParentProfil()
            : useProfilStore().state.stepProfil == 4
            ? useProfilStore().LocalizationProfil()
            : useProfilStore().state.stepProfil == 5
            ? useProfilStore().PricingParentProfil()
            : useProfilStore().state.stepProfil == 6
            ? useProfilStore().PreferenceParentProfil()
            : useProfilStore().state.stepProfil == 7
            ? useProfilStore().PaymentTermsParentProfil()
            : useProfilStore().state.stepProfil == 8
            ? useProfilStore().AutreInfoParentProfil()
            : createParentProfile(),
        ]
      "
    />
  </ion-footer>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonFooter,
} from "@ionic/vue";

import { ref } from "vue";
import InfoPersonalParentProfil from "./__partiels/infoPersonalParentProfil.vue";
import AuthButton from "@/components/buttons/authButton.vue";
import ChildrenInfoParentProfil from "./__partiels/childrenInfoParentProfil.vue";
import { useProfilStore } from "@/stores/authProfilStore";
import LocalizationPrarentProfil from "./__partiels/LocalizationPrarentProfil.vue";
import PricingParentProfil from "./__partiels/pricingParentProfil.vue";
import ProviderPreferenceParentProfil from "./__partiels/providerPreferenceParentProfil.vue";
import ServicesSoughtParentProfil from "./__partiels/servicesSoughtParentProfil.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import PaymentTermsParentProfil from "./__partiels/paymentTermsParentProfil.vue";
import AutreInfoParentProfil from "./__partiels/autreInfoParentProfil.vue";
import { useParentHook } from "@/hooks/parentHooks/parent.hooks";
import { useNounuStore } from "@/stores/nounu.store";

const modal = ref();

const { createParentProfile } = useParentHook();

function dismiss() {
  modal.value.$el.dismiss();
}

async function canDismiss(data?: any, role?: string) {
  return role !== "gesture";
}
</script>
