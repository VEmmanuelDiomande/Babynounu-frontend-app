<template>
  <ion-modal
    ref="modal"
    class="modal rounded-t-[42px]"
    style="--border-radius: 42px 42px 0px 0px"
    trigger="open-modal-auth-profil"
    :can-dismiss="canDismiss"
    :presenting-element="page?.$el"
  >
    <ion-header class="ion-no-border border-b-[1px] border-gray-200 p-2 mb-4">
      <div class="flex justify-between h-12 items-center">
        <ion-buttons slot="start" v-if="StepProfil > 1">
          <ion-button @click="LessStepProfil()" class="">
            <IcIcons :name="'RiArrowLeftLine'" :size="24" />
          </ion-button>
        </ion-buttons>
        <ion-title class="text-ng">Etape {{ StepProfil }}</ion-title>
        <ion-buttons slot="end">
          <ion-button
            @click="dismiss()" id="closeModelAuthProfil"
            class="size-8 bg-gray-100 rounded-full closeModelAuthProfil"
          >
            <IcIcons :name="'RiCloseLine'" :size="20" />
          </ion-button>
        </ion-buttons>
      </div>
    </ion-header>
    <slot name="content" />
  </ion-modal>
</template>

<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";
import { StorageUtils } from "@/utils/store.utils";
import { IonModal, IonButton, IonButtons } from "@ionic/vue";


const router = useRouter();

import { ref } from "vue";
import { useRouter } from "vue-router";
defineProps(["StepProfil", "LessStepProfil"]);

const page = ref();
const modal = ref();

async function dismiss() {
  modal.value.$el.dismiss();
  if(!(await StorageUtils().getStore('nProfil_1_Id')).value) {
    await StorageUtils().clearStore();
    return;
  }
  // 
  // router.push({ name: "SignAuth" });
}

async function canDismiss(data?: any, role?: string) {
  return role !== "gesture";
}




</script>
