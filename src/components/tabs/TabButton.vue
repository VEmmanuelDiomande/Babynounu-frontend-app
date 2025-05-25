<template>
  <ion-tab-button :tab="tab.tab" :href="tab.link" class="flex gap-2">
    <div
      v-if="!tab.name"
      class="w-14 h-10 bg-gray-100 flex justify-center items-center rounded-xl"
    >
      <RiAddLine size="28" class="text-gray-400" />
    </div>
    <div
      v-else
      class="flex flex-col justify-center items-center"
      @click="$emit('update-page', tab)"
    >
      <IcIcons
        :name="getIconName(tab)"
        :size="tab.name ? 28 : 38"
        :class="getIconClass(tab)"
      />
      <p class="text-xr font-love" :class="getTextClass(tab)">
        {{ tab.name }}
      </p>
      <NotificationBadge 
        v-if="tab.tab === 'tab4' && hasNotifications" 
        :count="notificationCount || 0"
      />
      <NotificationBadge 
        v-if="tab.tab === 'tab3' && hasUnreadMessages" 
        :count="unreadMessagesCount || 0" 
      />
    </div>
  </ion-tab-button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { IonTabButton } from "@ionic/vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { RiAddLine } from "@remixicon/vue";
import NotificationBadge from "@/components/notifications/NotificationBadge.vue";
import { useNotificationStore } from "@/stores/notificationStore";

interface TabItem {
  tab: string;
  link: string;
  name?: string;
  icon: string;
  iconFull: string;
}

const props = defineProps<{
  tab: TabItem;
  hasNotifications?: boolean;
  notificationCount?: number;
  hasUnreadMessages?: boolean;
  unreadMessagesCount?: number;
}>();

const emit = defineEmits<{
  (e: 'update-page', tab: TabItem): void;
}>();

const route = useRoute();

// Méthodes utilitaires pour les classes et icônes
const getIconName = (tab: TabItem): string => {
  return route.path.includes(tab.link) ? tab.iconFull : tab.icon;
};

const getIconClass = (tab: TabItem): string =>
  route.path.includes(tab.link) ? "text-primary" : "text-gray-400";

const getTextClass = (tab: TabItem): string =>
  route.path.includes(tab.link)
    ? "text-primary font-extrabold"
    : "font-bold text-zinc-400";
</script>