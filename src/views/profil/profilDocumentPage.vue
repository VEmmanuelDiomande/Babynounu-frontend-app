<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="h-16 flex items-center mx-2">
        <ion-buttons slot="start">
          <IcIcons
            name="RiArrowLeftLine"
            :size="32"
            class="text-2xl"
            @click="backToProfil"
          />
        </ion-buttons>
        <ion-title class="text-xl font-bold font-love">Mes Documents</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="p-4 font-love">
      <!-- Document list -->
      <div class="space-y-4">
        <!-- Maximum documents warning -->
        <div
          v-if="documents.length >= MAX_DOCUMENTS"
          class="bg-yellow-100 p-4 rounded-lg mb-4"
        >
          <p class="text-yellow-700 font-love">
            Maximum de {{ MAX_DOCUMENTS }} images autorisées. Veuillez supprimer
            une image existante avant d'en télécharger une nouvelle.
          </p>
        </div>

        <!-- Documents list -->
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="bg-white rounded-lg shadow-md p-4"
        >
          <div class="flex justify-between items-center">
            <div class="space-y-1">
              <h3 class="text-lg font-semibold truncate w-32 text-gray-800">
                {{ doc.name }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ formatDate(doc.uploadDate) }}
              </p>
            </div>

            <div class="flex space-x-2">
              <ion-button
                fill="outline"
                size="small"
                @click="viewDocument(doc.id)"
              >
                <ion-icon :icon="eyeOutline" class="mr-1"></ion-icon>
                View
              </ion-button>

              <ion-button
                fill="outline"
                size="small"
                color="danger"
                @click="deleteDocument(doc.id)"
              >
                <ion-icon :icon="trashOutline" class="mr-1"></ion-icon>
                Delete
              </ion-button>
            </div>
          </div>

          <!-- Image preview -->
          <img
            v-if="isImageType(doc.type)"
            :src="doc.url"
            class="mt-3 max-h-48 rounded-lg object-cover"
            alt="Document preview"
          />
          {{doc}}
        </div>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <div class="p-4">
          <div class="flex flex-col items-center w-full font-love">
            <div class="flex flex-col w-full">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileUpload"
                accept="image/*"
                class="hidden w-[0px]"
                multiple
                :disabled="isMaxDocumentsReached"
              />

              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
                @click="handleUploadClick"
                :class="{
                  'opacity-50 cursor-not-allowed': isMaxDocumentsReached,
                }"
              >
                <!-- Multiple files preview -->
                <div
                  v-if="filesPreview.length > 0"
                  class="grid grid-cols-3 gap-2 mb-3"
                >
                  <div
                    v-for="(preview, index) in filesPreview"
                    :key="index"
                    class="relative"
                  >
                    <img
                      :src="preview.url"
                      class="h-24 w-full object-cover rounded-lg"
                      alt="Image preview"
                    />
                    <button
                      @click.stop="removePreview(index)"
                      class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <p class="text-gray-600">
                  {{
                    isMaxDocumentsReached
                      ? "Maximum images reached"
                      : "Click to select images"
                  }}
                </p>

                <p class="text-sm text-gray-500 mt-1">
                  {{ documents.length }}/{{ MAX_DOCUMENTS }} images uploaded
                </p>
              </div>
            </div>

            <ion-button
              :disabled="filesToUpload.length === 0 || isMaxDocumentsReached"
              @click="uploadDocuments"
              class="font-semibold mt-4 w-full font-love"
              :class="{
                'opacity-50 cursor-not-allowed':
                  filesToUpload.length === 0 || isMaxDocumentsReached,
              }"
            >
              <ion-icon :icon="cloudUploadOutline" class="mr-2"></ion-icon>
              Upload ({{ filesToUpload.length }})
            </ion-button>
          </div>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonButton,
  IonIcon,
  toastController,
} from "@ionic/vue";
import {
  eyeOutline,
  downloadOutline,
  cloudUploadOutline,
  trashOutline,
} from "ionicons/icons";
import axios from "axios";
import { useMutation } from "@tanstack/vue-query";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useRoute } from "vue-router";
import IcIcons from "@/components/icons/IcIcons.vue";

const route = useRoute();

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: Date;
}

interface FilePreview {
  url: string;
  file: File;
}

// Constants
const MAX_DOCUMENTS = 3;

// Refs
const documents = ref<Document[]>([]);
const filesToUpload = ref<File[]>([]);
const filesPreview = ref<FilePreview[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

// Computed
const isMaxDocumentsReached = computed(
  () => documents.value.length >= MAX_DOCUMENTS
);
const remainingSlots = computed(() => MAX_DOCUMENTS - documents.value.length);

// Methods
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};

const isImageType = (type: string): boolean => {
  return type.startsWith("image/");
};

const handleUploadClick = (): void => {
  if (isMaxDocumentsReached.value) return;
  fileInput.value?.click();
};

const handleFileUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement;

  if (!target.files || target.files.length === 0) return;

  // Clear previous selection
  filesToUpload.value = [];
  filesPreview.value = [];

  // Calculate how many files we can actually accept
  const availableSlots = remainingSlots.value;
  const filesToProcess = Math.min(availableSlots, target.files.length);

  for (let i = 0; i < filesToProcess; i++) {
    const file = target.files[i];
    if (!file.type.startsWith("image/")) continue;

    filesToUpload.value.push(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      filesPreview.value.push({
        url: e.target?.result as string,
        file: file,
      });
    };
    reader.readAsDataURL(file);
  }

  // Reset input to allow selecting same files again
  if (fileInput.value) {
    fileInput.value.value = "";
  }

  if (target.files.length > availableSlots) {
    showToast(`Only ${availableSlots} files can be uploaded`);
  }
};

// Mutation for upload
const toResult = ref<any>(false);
const { mutate: uploadDocumentsMutation } = useMutation({
  mutationFn: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => formData.append(`documents`, file));
    return await axios.post(
      URL_API_ROUTE.MEDIA_DOCUMENT.replace(
        ":userId",
        String(route.query?.userId)
      ),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  onSuccess: (data: any) => {
    toResult.value = data;
    showToast("Files uploaded successfully!");

    // You might want to refetch documents here
  },
  onError: () => {
    showToast("Error uploading files", "danger");
  },
});

const backToProfil = () => {
  window.history.back();
};

const removePreview = (index: number): void => {
  filesPreview.value.splice(index, 1);
  filesToUpload.value.splice(index, 1);
};

const uploadDocuments = async (): Promise<void> => {
  if (filesToUpload.value.length === 0 || isMaxDocumentsReached.value) return;

  try {
    if (filesToUpload.value.length == 0)
      return showToast("Veillez ajouter des images", "danger");

    await uploadDocumentsMutation(filesToUpload.value);

    setTimeout(() => {
      // Assuming the server responds with the uploaded document
      if (toResult.value?.data.success) {
        axios.post(
          `${URL_API_ROUTE.NOUNU_PENDING_CERTIFICATION.replace(
            ":id",
            String(route.query?.nounuId)
          )}`,
          {
            test: "test",
          }
        );
        // Add new documents to the list (temporarily until server response)
        documents.value = [
          ...documents.value,
          ...filesToUpload.value.map((file) => ({
            id: toResult.value?.data.data.id,
            name: file.name,
            type: file.type,
            url: toResult.value?.data.data.originalUrl,
            uploadDate: toResult.value?.data.data.createdAt,
          })),
        ];

        // Reset upload state
        filesToUpload.value = [];
        filesPreview.value = [];
      } else {
        showToast("Error uploading files", "danger");
      }
    }, 1000);
  } catch (error) {
    console.error("Error uploading documents:", error);
    showToast("Error uploading files", "danger");
  }
};

const deleteDocument = async (docId: string): Promise<void> => {
  try {
    await axios.post(
      `${URL_API_ROUTE.MEDIA_DELETES.replace(":mediaId", docId)}`
    );
    documents.value = documents.value.filter((doc) => doc.id !== docId);
    showToast("Document deleted");
  } catch (error) {
    console.error("Error deleting document:", error);
    showToast("Error deleting document", "danger");
  }
};

const showToast = async (message: string, color: string = "success") => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
  });
  await toast.present();
};

const viewDocument = (docId: string): void => {
  const doc = documents.value.find((d) => d.id === docId);
  if (doc) {
    window.open(doc.url, "_blank");
  }
};

const downloadDocument = (docId: string): void => {
  const doc = documents.value.find((d) => d.id === docId);
  if (doc) {
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.name;
    link.click();
  }
};

// Fetch initial documents
onMounted(async () => {
  try {
    const response = await axios.get(
      URL_API_ROUTE.MEDIA_DOCUMENT.replace(
        ":userId",
        String(route.query?.userId)
      )
    );
    documents.value = response.data.map((doc: any) => ({
      id: doc.id,
      name: doc.filename,
      type: "image/jpeg",
      url: doc.originalUrl,
      uploadDate: doc.createdAt,
    }));
    console.log(documents.value);
  } catch (error) {
    console.error("Error fetching documents:", error);
    showToast("Error loading documents", "danger");
  }
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
