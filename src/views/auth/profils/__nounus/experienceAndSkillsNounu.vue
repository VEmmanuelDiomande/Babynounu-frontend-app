<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8 font-love">
    <div class="flex justify-center">
      <HeadingText text="Expérience et Compétences" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputForm
        label="Années d'expérience "
        type="number"
        name="annees_experience"
        placeholder="6 ans Experiences"
        v-model="useProfiNounulStore().state.ExperienceEtCompetences.annees_experience"
        :error="useProfiNounulStore().state.in_error"
      />

      <InputBoxForm
        label="Tranche d'âge d'enfants"
        type="text"
        name="tranche_age_enfants"
        placeholder="Nourrissons, petite enfance, Présclaire"
        v-model="useProfiNounulStore().state.ExperienceEtCompetences.tranche_age_enfants"
        :error="useProfiNounulStore().state.in_error"
        :options="DataAgeOfChildren?.parameter"
        optionName="name"
      />

      
      <InputBoxForm
        label="Compétences spécifiques "
        type="text"
        name="competance_specifique"
        placeholder="Aide aux devoirs, Activités éducatives et ludiques"
        v-model="useProfiNounulStore().state.ExperienceEtCompetences.competance_specifique"
        :error="useProfiNounulStore().state.in_error"
        :options="DataSpecificSkills?.parameter"
        optionName="name"
      />


      <InputBoxForm
        label="Langues parlées"
        type="text"
        name="langue_parler"
        placeholder="Francais, Anglais, autres"
        v-model="useProfiNounulStore().state.ExperienceEtCompetences.langue_parler"
        :error="useProfiNounulStore().state.in_error"
        :options="DataLanguages?.parameter"
        optionName="name"
      />
    </div>
  </IonContent>
</template>


<script setup lang="ts">
import InputBoxForm from "@/components/forms/inputBoxForm.vue";
import InputForm from "@/components/forms/inputForm.vue";
// import IcIcons from "@/components/icons/IcIcons.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
import { useQuery } from "@tanstack/vue-query";
// data, error, isLoading, isError

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

const ListAgeOfChildrens = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_AGE_OF_CHILDRENS);
const {
  data: DataAgeOfChildren,
  error: ErrorAgeOfChildren,
  isLoading: LoadingAgeOfChildren,
  isError: ISErrorAgeOfChildren,
} = useQuery({
  queryKey: ["ListAgeOfChildrens"],
  queryFn: ListAgeOfChildrens,
});
</script>
