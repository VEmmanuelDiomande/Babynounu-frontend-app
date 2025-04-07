<template>
    <ion-modal
      ref="modal"
      class="modal rounded-t-[42px]"
      style="--border-radius: 42px 42px 0px 0px"
      trigger="open-modal-filter-search"
      :can-dismiss="canDismiss"
      :presenting-element="page?.$el"
    >
      <ion-header class="ion-no-border border-b-[1px] border-gray-200 p-2 mb-4">
        <ion-toolbar>
          <ion-buttons slot="start" v-if="StepProfil > 1">
            <ion-button @click="LessStepProfil()" class="">
              <IcIcons :name="'RiArrowLeftLine'" :size="24" />
            </ion-button>
          </ion-buttons>
          <ion-title  class="text-ng text-center"> Filtre </ion-title>
          <ion-buttons slot="end">
            <ion-button
              @click="dismiss()" id="closeModelAuthProfil"
              class="size-8 bg-gray-100 rounded-full closeModelAuthProfil"
            >
              <IcIcons :name="'RiCloseLine'" :size="20" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <slot name="content" />
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import IcIcons from "@/components/icons/IcIcons.vue";
  import { IonModal } from "@ionic/vue";
  
  import { ref } from "vue";
  defineProps(["StepProfil", "LessStepProfil"]);
  
  const page = ref();
  const modal = ref();
  
  function dismiss() {
    modal.value.$el.dismiss();
  }
  
  async function canDismiss(data?: any, role?: string) {
    return role !== "gesture";
  }
  
  
  
  
  </script>
  