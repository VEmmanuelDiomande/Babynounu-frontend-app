<template>
  <IonContent class="ion-padding h-full gap-8">
    <div class="flex justify-center mb-8">
      <HeadingText text="Critères de Sélection" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <SelectForm
        :options="useJobStore().DataExperienceMinimum"
        optionName="name"
        label="Souhaitez-vous que la nounou/femme de ménage ait une expérience minimale ? "
        name="experience_minimun"
        placeholder="3 Enfants"
        v-model="useJobStore().state.criteres.experience_minimun"
        :error="useJobStore().state.in_error"
      />

      <InputForm
        label="De combien d’années d’expérience minimum ? "
        name="annee_experience"
        type="number"
        placeholder="Trois Annees Experiences"
        v-model="useJobStore().state.criteres.annee_experience"
        :error="useJobStore().state.in_error"
      />

      <InputBoxForm
        option-name="name"
        :options="DataCertifications?.parameter"
        label="Avez-vous besoin d’une certification spécifique ?  "
        name="certifications"
        placeholder="3 Enfants"
        v-model="useJobStore().state.criteres.certifications"
        :error="useJobStore().state.in_error"
      />

      <InputBoxForm
        option-name="name"
        :options="DataCertifications?.parameter"
        label="Quels sont vos critères personnels pour choisir une candidate ? "
        placeholder=""
        name="criteres_selections"
        v-model="useJobStore().state.criteres.criteres_selections"
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



const ListCertifications = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_CERTIFICATIONS);
const {
  data: DataCertifications,
  error: ErrorCertifications,
  isLoading: LoadingCertifications,
  isError: ISErrorCertifications,
} = useQuery({
  queryKey: ["ListCertifications"],
  queryFn: ListCertifications,
});



</script>
<style></style>
