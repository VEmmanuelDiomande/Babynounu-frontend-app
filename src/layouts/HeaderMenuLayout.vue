<template>
  <IonHeader class="flex flex-col relative bg-white w-full shadow-none">
    <div class="m-auto h-12 flex items-center w-10/12" v-if="countScroll === 0" 
         :class="['transition-transform duration-1000 ease-in-out', countScroll === 0 ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0']">
      <div slot="start" class="flex items-center gap-4 relative right-3">
        <MenuButtonHeader :isLogged="useUserStore().isLogged" />
        <div class="text-xl font-anton">{{ Title }}</div>
      </div>
    </div>
  </IonHeader>

  <!-- Section Sticky -->
  <div class="sticky top-0 bg-white py-1 z-40" v-if="!isNoSerach">
    <div class="flex flex-row items-center gap-2 px-2 bg-gray-100 rounded-2xl w-11/12 m-auto z-40" v-if="!hasSearch">
      <div class="flex w-full items-center gap-2">
        <IcIcons name="RiSearch2Line" :size="24" class="text-primary" />
        <input
          type="text"
          :placeholder="PlaceholderSearch"
          class="h-11 outline-none font-love text-base w-full bg-transparent border-5 active:outline-none"
          v-model="useNounuStore().searchValueData"
          @keyup.enter="searchNounu"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
        />
      </div>

      <!-- Clear Icon for Search -->
      <IcIcons 
        v-if="useNounuStore().searchValueData" 
        name="RiCloseLine" 
        :size="24" 
        class="text-primary cursor-pointer" 
        @click="clearSearch" 
      />
      
      <IcIcons name="RiEqualizer2Line" :size="24" class="text-primary" />
    </div>

    <!-- Content Slot for Custom Content -->
    <slot name="ContentSearch" />
  </div>
</template>

<script lang="ts" setup>
defineProps(["Title", "PlaceholderSearch", "countScroll", "hasSearch", "searchNounu", "isNoSerach"]);
import MenuButtonHeader from "@/components/headers/MenuButtonHeader.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { useNounuStore } from "@/stores/nounu.store";
import { useUserStore } from "@/stores/user.store";
import { IonButtons, IonHeader, IonMenuButton } from "@ionic/vue";

// Function to clear the search input
const clearSearch = () => {
  useNounuStore().searchValueData = '';
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
const searchNounu = () => {
  if (useNounuStore().searchValueData.trim()) {
    // Trigger search if the input is not empty
    useNounuStore().searchValueData = useNounuStore().searchValueData.trim();
    // Call a custom search function or API here
  }
};
</script>

<style scoped>
/* You can add custom styles for the input, buttons, or icons here */
input:focus {
  outline: none;
  border: 0px solid #007bff; /* Example: add blue border on focus */
}

/* Optional: Additional custom styles for icons, buttons, etc. */
</style>
