<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center">
      <HeadingText text="Expérience et Compétences" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <InputForm
        label="Années d'expérience "
        type="number"
        name="yearsOfExperience"
        placeholder="6 ans Experiences"
        :modelValue="useProfiNounulStore().state.ExperienceAndSkillValue?.yearsOfExperience"
        @update:modelValue="
          useProfiNounulStore().state.ExperienceAndSkillValue.yearsOfExperience =
            $event.target.value
        "
        :error="useProfiNounulStore().state.in_error"
      />

      <InputForm
        label="Tranche d'âge d'enfants"
        type="text"
        name="ageGroupOfChildren"
        placeholder="Nourrissons, petite enfance, Présclaire"
        v-model="useProfiNounulStore().state.ExperienceAndSkillValue.ageGroupOfChildren"
        :error="useProfiNounulStore().state.in_error"
        :data="DataAgeOfChildren"
        dataName="name"
      />

      
      <InputForm
        label="Compétences spécifiques "
        type="text"
        name="specificSkills"
        placeholder="Aide aux devoirs, Activités éducatives et ludiques"
        v-model="useProfiNounulStore().state.ExperienceAndSkillValue.specificSkills"
        :error="useProfiNounulStore().state.in_error"
        :data="DataSpecificSkills"
        dataName="name"
      />


      <InputForm
        label="Langues parlées"
        type="text"
        name="languages"
        placeholder="Francais, Anglais, autres"
        v-model="useProfiNounulStore().state.ExperienceAndSkillValue.languages"
        :error="useProfiNounulStore().state.in_error"
        :data="DataLanguages"
        dataName="name"
      />
    </div>
  </IonContent>
</template>


<script setup lang="ts">
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
