<template>
  <IonContent class="ion-padding h-full flex flex-col gap-8">
    <div class="flex justify-center">
      <HeadingText text="Galeries" size="medium" />
    </div>

    <div class="flex flex-col font-love gap-2">
      <!-- Étiquette de champ -->
      <label
        for="id_input_gallery"
        class="text-label font-semibold text-zinc-800 rounded-md py-1 border-dashed border-2 h-16 border-primary justify-center flex items-center gap-2"
      >
      <IcIcons :name="'RiImageAddLine'" :size="20" />
        Ajoutez des images de vous
      </label>
      

      <!-- Champ de fichier -->
      <input
        accept="image/*"
        type="file"
        id="id_input_gallery"
        name="gallery"
        @change="onFileChange"
        class="cursor-pointer opacity-0 w-0 h-0"
        multiple
      />

      <!-- Message d'erreur -->
      <span class="text-sm text-red-500" v-if="error?.path === 'gallery'">
        {{ error?.message }}
      </span>

      <!-- Aperçu des images -->
      <div
        v-if="pathImage.length > 0"
        class="grid grid-cols-2 gap-1  w-full rounded-md overflow-hidden"
      >
        <div v-for="(item, index) in pathImage" :key="index" class="relative">
          <img
            :src="item"
            alt="Aperçu de l'image"
            class="object-cover w-full h-48 rounded-lg"
          />
          <!-- Bouton pour supprimer l'image -->
          <button
            @click="removeImage(index)"
            class="absolute top-1 right-1 size-6 bg-red-500 text-white text-xs rounded-full p-1 transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>

      
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import HeadingText from "@/components/texts/headingText.vue";
import { ref } from "vue";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import IcIcons from "@/components/icons/IcIcons.vue";
import { IonContent } from "@ionic/vue";

// Store et état local
const error = useProfiNounulStore().state.in_error;
const selectedImages = ref<File[]>([]);
const pathImage = ref<string[]>([]);

// Fonction pour gérer le changement de fichier
const onFileChange = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  const files: any = fileInput.files;

  if (!files) return;

  // Ajoute de nouvelles images tout en évitant les doublons
  for (const file of files) {
    if (!selectedImages.value.some((img) => img.name === file.name)) {
      selectedImages.value.push(file);
      pathImage.value.push(URL.createObjectURL(file));
      useProfiNounulStore().state.GaleryValue.gallery.push(file)
    }
  }
};

// Fonction pour supprimer une image
const removeImage = (index: number) => {
  selectedImages.value.splice(index, 1);
  pathImage.value.splice(index, 1);
  useProfiNounulStore().state.GaleryValue.gallery.push(...selectedImages.value);
};
</script>

<style>
/* Styles supplémentaires */
input[type="file"] {
  display: block;
  margin-top: 10px;
}

img {
  object-fit: cover;
}

button {
  cursor: pointer;
}
</style>
