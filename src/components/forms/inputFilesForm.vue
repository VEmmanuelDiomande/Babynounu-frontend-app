<template>
  <div class="file-upload space-y-4 font-love">
    <div class="flex flex-col gap-1 w-full">
      <label
        class="text-label font-love font-semibold text-zinc-800 rounded-md z-50"
        :for="'id_input_' + name"
        >{{ label }}</label
      >
      <span class="text-sm font-love font-normal text-zinc-500" v-if="LabelSub">
        {{ LabelSub }}
      </span>
    </div>
    <!-- Zone de dépôt -->
    <div
      class="drop-zone py-4 px-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer transition-colors duration-200"
      :class="{
        'border-green-500 bg-green-50': isDragging,
        'bg-gray-50 hover:bg-gray-100': !isDragging && !modelValue?.length,
      }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <span v-if="!modelValue?.length" class="text-gray-500 mb-4">
        Glissez-déposez des images ici ou
      </span>
      <input
        type="file"
        ref="fileInput"
        multiple
        accept="image/*"
        @change="handleFileChange"
        class="hidden w-0 h-0 fixed opacity-0"
        :name="name"
      />
      <button
        @click="triggerFileInput"
        class="upload-button px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/85 transition-colors duration-200"
      >
        Sélectionner des fichiers
      </button>
    </div>

    <!-- Aperçu des images -->
      <!-- Aperçu des images -->

    <div
      v-if="useProfiNounulStore().GALLERY_PREVIEW?.length"
      class="image-preview grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      <div
        v-for="(file, index) in useProfiNounulStore().GALLERY_PREVIEW"
        :key="file.filename + index"
        class="preview-item relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        <img
          :src="file.originalUrl"
          :alt="file.name"
          class="preview-image w-full h-32 object-cover"
        />
        <div class="absolute left-16 top-14" v-if="isLoading" >
          <SpinnerLoader size="large" class-custom="text-secondary"  />
        </div>
        <button 
          :disabled="isPending"
          @click="removeFileOnMedia(index, file.id)"
          class="remove-button absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
        >
          ×
        </button>
      </div>
    </div>

    <div
      v-if="modelValue?.length"
      class="image-preview grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      <div
        v-for="(file, index) in modelValue"
        :key="file.name + index"
        class="preview-item relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        <img
          :src="file.preview"
          :alt="file.name"
          class="preview-image w-full h-32 object-cover"
        />
        <button
          @click="removeFile(index)"
          class="remove-button absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Bouton pour ajouter plus d'images -->
    <div class="flex">
      <button
        v-if="modelValue?.length"
        @click="triggerFileInput"
        class="flex  add-more-button w-4/12 px-6 py-3 bg-secondary text-white rounded-lg transition-colors duration-200"
      >
      <IcIcons name="RiAddLine" :size="20"  />
      <span class="">Ajouter</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { StorageUtils } from "@/utils/store.utils";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
import SpinnerLoader from "../loaders/spinnerLoader.vue";
import IcIcons from "../icons/IcIcons.vue";

interface FileWithPreview extends File {
  preview: string;
}

const props = defineProps<{
  modelValue: FileWithPreview[];
  label: string;
  LabelSub: string;
  name: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", files: FileWithPreview[]): void;
}>();

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// Gérer la sélection de fichiers
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    addFiles(Array.from(target.files));
  }
};

// Gérer le glisser-déposer
const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files));
  }
};

// Ajouter des fichiers avec prévisualisation
const addFiles = (newFiles: File[]) => {
  const updatedFiles = [...props.modelValue];
  newFiles.forEach((file) => {
    if (file.type.startsWith("image/")) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      updatedFiles.push(fileWithPreview);
    }
  });
  emit("update:modelValue", updatedFiles);
};

// Supprimer un fichier
const removeFile = (index: number) => {
  const updatedFiles = [...props.modelValue];
  updatedFiles.splice(index, 1);
  emit("update:modelValue", updatedFiles);
};



// Déclencher l'input de fichier
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};
const idMediaI = ref("");

const removeFileOnMedia = (index: number, idMedia: any) => {
  idMediaI.value = idMedia;
  DeleteMediaGallery(idMediaI.value).then((data) => {
    if(data){
      const updatedFiles = [...useProfiNounulStore().GALLERY_PREVIEW];
  updatedFiles.splice(index, 1);
  useProfiNounulStore().GALLERY_PREVIEW = updatedFiles;
    }
  }).catch(() => {
    isLoading.value = false
  });
  
};

const isLoading = ref(false)
const DeleteMediaGallery = async (idMediaI?:any) => {
  const settingServices = SettingServices();
  if (settingServices.useCreateSetting) {
   const {data} = await settingServices.useCreateSetting(
      URL_API_ROUTE.MEDIA_DELETE + `/${idMediaI}`,
      {}, isLoading.value
    );
    return data
  }
  return null
};

const queryClient = useQueryClient();
const { mutate: DeleteMedia, isPending, isError, error, isSuccess } = useMutation({
  mutationKey: ["delete-media"],
  mutationFn: DeleteMediaGallery,
  onSuccess: () => {
    // Rafraîchir les données ou effectuer d'autres actions après la suppression
    queryClient.invalidateQueries(["media-gallery"]);
  },
});

const handleDeleteMedia = () => {
  DeleteMedia();
};
</script>
