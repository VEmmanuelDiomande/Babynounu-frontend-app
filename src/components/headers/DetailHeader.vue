<template>
  <ion-header class="ion-no-border mt-8">
    <div
      class="flex items-center justify-between px-4  border-b-[1px] bg-white text-zinc-800 shadow-sm"
    >
      <div class="flex items-center">
        <!-- Back Button -->
        <button 
          class="p-1 rounded-full hover:bg-gray-100 transition-colors" 
          @click="handleBack"
          aria-label="Retour"
        >
          <IcIcons name="RiArrowLeftSLine" :size="28"></IcIcons>
        </button>
      </div>

      <!-- Title -->
      <div class="flex-1 text-center mx-2">
        <span class="text-lg font-bold truncate">{{ displayTitle }}</span>
      </div>

      <!-- Options Button -->
      <button 
        class="p-1 rounded-full hover:bg-gray-100 transition-colors" 
        @click="openOptions"
        aria-label="Options"
      >
        <IcIcons name="RiMore2Line" :size="22"></IcIcons>
      </button>
    </div>
  </ion-header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonHeader } from "@ionic/vue";
import IcIcons from "../icons/IcIcons.vue";

interface Props {
  title?: string;
  isBack?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: ""
});

// Computed properties
const displayTitle = computed(() => {
  return props.title || "Details";
});

// Methods
const handleBack = () => {
  if (props.isBack) {
    props.isBack();
  } else {
    window.history.length > 1 ? window.history.back() : null;
  }
};

const openOptions = () => {
  console.log("Options ouvertes !");
  // Implémentation future: ouvrir un menu d'options ou un modal
};
</script>

<style scoped>
.ion-header {
  position: relative;
  z-index: 10;
}
</style>
