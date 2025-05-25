<template>
  <div class="max-w-sm mx-auto font-love">
    <ul class="divide-y">
      <li
        v-for="notification in notifications"
        :key="notification.id"
        class="flex gap-2 px-2 justify-between py-4 transition-all duration-200"
        :class="{ 'bg-primary/20': !notification.isRead }"
        @click="redirectNotification(notification)"
      >
        <!-- Avatar de l'utilisateur -->
        <div class="flex items-start size-12 rounded-full overflow-hidden border border-gray-200">
          <img
            class="w-full h-full rounded-full object-cover"
            v-lazy="notification?.photo?.originalUrl || defaultAvatar"
            :alt="notification.profil?.fullname || 'Avatar'"
          />
        </div>
        
        <!-- Contenu de la notification -->
        <div class="flex flex-col gap-1 w-[calc(100%-48px)]">
          <span class="text-base font-bold">
            {{ notification.profil?.fullname || 'Utilisateur' }}
          </span>
          <span class="text-base font-medium" v-html="notification.message"></span>
          <p class="text-xs text-gray-500 mt-1">
            {{ formatDate(notification.createdAt) }}
          </p>
        </div>
      </li>
      
      <!-- Message si aucune notification -->
      <li v-if="notifications && notifications.length === 0" class="py-6 text-center text-gray-500">
        Aucune notification pour le moment
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { socketService } from "@/services/socket.services";
import { StorageUtils } from "@/utils/store.utils";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

// Suppression de l'import inutilisé
// import { an } from "vitest/dist/reporters-5f784f42";

// Interface pour les notifications
interface Notification {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  profil: {
    id: number;
    fullname: string;
    [key: string]: any;
  };
  photo: {
    originalUrl: string;
    [key: string]: any;
  };
  tolinkId?: number;
}

// Props
const props = defineProps({
  DataNotifications: {
    type: Array as () => Notification[],
    required: true,
    default: () => []
  }
});

// Image par défaut pour les avatars
const defaultAvatar = ref('/assets/default-avatar.png');

// Données des notifications
const notifications = computed(() => props.DataNotifications);

// Marquer une notification comme lue
const markAsReadNotification = async (notificationId: number) => {
  try {
    const userId = (await StorageUtils().getStore("nUser_Id"))?.value;
    
    if (!userId) {
      console.error("ID utilisateur non disponible");
      return;
    }
    
    // Émettre l'événement pour marquer comme lu
    socketService.emit("markAsReadNotification", {
      notificationId,
      userId
    });
    
    // Écouter la confirmation et mettre à jour les notifications
    socketService.on("notificationMarkedAsRead", async () => {
      socketService.emit("getNotifications", { userId });
    });
  } catch (error) {
    console.error("Erreur lors du marquage de la notification comme lue:", error);
  }
};

// Router pour la navigation
const router = useRouter();

// Rediriger vers la page appropriée en fonction du type de notification
const redirectNotification = (notification: Notification) => {
  // Marquer la notification comme lue
  markAsReadNotification(notification.id);
  
  // Redirection basée sur le type de notification
  switch (notification.type) {
    case "JOBS":
      router.push({
        name: "PROFIL_DETAIL",
        params: { id: notification.profil.id }
      });
      break;
      
    case "ABONNEMENT":
      router.push({
        name: "MySubscrible"
      });
      break;
      
    case "CONTRAT":
      router.push({
        name: "DETAIL_CONTRACT",
        params: { id: notification.tolinkId || 1 }
      });
      break;
      
    case "PROPOSITION":
      router.push({
        name: "CHAT_MESSAGE_DETAIL",
        params: { id: notification.tolinkId }
      });
      break;
      
    default:
      console.log(`Type de notification non géré: ${notification.type}`);
  }
};

// Formater une date en format lisible
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    
    return date.toLocaleDateString("fr-FR", options);
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error);
    return 'Erreur de date';
  }
};

// Formater le type de notification (fonction utilisée dans le template)
const formatType = (type: string): string => {
  if (!type) return 'Notification';
  
  switch (type.toLowerCase()) {
    case "abonnement":
      return "Abonnement";
    case "message":
      return "Message";
    case "jobs":
      return "Offre d'emploi";
    case "contrat":
      return "Contrat";
    case "proposition":
      return "Proposition";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
};
</script>

<style scoped>
/* Animations pour les notifications */
li {
  animation: fadeIn 0.3s ease-out;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

li:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Style pour les notifications non lues */
.bg-primary\/20 {
  position: relative;
}

.bg-primary\/20::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: rgb(247 124 61 / var(--tw-bg-opacity, 1)) /* #f77c3d */;
}
</style>
