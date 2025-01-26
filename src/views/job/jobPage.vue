<template>
  <InfoGeneralJob v-show="useJobStore().state.stepJob == 1" />

  <ion-footer class="ion-no-border py-4 px-4">
    <AuthButton
      :title="useJobStore().state.stepJob == 8 ? 'Enregistré' : 'Continuer'"
      setcolor="bg-primary"
      :loading="useNounuStore().loading"
      @click="
        [
          useJobStore().state.stepJob == 1
            ? useJobStore().InfoGeneralJob()
            : createJob(),
        ]
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
import { useJobStore } from "@/stores/jobStore";
import IcIcons from "@/components/icons/IcIcons.vue";
import { useJobHook } from "@/hooks/jobHooks/job.hooks";
import { useNounuStore } from "@/stores/nounu.store";
import InfoGeneralJob from "./_partiels/InfoGeneralJob.vue";

const modal = ref();

const { createJob } = useJobHook();

function dismiss() {
  modal.value.$el.dismiss();
}

async function canDismiss(data?: any, role?: string) {
  return role !== "gesture";
}
</script>
