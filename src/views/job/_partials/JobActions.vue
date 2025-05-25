<template>
  <div v-if="isOwner" class="mt-6 grid grid-cols-2 gap-1 animate-fade-in-up">
    <AuthButton
      :loading="isPendingDelete"
      title="Editer"
      icon="RiPencilLine"
      setcolor="bg-white border-[1px] border-primary"
      textcolor="text-primary"
      :actions="() => $emit('edit')"
    />
    <AuthButton
      @click="() => $emit('delete')"
      :loading="isPendingDelete"
      icon="RiDeleteBinLine"
      title="Supprimer"
      setcolor="bg-red-500"
    />
  </div>
  <div class="mt-6 animate-fade-in-up" v-else>
    <AuthButton
      @click="() => $emit('apply')"
      :disabled="!isNounu"
      :loading="isPending"
      :title="hasApplied ? 'Retirer ma candidature' : 'Postuler maintenant'"
      :setcolor="buttonColor"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AuthButton from "@/components/buttons/authButton.vue";

const props = defineProps({
  job: {
    type: Object,
    required: true
  },
  isOwner: {
    type: Boolean,
    default: false
  },
  isNounu: {
    type: Boolean,
    default: false
  },
  isPending: {
    type: Boolean,
    default: false
  },
  isPendingDelete: {
    type: Boolean,
    default: false
  }
});

defineEmits(['apply', 'delete', 'edit']);

const hasApplied = computed(() => 
  props.job?.jobApplications?.length > 0 && 
  props.job?.jobApplications[0]?.is_apply
);

const buttonColor = computed(() => {
  if (!props.isNounu) {
    return 'bg-gray-400/50';
  }
  
  if (hasApplied.value) {
    return 'bg-gray-400 border-[1px] border-gray-400';
  }
  
  return 'bg-primary';
});
</script>