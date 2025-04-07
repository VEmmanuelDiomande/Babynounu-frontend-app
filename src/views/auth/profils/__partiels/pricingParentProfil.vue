<template>
  <IonContent class="ion-padding h-full">
    <div class="flex justify-center mb-8">
      <HeadingText text="Tarification : Budget estimé" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputCurrencyForm
      label="Budget estimé"
        LabelSub="Indiquez le budget que vous souhaitez pour une prestataire."
        v-model="useProfilStore().state.Tarifications.budget_estimated"
        :error="useProfilStore().state.in_error"
        name="budget_estimated"
        currency="XOF"
        id="amount"
        placeholder="Entrez un montant"
      />
      <!-- <InputForm
        label="Budget estimé"
        type="number"
        LabelSub="Indiquez le budget que vous souhaitez pour une prestataire."
        name="budget_estimated"
        placeholder="25.000 Fcfa"
        v-model="useProfilStore().state.Tarifications.budget_estimated"
        :error="useProfilStore().state.in_error"
      /> -->
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputCurrencyForm from "@/components/forms/inputCurrencyForm.vue";
import InputForm from "@/components/forms/inputForm.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
import { reactive } from "vue";
</script>
