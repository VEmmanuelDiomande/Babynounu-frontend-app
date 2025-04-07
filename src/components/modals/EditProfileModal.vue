<template>
  <ion-modal ref="modal" :trigger="idModal" @willDismiss="onWillDismiss">
    <ModalHeaderClose
      :title="header"
      :onWillDismiss="onWillDismiss"
      :modal="modal"
    />
    <ion-content class="ion-padding">
      <!-- <TextareaAjustForm
        :modelValue="text"
        @update:modelValue="text = $event.target.value"
        :content="content"
        :info="info"
        :sizeText="sizeText"
      /> -->
    </ion-content>
    {{ TextCache }} {{ text }}
    <ion-footer class="shadow-none p-4">
      <EditButton title="Envoyer" :isTextChange="content != text" />
    </ion-footer>
  </ion-modal>
</template>

<script lang="ts" setup>
import { IonModal, IonContent, IonFooter } from "@ionic/vue";
const props = defineProps(["idModal", "content", "header", "info", "sizeText"]);

import { OverlayEventDetail } from "@ionic/core/components";
import { onMounted, ref } from "vue";
import TextareaAjustForm from "../forms/textareaAjustForm.vue";
import ModalHeaderClose from "../headers/ModalHeaderClose.vue";
import EditButton from "../buttons/EditButton.vue";

const modal = ref();
const text = ref("");
const TextCache = ref("");



const message = ref(
  "This modal example uses triggers to automatically open a modal when the button is clicked."
);

const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
  if (ev.detail.role === "confirm") {
    message.value = `Hello, ${ev.detail.data}!`;
  }
};

onMounted(() => {
  TextCache.value = props.content;
  text.value = props.content;
});
</script>
<style scoped>
/* ion-toolbar {
    --background: #19422d;
    --color: white;

    --border-color: #f24aec;
    --border-width: 4px 0;
    --border-style: double;

    --min-height: 80px;
    --padding-top: 20px;
    --padding-bottom: 20px;
  } */
</style>
