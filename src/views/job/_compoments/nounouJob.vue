<template>
  <IonContent class="ion-padding h-full gap-8">
    <div class="flex justify-center mb-8">
      <HeadingText text="Pour une Nounou" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputForm
        label="Combien d’enfants avez-vous ? "
        type="number"
        name="nombre_enfants"
        placeholder="3 Enfants"
        v-model="useJobStore().state.nounou.nombre_enfants"
        :error="useJobStore().state.in_error"
      />

      <InputBoxForm
        option-name="name"
        :options="DataGardeEnfants?.parameter"
        label="Quels sont les âges de vos enfants ?"
        name="garde_enfants"
        placeholder=""
        v-model="useJobStore().state.nounou.garde_enfants"
        :error="useJobStore().state.in_error"
      />

      <InputBoxForm
        option-name="name"
        :options="DataBesionSpecifiques?.parameter"
        label="Avez-vous des besoins spécifiques pour vos enfants "
        name="besions_specifiques"
        placeholder=""
        v-model="useJobStore().state.nounou.besions_specifiques"
        :error="useJobStore().state.in_error"
      />

      <SelectForm
        option-name="name"
        :options="DataLangueParler?.parameter"
        label="Souhaitez-vous que la nounou parle une langue spécifique ?  "
        name="langue_parler"
        placeholder=""
        v-model="useJobStore().state.nounou.langue_parler"
        :error="useJobStore().state.in_error"
      />

      <InputBoxForm
        option-name="name"
        :options="DataComptanceSpecifique?.parameter"
        label="Quelles sont les principales responsabilités que vous attendez de la nounou ?"
        name="competance_specifique"
        placeholder=""
        v-model="useJobStore().state.nounou.competance_specifique"
        :error="useJobStore().state.in_error"
      />
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputBoxForm from "@/components/forms/inputBoxForm.vue";
import InputFileForm from "@/components/forms/inputFileForm.vue";
import InputForm from "@/components/forms/inputForm.vue";
import PhoneForm from "@/components/forms/phoneForm.vue";
import SelectForm from "@/components/forms/selectForm.vue";
import TextareaAjustForm from "@/components/forms/textareaAjustForm.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { useProfilStore } from "@/stores/authProfilStore";
import { useJobStore } from "@/stores/jobStore";
import { IonContent } from "@ionic/vue";
import { useQuery } from "@tanstack/vue-query";
import { reactive, ref } from "vue";



const ListLangueParler = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_LANGUAGE);
const {
  data: DataLangueParler,
  error: ErrorLangueParler,
  isLoading: LoadingLangueParler,
  isError: ISErrorLangueParler,
} = useQuery({
  queryKey: ["ListLangueParler"],
  queryFn: ListLangueParler,
});

const ListGardeEnfants = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_AGE_OF_CHILDRENS);
const {
  data: DataGardeEnfants,
  error: ErrorGardeEnfants,
  isLoading: LoadingGardeEnfants,
  isError: ISErrorGardeEnfants,
} = useQuery({
  queryKey: ["ListGardeEnfants"],
  queryFn: ListGardeEnfants,
});

const ListBesionSpecifiques = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_SPECIFIC_NEEDS);
const {
  data: DataBesionSpecifiques,
  error: ErrorBesionSpecifiques,
  isLoading: LoadingBesionSpecifiques,
  isError: ISErrorBesionSpecifiques,
} = useQuery({
  queryKey: ["ListBesionSpecifiques"],
  queryFn: ListBesionSpecifiques,
});

const ListComptanceSpecifique = async () =>
  await SettingServices().listSetting(
    URL_API_ROUTE.SETTING_SPECIFIC_SKILLS
  );
const {
  data: DataComptanceSpecifique,
  error: ErrorComptanceSpecifique,
  isLoading: LoadingComptanceSpecifique,
  isError: ISErrorComptanceSpecifique,
} = useQuery({
  queryKey: ["ListComptanceSpecifique"],
  queryFn: ListComptanceSpecifique,
});


</script>
<style></style>
