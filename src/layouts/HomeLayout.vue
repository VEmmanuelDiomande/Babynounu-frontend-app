<template>
  <div class="min-h-screen bg-rose-50 flex flex-col">
    <!-- Adaptive header -->
    <AppHeader
      :mode="headerConfig.mode"
      :title="headerConfig.title"
      :subtitle="headerConfig.subtitle"
      :icon="headerConfig.icon"
      @back="handleBack"
    >
      <template #actions>
        <button
          v-if="route.name === 'PROFIL'"
          @click="router.push({ name: 'SETTINGS' })"
          class="h-9 w-9 rounded-full hover:bg-rose-50 flex items-center justify-center transition-colors"
        >
          <i class="ri ri-settings-3-line text-gray-600" style="font-size: 20px;"></i>
        </button>
        <button
          v-if="route.name !== 'PROFIL' && route.name !== 'PROFIL_PARENT' && route.name !== 'NOTIFICATIONS'"
          @click="router.push({ name: 'NOTIFICATIONS' })"
          class="relative h-9 w-9 rounded-full hover:bg-rose-50 flex items-center justify-center transition-colors"
        >
          <i class="ri ri-notification-3-line text-gray-600" style="font-size: 20px;"></i>
          <span
            v-if="notificationStore.state.countNotification > 0"
            class="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {{ notificationStore.state.countNotification > 99 ? '99+' : notificationStore.state.countNotification }}
          </span>
        </button>
        <router-link
          v-if="route.name !== 'PROFIL' && route.name !== 'PROFIL_PARENT'"
          :to="{ name: 'PROFIL' }"
          :class="[
            'h-9 w-9 rounded-full border-2 border-rose-200 hover:border-rose-400 transition-colors flex items-center justify-center',
            userStore.isLogged ? 'overflow-hidden' : 'bg-rose-50'
          ]"
        >
          <img
            v-if="userStore.isLogged && userAvatar"
            :src="userAvatar"
            alt="Profile"
            class="h-full w-full object-cover"
          />
          <i
            v-else
            class="ri ri-user-3-line text-gray-600"
            style="font-size: 20px;"
          ></i>
        </router-link>
      </template>
    </AppHeader>

    <!-- Page content -->
    <main :class="['flex-1', showBottomNav ? 'pb-20' : '']">
      <PullToRefresh :refreshing="isRefreshing" @refresh="handleRefresh">
        <router-view v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <keep-alive>
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </Transition>
        </router-view>
      </PullToRefresh>
    </main>

    <!-- Bottom navigation -->
    <nav v-if="showBottomNav" class="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-rose-100">
      <div class="max-w-5xl mx-auto flex items-center justify-around h-16 px-2">
        <!-- Left tabs -->
        <button
          v-for="tab in leftTabs"
          :key="tab.name"
          @click="router.push({ name: tab.route })"
          :class="[
            'flex flex-col items-center gap-0.5 transition-colors px-2 py-1.5 rounded-xl flex-1',
            isActiveTab(tab) ? 'text-rose-400' : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          <div :class="['relative flex items-center justify-center h-7 w-7 rounded-lg transition-colors', isActiveTab(tab) && 'bg-rose-100']">
            <i class="ri" :class="`ri-${tab.icon}`" style="font-size: 20px;"></i>
            <span
              v-if="tab.name === 'chat' && notificationStore.state.countMessage > 0"
              class="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center"
            >
              {{ notificationStore.state.countMessage > 99 ? '99+' : notificationStore.state.countMessage }}
            </span>
            <span
              v-else-if="tab.name === 'notifications' && notificationStore.state.countNotification > 0"
              class="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center"
            >
              {{ notificationStore.state.countNotification > 99 ? '99+' : notificationStore.state.countNotification }}
            </span>
          </div>
          <span class="font-love text-[10px] font-medium">{{ tab.label }}</span>
        </button>

        <!-- Center create button (parent only) -->
        <button
          v-if="userType === 'parent'"
          @click="router.push({ name: 'CREATE_JOB' })"
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
          @click="router.push({ name: tab.route })"
          :class="[
            'flex flex-col items-center gap-0.5 transition-colors px-2 py-1.5 rounded-xl flex-1',
            isActiveTab(tab) ? 'text-rose-400' : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          <div :class="['relative flex items-center justify-center h-7 w-7 rounded-lg transition-colors', isActiveTab(tab) && 'bg-rose-100']">
            <i class="ri" :class="`ri-${tab.icon}`" style="font-size: 20px;"></i>
            <span
              v-if="tab.name === 'chat' && notificationStore.state.countMessage > 0"
              class="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center"
            >
              {{ notificationStore.state.countMessage > 99 ? '99+' : notificationStore.state.countMessage }}
            </span>
            <span
              v-else-if="tab.name === 'notifications' && notificationStore.state.countNotification > 0"
              class="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center"
            >
              {{ notificationStore.state.countNotification > 99 ? '99+' : notificationStore.state.countNotification }}
            </span>
          </div>
          <span class="font-love text-[10px] font-medium">{{ tab.label }}</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { StorageUtils } from '@/utils/store.utils';
import { useNotificationStore } from '@/stores/notificationStore';
import { useUserStore } from '@/stores/user.store';
import { AppHeader, PullToRefresh } from '@/components/ui';
import { getRefreshHandler } from '@/composables/usePullToRefresh';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { getAvatarUrl } from '@/utils/media.utils';
import { useChatUnreadCount, useNotificationUnreadCount } from '@/features/notifications/hooks/useNotificationCounts';
import { useParentProfile, useNounuProfile } from '@/features/profile/hooks/useProfile';
import { useAbonnementStore } from '@/stores/abonnementStore';

const router = useRouter();
const route = useRoute();
const notificationStore = useNotificationStore();
const userStore = useUserStore();
const abonnementStore = useAbonnementStore();

const userType = ref<string | null>(null);

// TanStack Query hooks for counts
const { data: chatUnreadCount } = useChatUnreadCount();
const { data: notificationUnreadCount } = useNotificationUnreadCount();

// TanStack Query hooks for profiles (conditionally enabled based on user type)
const { data: parentProfileData } = useParentProfile(computed(() => userType.value === 'parent'));
const { data: nounuProfileData } = useNounuProfile(computed(() => userType.value === 'nounu'));

// Computed avatar that reacts to profile data changes
const userAvatar = computed(() => {
  const profileData = userType.value === 'parent' ? parentProfileData.value : nounuProfileData.value;
  const medias = profileData?.user?.medias || [];
  return getAvatarUrl(medias);
});

async function determineUserType() {
  const [typeResult, pageTypeResult, roleResult] = await Promise.all([
    StorageUtils().getStore('nType_Profil'),
    StorageUtils().getStore('nPageType'),
    StorageUtils().getStore('nRole'),
  ]);
  const typeProfil = typeResult?.value || null;
  const pageType = pageTypeResult?.value || null;
  const role = roleResult?.value || null;

  if (pageType === '/home/jobs' || typeProfil === 'nounu' || typeProfil === 'prestataire' || role === 'nounou') {
    userType.value = 'nounu';
  } else if (pageType === '/home/nounus' || typeProfil === 'parent' || typeProfil === 'client' || role === 'parent') {
    userType.value = 'parent';
  } else {
    userType.value = null;
  }
}

onMounted(async () => {
  await determineUserType();

  // Check if user is logged in
  await userStore._isLogged();

  // Sync subscription status from backend
  const nToken = (await StorageUtils().getStore('nToken'))?.value;
  if (nToken) {
    abonnementStore.myAbonnement().catch(() => {});
  }

  // Initialize notification and message counts via WebSocket (only if logged in)
  if (nToken) {
    notificationStore.NCountChats();
    notificationStore.NCountNotification();
  }
  
  // Sync TanStack Query data with store for UI compatibility
  if (chatUnreadCount.value !== undefined) {
    notificationStore.state.countMessage = chatUnreadCount.value;
  }
  if (notificationUnreadCount.value !== undefined) {
    notificationStore.state.countNotification = notificationUnreadCount.value;
  }
});

watch(() => route.path, () => {
  determineUserType();
});

const allTabs = [
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
  if (!userType.value) return allTabs.filter((tab) => tab.profiles.includes('nounu') && !tab.isCenter);
  return allTabs.filter((tab) => tab.profiles.includes(userType.value as string) && !tab.isCenter);
});

const hasCenterBtn = computed(() => userType.value === 'parent');

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

const isActiveCreateBtn = computed(() => route.name === 'CREATE_JOB');

type HeaderMode = 'logo' | 'title' | 'back' | 'close' | 'hidden';

const headerConfig = computed<{ mode: HeaderMode; title?: string; subtitle?: string; icon?: string }>(() => {
  const configs: Record<string, { mode: HeaderMode; title?: string; subtitle?: string; icon?: string }> = {
    HOME: { mode: 'logo' },
    HOME_JOBS: { mode: 'logo' },
    PROFIL: { mode: 'title', title: 'Profil', icon: 'user-3-line' },
    NOTIFICATIONS: { mode: 'title', title: 'Notifications', subtitle: 'Vos notifications récentes', icon: 'notification-3-line' },
    SEARCH_NOUNUS: { mode: 'title', title: 'Recherche', subtitle: 'Trouvez des nounous près de chez vous', icon: 'search-line' },
    SEARCH_JOBS: { mode: 'title', title: 'Recherche', subtitle: "Trouvez des offres d'emploi", icon: 'search-line' },
    PRESTATIONS: { mode: 'title', title: 'Prestations', subtitle: 'Votre état financier et votre agenda', icon: 'wallet-line' },
    CONTRACTS: { mode: 'title', title: 'Contrats', subtitle: 'Vos contrats et engagements', icon: 'file-list-3-line' },
    PackSubscrible: { mode: 'back', title: 'Abonnement', subtitle: 'Choisissez votre formule' },
    MY_JOBS: { mode: 'back', title: 'Mes annonces', subtitle: 'Gérez vos offres' },
    CREATE_JOB: { mode: 'back', title: 'Publier une offre', subtitle: 'Remplissez les informations' },
    JOB_DETAIL: { mode: 'back', title: "Détail de l'offre" },
    SETTINGS: { mode: 'back', title: 'Paramètres', subtitle: 'Gérez votre compte et préférences' },
    PROFIL_PARENT: { mode: 'back', title: 'Profil' },
    CHAT_MESSAGE: { mode: 'hidden' },
    CHAT_MESSAGE_DETAIL: { mode: 'hidden' },
  };
  return configs[route.name as string] || { mode: 'logo' };
});

const showBottomNav = computed(() => {
  if (route.name === 'PROFIL') return true;
  return route.name !== 'CHAT_MESSAGE_DETAIL' && route.name !== 'SETTINGS' && route.name !== 'PROFIL_PARENT' && route.name !== 'CREATE_JOB' && route.name !== 'JOB_DETAIL' && route.name !== 'MY_JOBS' && route.name !== 'PackSubscrible';
});

const isRefreshing = ref(false);

async function handleRefresh() {
  const handler = getRefreshHandler(route.name as string);
  if (handler) {
    isRefreshing.value = true;
    try {
      await handler();
    } finally {
      isRefreshing.value = false;
    }
  }
}

const handleBack = () => {
  if (route.name === 'PackSubscrible') {
    router.push({ name: userType.value === 'parent' ? 'HOME' : 'HOME_JOBS' });
  } else {
    router.back();
  }
};

const isActiveTab = (tab: any) => {
  if (tab.route === 'HOME') return route.name === 'HOME' || route.path === '/home/nounus';
  if (tab.route === 'HOME_JOBS') return route.name === 'HOME_JOBS' || route.path === '/home/jobs';
  if (tab.route === 'CREATE_JOB') return route.name === 'CREATE_JOB';
  if (tab.route === 'CHAT_MESSAGE') return route.name === 'CHAT_MESSAGE' || route.name === 'CHAT_MESSAGE_DETAIL';
  if (tab.route === 'SEARCH_NOUNUS') return route.name === 'SEARCH_NOUNUS' || route.name === 'SEARCH_JOBS';
  if (tab.route === 'PRESTATIONS') return route.name === 'PRESTATIONS';
  return route.name === tab.route;
};
</script>
