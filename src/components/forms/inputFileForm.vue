<template>
  <div class="flex flex-col items-center gap-1 mb-4 z-40 font-love">
    <label
      for="fileUpload"
      class="cursor-pointer w-40 h-40 rounded-lg border-2 border-dashed flex text-center font-love items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
    >


      <img
        v-if="useProfiNounulStore().IMAGE_PREVIEW?.originalUrl || previewUrl"
        v-lazy="previewUrl ? previewUrl : useProfiNounulStore().IMAGE_PREVIEW.originalUrl"
        alt="Aperçu"
        class="w-full h-full object-cover rounded-lg"
      />

      <div
        class="flex flex-col items-center justify-center text-center gap-1"
        v-else
      >
        <IcIcons name="RiImageAddLine" class="flex w-full" :size="65" />
        <span class="text-gray-500 text-xs w-10/12"
          >Cliquez pour associé une image à votre profil.</span
        >
      </div>
    </label>

    <input
      id="fileUpload"
      type="file"
      accept="image/*"
      class="hidden opacity-0 w-0 h-0"
      @change="handleFileUpload"
    />

    <span
      class="text-red-400 text-sm font-bold "
      v-if="error?.path == name"
    >
      {{ error?.message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import IcIcons from "../icons/IcIcons.vue";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";

const props = defineProps({
  modelValue: {
    type: File,
    default: null,
  },
  name: {
    type: String,
  },
  error: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);
const previewUrl = ref<string | null>(null);

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  const fileToSend = (event.target as HTMLInputElement).files;
  if (file) {
    emit("update:modelValue", fileToSend);

    // Générer un aperçu de l'image
    const reader = new FileReader();
    reader.onload = () => {
      previewUrl.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};
</script>
