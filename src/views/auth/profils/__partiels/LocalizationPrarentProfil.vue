<template>
  <IonContent class="ion-padding h-full">
    <div class="flex justify-center mb-8">
      <HeadingText text="Localisation" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <SelectForm
        :options="DataLocalizations?.parameter"
        optionName="name"
        label="Votre Localisation"
        LabelSub="Indiquez votre localisation pour permettre aux prestataires de vous trouver plus facilement."
        type="text"
        name="adress"
        placeholder="Abidjan, abobo, Bingerville"
        v-model="useProfilStore().state.Localizations.adress"
        :error="useProfilStore().state.in_error"
      >
      </SelectForm>

      <InputBoxForm
        label="Zone géographique de prestation"
        type="text"
        name="zone_geographique_prestataire"
        placeholder="Abidjan, Bouaké, Marcory, Bingerville"
        v-model="useProfilStore().state.Localizations.zone_geographique_prestataire"
        :error="useProfilStore().state.in_error"
        :options="DataLocalizations?.parameter"
        option-name="name"
      />
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputBoxForm from "@/components/forms/inputBoxForm.vue";
import InputForm from "@/components/forms/inputForm.vue";
import SelectForm from "@/components/forms/selectForm.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
import { useQuery } from "@tanstack/vue-query";
import { reactive } from "vue";

const ListLocalizations = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_LOCALIZATION);
const {
  data: DataLocalizations,
  error: ErrorLocalizations,
  isLoading: LoadingLocalizations,
  isError: ISErrorLocalizations,
} = useQuery({
  queryKey: ["ListLocalizations"],
  queryFn: ListLocalizations,
});
</script>
