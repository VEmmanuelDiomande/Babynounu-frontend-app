<template>
  <IonContent class="ion-padding h-full">
    <div class="flex justify-center mb-8">
      <HeadingText text="Préférences pour les Prestataires" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputForm
        label="Compétences spécifiques "
        type="text"
        name="specificSkills"
        placeholder="Abidjan, Bouaké, Marcory, Bingerville"
        v-model="useProfilStore().state.PreferenceParentProfilValue.specificSkills"
        :error="useProfilStore().state.in_error"
        :data="DataSpecificSkills"
        dataName="name"
      />

     

      <InputForm
        label="Langues parlées par le prestataire "
        type="text"
        name="languages"
        placeholder="Abidjan, Bouaké, Marcory, Bingerville"
        v-model="useProfilStore().state.PreferenceParentProfilValue.languages"
        :error="useProfilStore().state.in_error"
        :data="DataLanguages"
        dataName="name"
      />

      <SelectForm
          :options="ListAvailabilityServiceProvider"
          optionName="name"
          label="disponibilité du prestataire "
          LabelSub="Indiquez si vous préférez des prestataires disponibles pour des gardes de dernière minute ou en cas d'urgence."
          type="text"
          name="availabilityServiceProvider"
          placeholder="Carte bancaire"
          :modelValue="useProfilStore().state.PreferenceParentProfilValue.availabilityServiceProvider"
          @update:modelValue="
            useProfilStore().state.PreferenceParentProfilValue.availabilityServiceProvider =
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


const ListAvailabilityServiceProvider = [
  {
    name: "Gardes de dernière minute "
  },
  {
    name: "En cas d'urgence"
  }
]
</script>
