<template>
  <div class="flex flex-col pt-4 font-love gap-2">
    <IonText>
      <p class="text-ng font-semibold">
        {{ heading }}
      </p>
    </IonText>

    <IonText>
      <!-- <p :id="'open-modal-' + heading" class="text-sm text-zinc-500">
        {{ content }}
      </p> -->
    </IonText>

    <IonText class="flex items-start gap-1" :id="'open-modal-' + heading">
      
        <RiEdit2Fill size="16" class="text-gray-300 relative -top-[2px] " />
        <p  class="text-sm text-zinc-500 w-[calc(100%-56px)]">
           {{ placeholder }}
      </p>
    </IonText>

    <EditProfileModal :header="heading" :content="content" :info="info" :sizeText="sizeText" :idModal="'open-modal-' + heading" />
  </div>
</template>

<script lang="ts" setup>
import EditProfileModal from "@/components/modals/EditProfileModal.vue";
import { IonText } from "@ionic/vue";
import { RiEdit2Fill } from "@remixicon/vue";
defineProps(["heading", "content", 'placeholder', 'info', 'sizeText']);
</script>
