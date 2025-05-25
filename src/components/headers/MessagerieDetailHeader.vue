<template>
  <IonHeader class="bg-white shadow-sm sticky top-0 z-10">
    <div
      class="flex items-center justify-between px-3 py-3 bg-white border-b border-gray-100 shadow-sm"
    >
      <!-- Section gauche (Bouton retour + Info utilisateur) -->
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <!-- Bouton retour avec effet de survol -->
        <button
          @click="goBack()"
          class="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 flex-shrink-0"
          aria-label="Retour"
        >
          <IcIcons name="RiArrowLeftSLine" :size="24" class="text-gray-700" />
        </button>

        <!-- Info utilisateur avec troncature pour les noms longs -->
        <div
          class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors duration-200"
          @click="openProfile"
        >
          <!-- Avatar avec indicateur de statut -->
          <div class="relative flex-shrink-0">
            <img
              v-lazy="photo?.originalUrl || defaultAvatar"
              alt="Photo de profil"
              class="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
              @error="handleImageError"
            />
            <!-- Indicateur de statut en ligne -->
            <span
              class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
              :class="{
                'bg-green-500': isOnline,
                'bg-gray-400': !isOnline,
              }"
            ></span>
          </div>

          <!-- Nom et statut -->
          <div class="flex flex-col min-w-0">
            <span
              class="text-lg font-semibold text-gray-800 truncate max-w-[150px]"
            >
              {{ Room?.fullname || "Utilisateur" }}
            </span>
            <span
              class="text-xs font-medium truncate flex items-center gap-1"
              :class="{
                'text-green-600': isOnline,
                'text-gray-500': !isOnline,
              }"
            >
              <span
                class="inline-block w-1.5 h-1.5 rounded-full"
                :class="{
                  'bg-green-500 animate-pulse': isOnline,
                  'bg-gray-400': !isOnline,
                }"
              ></span>
              {{ isOnline ? "En ligne" : "Hors ligne" }}
            </span>
          </div>
        </div>
      </div>

      <!-- Section droite (Actions) -->
      <div class="flex items-center gap-2">
        <!-- Bouton d'appel -->
        <button
          class="p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200 flex-center"
          @click="startCall"
          aria-label="Appeler"
        >
          <IcIcons name="RiVideoChatLine" :size="20" class="text-gray-700" />
        </button>

        <!-- Bouton d'options avec menu déroulant -->
        <div class="relative">
          <button
            @click="toggleOptions"
            class="p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200 flex-center"
            aria-label="Options"
            ref="optionsButton"
          >
            <IcIcons name="RiMore2Line" :size="20" class="text-gray-700" />
          </button>

          <!-- Menu déroulant -->
          <transition name="dropdown">
            <div
              v-if="showOptions"
              class="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg py-1.5 z-20 border border-gray-200 overflow-hidden"
            >
              <a
                href="#"
                class="px-4 py-2.5 text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
              >
                <IcIcons name="RiUserLine" :size="20" class="text-gray-600" />
                <span>Voir le profil</span>
              </a>
              <a
                href="#"
                class="px-4 py-2.5 text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
              >
                <IcIcons
                  name="RiNotificationLine"
                  :size="20"
                  class="text-gray-600"
                />
                <span>Gérer les notifications</span>
              </a>
              <div class="border-t border-gray-100 my-1"></div>
              <a
                href="#"
                class="px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-150"
              >
                <IcIcons
                  name="RiDeleteBinLine"
                  :size="20"
                  class="text-red-600"
                />
                <span>Supprimer la conversation</span>
              </a>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </IonHeader>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import IcIcons from "../icons/IcIcons.vue";
import { useConversationStore } from "@/stores/conversationStore";
import { useRoute, useRouter } from "vue-router";
import { IonHeader } from "@ionic/vue";
import { socketService } from "@/services/socket.services";

const props = defineProps({
  Room: {
    type: Object,
    default: () => ({}),
  },
  photo: {
    type: Object,
    default: () => ({}),
  },
  activeConversation: {
    type: [String, Number],
    default: null,
  },
});

// Variables réactives
const isOnline = ref(false);
const showOptions = ref(false);
const optionsButton = ref();
const defaultAvatar = ref(
  "https://ui-avatars.com/api/?name=" +
    (props.Room?.fullname || "User") +
    "&background=random"
);

const route = useRoute();
const router = useRouter();

// Vérifier le statut en ligne de l'utilisateur
const checkOnlineStatus = () => {
  if (!socketService || !props.Room?.id) return;

  // Écouter l'événement userOnline pour mettre à jour le statut
  socketService.on("userOnline", (userId) => {
    if (userId === props.Room?.id) {
      isOnline.value = true;
    }
  });

  // Écouter l'événement userOffline pour mettre à jour le statut
  socketService.on("userOnlineStatus", ({ userId, isOnline }) => {
    if (userId === props.Room?.id) {
      if(isOnline){
        isOnline.value = true;
        return;
      }
      isOnline.value = false;
    }
  });

  // Demander le statut actuel
  socketService.emit("userOnline", props.Room?.id);
};

// Gérer les erreurs de chargement d'image
const handleImageError = (event: any) => {
  event.target.src = defaultAvatar.value;
};

// Basculer l'affichage des options
const toggleOptions = () => {
  showOptions.value = !showOptions.value;
};

// Ouvrir le profil de l'utilisateur
const openProfile = () => {
  if (!props.Room?.id) return;
  router.push({ name: "profile", params: { id: props.Room.id } });
};

// Démarrer un appel vidéo
const startCall = () => {
  if (!props.Room?.id) return;
  // Logique pour démarrer un appel
  console.log("Démarrer un appel avec", props.Room.fullname);
};

// Notifier le serveur que les conversations ont été mises à jour
function conversationsUpdated() {
  if (!socketService || !props.activeConversation) return;
  socketService.emit(
    "conversationsUpdated",
    parseInt(props.activeConversation.toString())
  );
}

// Quitter la salle de conversation
const leaveRoom = () => {
  if (!socketService || !props.activeConversation) return;
  socketService.emit(
    "leaveRoom",
    parseInt(props.activeConversation.toString())
  );

  // Désabonner des événements de statut
  socketService.off("userOnline");
  socketService.off("userOffline");
};

// Retourner à la page précédente
const goBack = () => {
  leaveRoom();
  useConversationStore().state.RoomsOpenId = null;
  conversationsUpdated();
  router.go(-1);
};

// Fermer le menu déroulant lorsqu'on clique ailleurs
const handleClickOutside = (event: any) => {
  if (optionsButton.value && !optionsButton.value.contains(event.target)) {
    showOptions.value = false;
  }
};

// Observer les changements de Room pour mettre à jour le statut
watch(
  () => props.Room,
  () => {
    checkOnlineStatus();
  },
  { deep: true }
);

// Initialisation au montage du composant
onMounted(() => {
  useConversationStore().state.RoomsOpenId = route.params.id;
  document.addEventListener("click", handleClickOutside);
  checkOnlineStatus();
});

// Nettoyage lors du démontage du composant
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  socketService.off("userOnline");
  socketService.off("userOffline");
});
</script>

<style scoped>
/* Transition pour le menu déroulant */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top right;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Utilitaire pour centrer les éléments */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animation de pulsation pour l'indicateur en ligne */
@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
