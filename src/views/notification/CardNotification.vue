<template>
    <div class="max-w-sm mx-auto  font-love">
      <!-- <h2 class="text-xl font-bold mb-4">Notifications</h2> -->
      <ul class="px-4">
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="flex flex-col gap-2 justify-between p-4 border-b  shadow-sm transition-all duration-200 hover:bg-gray-100"
          :class="{ 'bg-gray-100': !notification.isRead }"
          @click="RedirectNotification(notification)"
        >
          <div>
            <span class="text-base"> {{ notification.profil?.fullname }} </span>
            <p class="text-base font-semibold">
              <span class="capitalize">{{ formatType(notification.type) }} :</span>
              {{ notification.message }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatDate(notification.createdAt) }}
            </p>
          </div>
          <div class=" items-center space-x-2 hidden ">
            <button
              v-if="!notification.isRead"
              @click="markAsRead(notification.id)"
              class="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Marquer comme lu
            </button>
            <button
              @click="deleteNotification(notification.id)"
              class="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        </li>
      </ul>
      <p v-if="notifications.length === 0" class="text-gray-500 text-center mt-4">
        Aucune notification pour le moment.
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
import { useRouter } from 'vue-router';
  
  interface Notification {
    id: number;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    profil: any;
  }

  const props = defineProps(['DataNotifications'])
  
  // Données initiales des notifications
  const notifications = ref<Notification[]>(props.DataNotifications);
  
  // Marquer une notification comme lue
  const markAsRead = (id: number) => {
    const notification = notifications.value.find((n) => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
  };
  
  // Supprimer une notification
  const deleteNotification = (id: number) => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  };

const router = useRouter();
  const RedirectNotification = (notification:any) => {
    // Rediriger vers la page de notifications
    if(notification.type == "JOBS"){
      router.push({ name: "PROFIL_DETAIL", params: { id: notification.profil.id } });
    }
    
  }
  
  // Formater une date en format lisible
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Formater le type de notification
  const formatType = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'abonnement':
        return 'Abonnement';
      case 'message':
        return 'Message';
      default:
        return type;
    }
  };
  </script>
  
  <style scoped>
  /* Ajouter des animations légères */
  li {
    animation: fadeIn 0.3s ease-out;
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
  </style>
  