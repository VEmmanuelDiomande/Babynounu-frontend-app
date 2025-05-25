<template>
  <InfoPersonalNounu v-show="useProfiNounulStore().state.StepProfil == 1" />
  <ExperienceAndSkillsNounu
    v-show="useProfiNounulStore().state.StepProfil == 2"
  />
  <AvailableNounu v-show="useProfiNounulStore().state.StepProfil == 3" />
  <PricingNounu v-show="useProfiNounulStore().state.StepProfil == 4" />
  <VerificationNounu v-show="useProfiNounulStore().state.StepProfil == 5" />
  <BiographieNounu v-show="useProfiNounulStore().state.StepProfil == 6" />
  <EvaluationAvisNounu v-show="useProfiNounulStore().state.StepProfil == 7" />
  <AreaWorkNounu v-show="useProfiNounulStore().state.StepProfil == 8" />
  <GaleryNounu v-show="useProfiNounulStore().state.StepProfil == 9" />

  <ion-footer class="ion-no-border py-4 px-4 font-love">
    <AuthButton
      :loading="useNounuStore().loading"
      :title="
        useProfiNounulStore().state.StepProfil == 9 ? 'Enregistré' : 'Continuer'
      "
      setcolor="bg-primary"
      :actions="
        () => {
          useProfiNounulStore().state.StepProfil == 1
            ? useProfiNounulStore().InfoPersonalNounuProfil()
            : useProfiNounulStore().state.StepProfil == 2
            ? useProfiNounulStore().ExperienceEtCompetencesProfil()
            : useProfiNounulStore().state.StepProfil == 3
            ? useProfiNounulStore().DisponibilitesProfil()
            : useProfiNounulStore().state.StepProfil == 4
            ? useProfiNounulStore().TarificationsProfil()
            : useProfiNounulStore().state.StepProfil == 5
            ? useProfiNounulStore().VerificationEtReferencesProfil()
            : useProfiNounulStore().state.StepProfil == 6
            ? useProfiNounulStore().PresentationDuPersonnelProfil()
            : useProfiNounulStore().state.StepProfil == 7
            ? useProfiNounulStore().EvaluationEtAvisProfil()
            : useProfiNounulStore().state.StepProfil == 8
            ? useProfiNounulStore().DisponibiliteGeographiqueProfil()
            : useProfiNounulStore().state.StepProfil == 9
            ? useProfiNounulStore().Galery()
            : createProfile();
        }
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
import AuthButton from "@/components/buttons/authButton.vue";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import IcIcons from "@/components/icons/IcIcons.vue";
import InfoPersonalNounu from "./__nounus/infoPersonalNounu.vue";
import ExperienceAndSkillsNounu from "./__nounus/experienceAndSkillsNounu.vue";
import AvailableNounu from "./__nounus/availableNounu.vue";
import PricingNounu from "./__nounus/pricingNounu.vue";
import VerificationNounu from "./__nounus/verificationNounu.vue";
import BiographieNounu from "./__nounus/biographieNounu.vue";
import AreaWorkNounu from "./__nounus/areaWork.nounu.vue";
import { useNounuHook } from "@/hooks/nounuHooks/nounu.hooks";
import { useNounuStore } from "@/stores/nounu.store";
import GaleryNounu from "./__nounus/galeryNounu.vue";
import EvaluationAvisNounu from "./__nounus/evaluationAvisNounu.vue";

const { createProfile, state } = useNounuHook();

const modal = ref();

function dismiss() {
  modal.value.$el.dismiss();
}
</script>
