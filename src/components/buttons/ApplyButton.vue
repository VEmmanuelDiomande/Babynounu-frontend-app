<template>
  <div class="mt-2">
    <div class="flex flex-row gap-1">
      <button
        class="flex items-center gap-1 px-2 py-2 text-white rounded-lg text-sm font-semibold w-full"
        @click="$emit('apply')"
        :disabled="isPending"
        :class="isApplied ? 'bg-gray-400' : 'bg-primary'"
      >
        <div class="flex w-full items-center justify-center gap-2">
          <IcIcons name="RiCoinsFill" :size="16" />
          <span>
            {{ isApplied ? "Retirer ma candidature" : "Postuler maintenant" }}
          </span>
        </div>
        <SpinnerLoader
          size="small"
          classCustom="text-white"
          v-show="isPending"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";

defineProps({
  isApplied: {
    type: Boolean,
    default: false
  },
  isPending: {
    type: Boolean,
    default: false
  }
});

defineEmits(['apply']);
</script>