<template>
  <IonHeader class="bg-white shadow-sm">
    <div
      class="flex items-center bg-white justify-between py-2 border-b-[1px] text-zinc-800 shadow"
    >
      <div class="flex gap-0">
        <!-- Back Button -->
        <button class="p-2 rounded" @click="goBack()">
          <IcIcons name="RiArrowLeftSLine" :size="24"></IcIcons>
        </button>

        <!-- Chat Info -->
        <div class="flex items-center gap-2">
          <img
            v-lazy="photo?.originalUrl"
            alt="User Avatar"
            class="size-9 rounded-full border-white"
          />

          <span class="text-lg font-bold">{{ Room?.fullname }}</span>
        </div>
      </div>

      <!-- Options Button -->
      <button class="p-2 rounded hover:bg-blue-600" @click="openOptions">
        <IcIcons name="RiMore2Line" :size="20"></IcIcons>
      </button>
    </div>
  </IonHeader>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import IcIcons from "../icons/IcIcons.vue";
import { useConversationStore } from "@/stores/conversationStore";
import { useRoute, useRouter } from "vue-router";
import { IonHeader } from "@ionic/vue";

defineProps(["Room", "photo"]);

const chatName = ref("John Doe"); // Nom de l'utilisateur ou du groupe
const chatStatus = ref("En ligne"); // Statut du chat
const avatar = ref("https://via.placeholder.com/150"); // Avatar par défaut

const openOptions = () => {
  // Fonction pour ouvrir les options du chat
  console.log("Options ouvertes !");
};

const route = useRoute();
const router = useRouter();
onMounted(() => {
  useConversationStore().state.RoomsOpenId = route.params.id;
});

const goBack = () => {
  // Fonction pour revenir en arrière
  useConversationStore().state.RoomsOpenId = null;
  router.go(-1);
};
</script>

<style scoped>
/* Style supplémentaire (si besoin) */
</style>
