<template>
  <IonHeader class="flex flex-col relative bg-white w-full shadow-none">
    <div
      class="m-auto h-12 flex items-center w-10/12"
      v-if="countScroll === 0"
      :class="{
        'transition-all duration-1000 ease-in-out': true,
        'translate-y-0 opacity-100': countScroll === 0,
        '-translate-y-full opacity-0': countScroll !== 0,
      }"
    >
      <div slot="start" class="flex items-center gap-4 relative right-3">
        <MenuButtonHeader :isLogged="useUserStore().isLogged" :isAdmin="useUserStore().isAdmin" />
        <div class="text-xl font-anton animate-fade-in">{{ Title }}</div>
      </div>
    </div>
  </IonHeader>

  <!-- Section Sticky -->
  <div class="sticky top-0 bg-white py-1" v-if="!isNoSerach">
    <div
      class="flex flex-row items-center gap-2 px-2 bg-gray-100 rounded-2xl w-11/12 m-auto z-40 animate-slide-in"
      v-if="!hasSearch"
    >
      <div class="flex w-full items-center gap-2">
        <IcIcons name="RiSearch2Line" :size="24" class="text-primary" />
        <slot name="ContentSearchUp" />
      </div>

      <!-- Clear Icon for Search -->
      <IcIcons
        v-if="useNounuStore().searchValueData"
        name="RiCloseLine"
        :size="24"
        class="text-primary cursor-pointer animate-pulse"
        @click="clearSearch"
      />

      <IcIcons
        @click="OpenModalFilter"
        name="RiEqualizer2Line"
        v-if="hasFilter"
        :size="24"
        class="text-primary"
      />
    </div>

    <!-- Content Slot for Custom Content -->
    <slot name="ContentSearch" />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps([
  "Title",
  "PlaceholderSearch",
  "countScroll",
  "hasSearch",
  "searchFunc",
  "isNoSerach",
  "searchDate",
  "hasFilter",
]);

import MenuButtonHeader from "@/components/headers/MenuButtonHeader.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { useJobStore } from "@/stores/jobStore";
import { useNounuStore } from "@/stores/nounu.store";
import { useScrollStore } from "@/stores/scrollStore";
import { useUserStore } from "@/stores/user.store";
import { ScrollUtils } from "@/utils/scroll.utils";
import { IonButtons, IonHeader, IonMenuButton } from "@ionic/vue";
import { computed } from "vue";

// Function to clear the search input
const clearSearch = () => {
  useNounuStore().searchValueData = "";
};

// Focus handler
const onSearchFocus = () => {
  // Optional: handle focus logic here (e.g., highlight input or change styles)
};

// Blur handler
const onSearchBlur = () => {
  // Optional: handle blur logic here (e.g., reset styles or validate input)
};

// Search function on Enter
const searchFuncUnder = () => {
  props.searchFunc(
    props.searchDate
      ? useJobStore().state.searchValueData
      : useNounuStore().searchValueData
  );
};

const OpenModalFilter = () => {
  const modal = document.getElementById("open-modal-filter-search");
  modal?.click();
};
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spinSlow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-in-out;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out;
}

.animate-spin-slow {
  animation: spinSlow 5s linear infinite;
}

.animate-pulse {
  animation: pulse 1.5s infinite;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

/* Optional: Additional custom styles for icons, buttons, etc. */
input:focus {
  outline: none;
  border: 0px solid #007bff; /* Example: add blue border on focus */
}
</style>
