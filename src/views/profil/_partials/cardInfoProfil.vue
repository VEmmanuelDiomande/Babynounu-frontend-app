<template>
  <section
    v-if="hasData"
    class="flex flex-col gap-2 font-love bg-slate-100 p-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md"
  >
    <Heading2Text :title="title" :icon="iconName" />

    <div class="flex flex-wrap gap-2">
      <div 
        v-for="(item, index) in dataCardInfo" 
        :key="index"
        class="bg-zinc-100 text-zinc-800 px-3 py-2 rounded-lg text-sm font-medium transition-transform duration-200 hover:scale-105 hover:bg-zinc-200"
      >
        {{ item?.name || item }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Heading2Text from "@/components/texts/heading2Text.vue";
import { useProfilHook } from "@/hooks/Profile/profil.hook";
import { computed, defineProps } from "vue";

// Définition des props avec typage
interface CardItem {
  name: any;
  [key: string]: any;
}

const props = defineProps({
  dataCardInfo: {
    type: Array as () => (CardItem )[],
    default: () => []
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

// Extraction de la fonction GetIcon du hook
const { GetIcon } = useProfilHook();

// Computed properties pour optimiser les rendus
const hasData = computed(() => {
  return props.dataCardInfo && props.dataCardInfo.length > 0;
});

const iconName = computed(() => {
  return GetIcon(props.type);
});
</script>

<style scoped>
/* Animation pour les éléments de la carte */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Transition fluide */
.transition-transform {
  transition-property: transform;
}

.transition-all {
  transition-property: all;
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}
</style>
