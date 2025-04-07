<template>
  <div
    v-if="
      useUserStore().isOwner == false &&
      useAbonnementStore().isAbonnement == false
    "
    class="fixed bottom-0 w-full bg-gradient-to-t from-white to-white/80 z-50 pt-8 px-4 font-love"
  >
    <div class="flex flex-col gap-1 p-4">
      <div class="flex flex-col gap-2 justify-center text-center">
        <span class="text-lg font-bold">Abonnement</span>
        <span class="text-sm">
          Abonnez-vous pour voir davantage d'informations sur
          <strong>{{ Data.fullname }}</strong
          >, {{ Data.year_experience }} ans d'expérience, Profil(vérifiés)
        </span>
      </div>
      <div class="mt-2" @click="OpenModelAbonnement()">
        <ActionProfilButton
          sizeText="medium"
          icon="RiPaypalLine"
          setcolor="bg-zinc-800 text-lg"
          title="Souscrire"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ActionProfilButton from "@/components/buttons/actionProfilButton.vue";
import { useProfilHook } from "@/hooks/Profile/profil.hook";
import { useAbonnementStore } from "@/stores/abonnementStore";
import { useUserStore } from "@/stores/user.store";
import { StorageUtils } from "@/utils/store.utils";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

defineProps({
  Data: {
    type: Object,
    default: null,
  },

  isMainProfil: {
    type: Boolean,
    default: false,
  },
});
const route = useRoute();

const { OpenModelAbonnement, isAbonnement } = useProfilHook();
</script>
