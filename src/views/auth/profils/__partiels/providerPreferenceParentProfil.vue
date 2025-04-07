<template>
  <IonContent class="ion-padding h-full">
    <div class="flex justify-center mb-8">
      <HeadingText text="Préférences pour les Prestataires" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputBoxForm
        label="Compétences spécifiques "
        type="text"
        name="competance_specifique"
        placeholder="Abidjan, Bouaké, Marcory, Bingerville"
        v-model="
          useProfilStore().state.PreferencePourLesSpecifiques.competance_specifique
        "
        :error="useProfilStore().state.in_error"
        :options="DataSpecificSkills?.parameter"
        option-name="name"
      />

      <InputBoxForm
        label="Langues parlées par le prestataire "
        type="text"
        name="langue_parler"
        placeholder="Abidjan, Bouaké, Marcory, Bingerville"
        v-model="useProfilStore().state.PreferencePourLesSpecifiques.langue_parler"
        :error="useProfilStore().state.in_error"
        :options="DataLanguages?.parameter"
        optionName="name"
      />

      <SelectForm
        :options="DataAvailabilityServiceProvider?.parameter"
        optionName="name"
        label="disponibilité du prestataire "
        LabelSub="Indiquez si vous préférez des prestataires disponibles pour des gardes de dernière minute ou en cas d'urgence."
        type="text"
        name="disponibility_du_prestataire"
        placeholder="En urgence"
        v-model="
          useProfilStore().state.PreferencePourLesSpecifiques
            .disponibility_du_prestataire
        "
        :error="useProfilStore().state.in_error"
      >
      </SelectForm>
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

const ListSpecificSkills = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_SPECIFIC_SKILLS);
const {
  data: DataSpecificSkills,
  error: ErrorSpecificSkills,
  isLoading: LoadingSpecificSkills,
  isError: ISErrorSpecificSkills,
} = useQuery({
  queryKey: ["ListSpecificSkills"],
  queryFn: ListSpecificSkills,
});

const ListLanguages = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_LANGUAGE);
const {
  data: DataLanguages,
  error: ErrorLanguages,
  isLoading: LoadingLanguages,
  isError: ISErrorLanguages,
} = useQuery({
  queryKey: ["ListLanguages"],
  queryFn: ListLanguages,
});

const ListAvailabilityServiceProvider = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_AVAILABILITY_OF_SERVICE_PROVIDER);
const {
  data: DataAvailabilityServiceProvider,
  error: ErrorAvailabilityServiceProvider,
  isLoading: LoadingAvailabilityServiceProvider,
  isError: ISErrorAvailabilityServiceProvider,
} = useQuery({
  queryKey: ["ListAvailabilityServiceProvider"],
  queryFn: ListAvailabilityServiceProvider,
});


</script>
