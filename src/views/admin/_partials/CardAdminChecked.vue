<template>
  <!-- Main card container -->
  <article class="flex flex-col">
    <!-- Profile section -->
    <section v-if="data?.id" class="flex pt-4 font-love text-black">
      <!-- Profile link and details -->
      <RouterLink
        :to="{ name: 'PROFIL_DETAIL', params: { id: data.id } }"
        class="flex flex-col w-full gap-2 text-zinc-900"
      >
        <div class="flex w-full gap-2">
          <!-- Profile photo -->
          <div class="flex w-calc(100%-48px)">
            <img
              v-lazy="data.images[0]?.originalUrl"
              class="rounded-full size-12"
              alt="Profile photo"
            />
          </div>

          <!-- Profile information -->
          <div class="w-full flex flex-col gap-1">
            <span class="text-base font-black">{{ data.fullname }}</span>
            <p class="text-base">
              exp ({{ data.annees_experience }} ans) &#8226; âge ({{ data.age }}
              ans)
            </p>
            <div class="flex">
              <p class="text-sm text-gray-700 line-clamp-2">
                {{ data.tarif_horaire }} CFA/Heure &#8226;
                {{ data.tarif_mensuel }} CFA/Mois
              </p>
            </div>
          </div>
        </div>
      </RouterLink>

      <!-- Action menu -->
      <div class="relative">
        <button
          @click.stop="toggleMenu"
          class="flex items-center text-white font-bold text-sm rounded-lg py-2 px-3 "
          aria-label="Toggle menu"
        >
          <IcIcons name="RiMoreLine" :size="18" class="text-zinc-800" />
        </button>

        <!-- Dropdown menu with backdrop -->
        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div v-if="isOpen" class="fixed inset-0 z-50">
            <!-- Backdrop -->
            <div
              class="fixed inset-0 bg-black bg-opacity-50"
              @click="isOpen = false"
            ></div>

            <!-- Menu content -->
            <div
              class="absolute bottom-0 w-full bg-white rounded-none shadow-xl border border-gray-200 z-50 p-4"
            >
              <div class="py-2">
                <button
                  v-for="(action, index) in adminActions"
                  :key="index"
                  @click="handleActionClick(action, index)"
                  class="flex items-center w-full px-4 py-5 text-base hover:bg-gray-50 transition-colors duration-150"
                  :class="[action.color, 'text-white hover:brightness-110']"
                >
                  <SpinnerLoader v-if="action.loading" class="mr-2" />
                  <IcIcons :name="action.icon" :size="18" class="mr-3" />
                  <span class="font-medium">{{ action.title }}</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <!-- Documents gallery -->
    <section
      class="flex gap-2 ml-8 mt-2"
      @click="handleMediaView"
      role="button"
      aria-label="View documents"
    >
      <div v-for="(document, index) in data.documents" :key="index">
        <img
          v-lazy="document.originalUrl"
          class="rounded-md size-16"
          alt="Document preview"
        />
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useMediaStore } from "@/stores/mediaStore";
import { Dialer } from "capacitor-dialer";
import IcIcons from "@/components/icons/IcIcons.vue";
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";

// Types
interface AdminAction {
  icon: string;
  title: string;
  color: string;
  loading: boolean;
  actions: (data: any, index?: number) => void | Promise<void>;
}

interface Props {
  data: {
    id: string;
    images: Array<{ originalUrl: string }>;
    documents: Array<{ originalUrl: string }>;
    fullname: string;
    annees_experience: number;
    age: number;
    tarif_horaire: number;
    tarif_mensuel: number;
    phone: string;
  };
  updateValidation: (id: string) => Promise<void>;
  updateRejection: (id: string) => Promise<void>;
}

// Props and composables
const props = defineProps<Props>();
const router = useRouter();
const mediaStore = useMediaStore();

// State
const isOpen = ref(false);

// Admin actions configuration
const adminActions = reactive<AdminAction[]>([
  {
    icon: "RiCheckLine",
    title: "Valider",
    color: "bg-secondary",
    loading: false,
    actions: async (data: any, index?: number) => {
      const indexs = index || 0;
      adminActions[indexs].loading = true;
      await props.updateValidation(data.id);
      adminActions[indexs].loading = false;
    },
  },
  {
    icon: "RiCloseLine",
    title: "Rejeter",
    color: "bg-red-500",
    loading: false,
    actions: async (data: any, index?: number) => {
      const indexs = index || 0;
      adminActions[indexs].loading = true;
      await props.updateRejection(data.id);
      adminActions[indexs].loading = false;
    },
  },
  {
    icon: "RiPhoneLine",
    title: "Contactez",
    color: "bg-primary",
    loading: false,
    actions: (data: any, index?: number) => {
      Dialer.openDialer({ phoneNumber: data.phone });
    },
  },
]);

// Methods
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const handleActionClick = (action: AdminAction, index: number) => {
  action.actions(props.data, index);
  isOpen.value = false;
};

const handleMediaView = () => {
  mediaStore.state.mediaDocuments = props.data.documents;
  if (props.data?.id) {
    router.push({
      name: "AdminMediaDetail",
      params: { id: props.data.id },
    });
  }
};
</script>
