<template>
  <nav
    v-if="visible"
    class="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-rose-100 pb-safe"
  >
    <div class="max-w-5xl mx-auto flex items-center justify-around h-16 px-2">
      <!-- Left tabs -->
      <button
        v-for="tab in leftTabs"
        :key="tab.name"
        @click="$emit('navigate', tab.route)"
        :class="[
          'flex flex-col items-center gap-0.5 transition-colors px-2 py-1.5 rounded-xl flex-1',
          isActiveTab(tab) ? 'text-rose-400' : 'text-gray-400 hover:text-gray-600'
        ]"
      >
        <div :class="['relative flex items-center justify-center h-7 w-7 rounded-lg transition-colors', isActiveTab(tab) && 'bg-rose-100']">
          <i class="ri" :class="`ri-${tab.icon}`" style="font-size: 20px;"></i>
          <span
            v-if="tab.name === 'chat' && countMessage > 0"
            class="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center"
          >
            {{ countMessage > 99 ? '99+' : countMessage }}
          </span>
          <span
            v-else-if="tab.name === 'notifications' && countNotification > 0"
            class="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center"
          >
            {{ countNotification > 99 ? '99+' : countNotification }}
          </span>
        </div>
        <span class="font-love text-[10px] font-medium">{{ tab.label }}</span>
      </button>

      <!-- Center create button (parent only) -->
      <button
        v-if="hasCenterBtn"
        @click="$emit('navigate', 'CREATE_JOB')"
        :class="[
          'flex flex-col items-center justify-center -mt-6 mx-1 h-14 w-14 rounded-2xl shadow-lg shadow-rose-200 transition-all active:scale-90 flex-shrink-0',
          isActiveCreateBtn ? 'bg-rose-600 text-white ring-4 ring-rose-100' : 'bg-rose-400 text-white hover:bg-rose-500'
        ]"
      >
        <i class="ri ri-add-line" style="font-size: 26px;"></i>
      </button>

      <!-- Right tabs -->
      <button
        v-for="tab in rightTabs"
        :key="tab.name"
        @click="$emit('navigate', tab.route)"
        :class="[
          'flex flex-col items-center gap-0.5 transition-colors px-2 py-1.5 rounded-xl flex-1',
          isActiveTab(tab) ? 'text-rose-400' : 'text-gray-400 hover:text-gray-600'
        ]"
      >
        <div :class="['relative flex items-center justify-center h-7 w-7 rounded-lg transition-colors', isActiveTab(tab) && 'bg-rose-100']">
          <i class="ri" :class="`ri-${tab.icon}`" style="font-size: 20px;"></i>
          <span
            v-if="tab.name === 'chat' && countMessage > 0"
            class="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center"
          >
            {{ countMessage > 99 ? '99+' : countMessage }}
          </span>
          <span
            v-else-if="tab.name === 'notifications' && countNotification > 0"
            class="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center"
          >
            {{ countNotification > 99 ? '99+' : countNotification }}
          </span>
        </div>
        <span class="font-love text-[10px] font-medium">{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface NavTab {
  name: string;
  label: string;
  route: string;
  icon: string;
  profiles: string[];
  isCenter?: boolean;
}

const props = withDefaults(defineProps<{
  userType: string | null;
  countMessage: number;
  countNotification: number;
  activeRouteName?: string | null;
  activePath?: string;
  visible?: boolean;
}>(), {
  userType: null,
  countMessage: 0,
  countNotification: 0,
  activeRouteName: null,
  activePath: '',
  visible: true,
});

defineEmits<{
  (e: 'navigate', routeName: string): void;
}>();

const allTabs: NavTab[] = [
  {
    name: 'home',
    label: 'Accueil',
    route: 'HOME',
    icon: 'home-line',
    profiles: ['parent'],
  },
  {
    name: 'jobs',
    label: 'Jobs',
    route: 'HOME_JOBS',
    icon: 'briefcase-line',
    profiles: ['nounu'],
  },
  {
    name: 'create-job',
    label: 'Publier',
    route: 'CREATE_JOB',
    icon: 'add-line',
    profiles: ['parent'],
    isCenter: true,
  },
  {
    name: 'chat',
    label: 'Messages',
    route: 'CHAT_MESSAGE',
    icon: 'chat-3-line',
    profiles: ['parent'],
  },
  {
    name: 'search',
    label: 'Recherche',
    route: 'SEARCH_NOUNUS',
    icon: 'search-line',
    profiles: ['nounu'],
  },
  {
    name: 'prestations',
    label: 'Prestations',
    route: 'PRESTATIONS',
    icon: 'wallet-line',
    profiles: ['nounu'],
  },
  {
    name: 'notifications',
    label: 'Notifs',
    route: 'NOTIFICATIONS',
    icon: 'notification-3-line',
    profiles: ['parent', 'nounu'],
  },
  {
    name: 'profile',
    label: 'Profil',
    route: 'PROFIL',
    icon: 'user-3-line',
    profiles: ['parent', 'nounu'],
  },
];

const navTabs = computed(() => {
  if (!props.userType) return allTabs.filter((tab) => tab.profiles.includes('nounu') && !tab.isCenter);
  return allTabs.filter((tab) => tab.profiles.includes(props.userType as string) && !tab.isCenter);
});

const hasCenterBtn = computed(() => props.userType === 'parent');

const leftTabs = computed(() => {
  const tabs = navTabs.value;
  if (!hasCenterBtn.value) return tabs;
  const mid = Math.ceil(tabs.length / 2);
  return tabs.slice(0, mid);
});

const rightTabs = computed(() => {
  const tabs = navTabs.value;
  if (!hasCenterBtn.value) return [];
  const mid = Math.ceil(tabs.length / 2);
  return tabs.slice(mid);
});

const isActiveCreateBtn = computed(() => props.activeRouteName === 'CREATE_JOB');

const isActiveTab = (tab: NavTab) => {
  const name = props.activeRouteName;
  const path = props.activePath;
  if (tab.route === 'HOME') return name === 'HOME' || path === '/home/nounus';
  if (tab.route === 'HOME_JOBS') return name === 'HOME_JOBS' || path === '/home/jobs';
  if (tab.route === 'CREATE_JOB') return name === 'CREATE_JOB';
  if (tab.route === 'CHAT_MESSAGE') return name === 'CHAT_MESSAGE' || name === 'CHAT_MESSAGE_DETAIL';
  if (tab.route === 'SEARCH_NOUNUS') return name === 'SEARCH_NOUNUS' || name === 'SEARCH_JOBS';
  if (tab.route === 'PRESTATIONS') return name === 'PRESTATIONS';
  return name === tab.route;
};
</script>
