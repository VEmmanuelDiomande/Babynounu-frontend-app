<template>
  <section class="grid grid-cols-2 gap-2 w-11/12 mx-auto my-4">
    <!-- Bouton Échanger (visible uniquement pour les parents visitant un profil) -->
    <div 
      v-if="!isOwner && userStore.typeProfil === 'parent'"
      @click="handleExchange"
      class="transition-transform duration-200 hover:scale-[1.02]"
    >
      <ActionProfilButton
        sizeText="medium"
        icon="RiMessage3Line"
        setcolor="bg-zinc-800 text-lg"
        title="Échanger"
      />
    </div>

    <!-- Bouton Éditer (visible uniquement pour le propriétaire du profil) -->
    <div 
      v-if="isOwner"
      @click="handleEditProfile"
      class="transition-transform duration-200 hover:scale-[1.02]"
    >
      <ActionProfilButton
        sizeText="medium"
        icon="RiEditLine"
        setcolor="bg-zinc-800 text-lg"
        title="Éditer"
      />
    </div>

    <!-- Bouton Poster (visible uniquement pour les parents sur leur propre profil) -->
    <div
      v-if="isOwner && userStore.typeProfil === 'parent'"
      @click="handleCreatePost"
      class="transition-transform duration-200 hover:scale-[1.02]"
    >
      <ActionProfilButton
        sizeText="medium"
        icon="RiQuillPenAiLine"
        setcolor="bg-secondary text-lg"
        title="Poster"
      />
    </div>

    <!-- Bouton de disponibilité (visible uniquement pour les nounous) -->
    <div
      v-if="userStore.typeProfil === 'nounu'"
      class="transition-transform duration-200 hover:scale-[1.02]"
    >
      <CntAvailableProfil 
        :data="profileData" 
        :status="profileData.status" 
        :isOwner="isOwner" 
        @status-updated="handleStatusUpdate"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { useProfilHook } from "@/hooks/Profile/profil.hook";
import { StorageUtils } from "@/utils/store.utils";
import ActionProfilButton from "@/components/buttons/actionProfilButton.vue";
import CntAvailableProfil from "./cntAvailableProfil.vue";

// Interface pour les données du profil
interface ProfileData {
  id: number;
  status: string;
  [key: string]: any;
}

// Props avec typage
const props = defineProps({
  Data: {
    type: Object as () => any,
    required: true
  },
  isOwner: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'nounu'
  }
});

// Émissions d'événements
const emit = defineEmits(['status-updated']);

// Stores et hooks
const router = useRouter();
const userStore = useUserStore();
const {
  OpenEditProfil,
  OpenEchange,
  Available
} = useProfilHook();

// Données calculées
const profileData = computed(() => props.Data);

// Gestionnaires d'événements
const handleEditProfile = () => {
  OpenEditProfil(profileData.value, props.type);
};

const handleExchange = async () => {
  try {
    const profileId = await StorageUtils().getStore("nProfil_1_Id");
    if (profileId?.value) {
      OpenEchange(router, profileData.value.id, profileId.value);
    } else {
      console.error("ID de profil non disponible");
    }
  } catch (error) {
    console.error("Erreur lors de l'échange:", error);
  }
};

const handleCreatePost = () => {
  router.push({ name: "JOB_CREATE" });
};

const handleStatusUpdate = (newStatus: string) => {
  emit('status-updated', newStatus);
};
</script>

<style scoped>
/* Animation au survol des boutons */
.hover\:scale-\[1\.02\]:hover {
  transform: scale(1.02);
}

/* Transition fluide */
.transition-transform {
  transition-property: transform;
}

.duration-200 {
  transition-duration: 200ms;
}
</style>
