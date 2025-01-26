<template>
    <IonContent class="ion-padding h-full">
      <div class="flex justify-center mb-8">
        <HeadingText text="Modalités de paiement" size="medium" />
      </div>
  
      <div class="flex flex-col gap-4">
        <SelectForm
          :options="DataPaymentTerms"
          optionName="name"
          label="Mode de paiement préféré "
          LabelSub="Tous les paiements pour les services doivent être effectués via l'application, pour garantir la sécurité des transactions."
          type="text"
          name="payment_terms"
          placeholder="Carte bancaire"
          :modelValue="useProfilStore().state.PaymentTermsParentProfilValue.payment_terms"
          @update:modelValue="
            useProfilStore().state.PaymentTermsParentProfilValue.payment_terms =
              $event.target.value
          "
          :error="useProfilStore().state.in_error"
        >
        </SelectForm>
  
       
      </div>
    </IonContent>
  </template>
  
  <script setup lang="ts">
  import InputForm from "@/components/forms/inputForm.vue";
  import SelectForm from "@/components/forms/selectForm.vue";
  import HeadingText from "@/components/texts/headingText.vue";
  import { URL_API_ROUTE } from "@/routes/_requests/index.request";
  import { SettingServices } from "@/services/setting.services";
  import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
  import { useQuery } from "@tanstack/vue-query";
  import { reactive } from "vue";
  
  const ListPaymentTerms = async () =>
    await SettingServices().listSetting(URL_API_ROUTE.SETTING_PAYMENT_TERMS);
  const {
    data: DataPaymentTerms,
    error: ErrorPaymentTerms,
    isLoading: LoadingPaymentTerms,
    isError: ISErrorPaymentTerms,
  } = useQuery({
    queryKey: ["ListPaymentTerms"],
    queryFn: ListPaymentTerms,
  });
  </script>
  