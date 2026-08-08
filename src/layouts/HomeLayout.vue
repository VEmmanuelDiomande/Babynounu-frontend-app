<template>
  <div class="min-h-screen pb-8 bg-rose-50 flex flex-col">
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
    <main :class="['flex-1', showBottomNav ? 'pb-20 pt-24' : 'pt-24']">
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
    <BottomNav
      :visible="showBottomNav"
      :user-type="userType"
      :count-message="notificationStore.state.countMessage"
      :count-notification="notificationStore.state.countNotification"
      :active-route-name="route.name ? String(route.name) : null"
      :active-path="route.path"
      @navigate="router.push({ name: $event })"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { StorageUtils } from '@/utils/store.utils';
import { useNotificationStore } from '@/stores/notificationStore';
import { useUserStore } from '@/stores/user.store';
import { AppHeader, BottomNav, PullToRefresh } from '@/components/ui';
import { getRefreshHandler } from '@/composables/usePullToRefresh';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { getAvatarUrl } from '@/utils/media.utils';
import { useChatUnreadCount, useNotificationUnreadCount } from '@/features/notifications/hooks/useNotificationCounts';
import { useParentProfile, useNounuProfile } from '@/features/profile/hooks/useProfile';
import { useHasActiveSubscription } from '@/features/subscriptions/hooks/useAbonnement';
import { useAbonnementStore } from '@/stores/abonnementStore';

const router = useRouter();
const route = useRoute();
const notificationStore = useNotificationStore();
const userStore = useUserStore();
const abonnementStore = useAbonnementStore();

const userType = ref<string | null>(null);
const isLoggedIn = ref(false);

// TanStack Query hooks for counts — uniquement si l'utilisateur est connecté.
// La mise en cache TanStack (staleTime 2 min) évite les appels HTTP dupliqués
// lors des remontages du layout (HomeLayout est utilisé par 14 route records).
const { data: chatUnreadCount } = useChatUnreadCount(computed(() => isLoggedIn.value));
const { data: notificationUnreadCount } = useNotificationUnreadCount(computed(() => isLoggedIn.value));

// TanStack Query hooks for profiles (conditionally enabled based on user type)
const { data: parentProfileData } = useParentProfile(computed(() => userType.value === 'parent'));
const { data: nounuProfileData } = useNounuProfile(computed(() => userType.value === 'nounu'));

// Subscription status via TanStack Query (staleTime 5 min) — évite l'appel HTTP
// direct de abonnementStore.myAbonnement() qui se dupliquait à chaque remontage.
// Le store est synchronisé via le watcher ci-dessous.
const { data: subscriptionData } = useHasActiveSubscription(computed(() => isLoggedIn.value));

// Sync abonnement store depuis la query TanStack (évite l'appel HTTP direct)
// useHasActiveSubscription retourne déjà l'objet subscription déwrappé (ou null).
watch(subscriptionData, (data) => {
  // data peut être null (pas d'abonnement) — il faut quand même mettre à jour
  // le store pour refléter l'état "non abonné".
  const hasActive = !!data && data.status === 'active' && (
    data.expiresAt === null || new Date(data.expiresAt) > new Date()
  );
  abonnementStore.isAbonnement = hasActive;
  abonnementStore.isLifetime = !!data && data.expiresAt === null;
  abonnementStore.isExpired = !!data && data.status === 'active' && data.expiresAt !== null && new Date(data.expiresAt) <= new Date();
  abonnementStore.subscriptionData = data || null;
  const packFeatures = data?.pack?.features;
  abonnementStore.subscriptionFeatures = Array.isArray(packFeatures) ? packFeatures : (Array.isArray(data?.features) ? data.features : []);
  StorageUtils().setStore('nIsAbonnement', hasActive ? 'true' : 'false');
}, { immediate: true });

// Sync notification store depuis les queries TanStack
watch(chatUnreadCount, (val) => {
  if (val !== undefined) notificationStore.state.countMessage = val;
}, { immediate: true });
watch(notificationUnreadCount, (val) => {
  if (val !== undefined) notificationStore.state.countNotification = val;
}, { immediate: true });

// Computed avatar that reacts to profile data changes
const userAvatar = computed(() => {
  const raw = userType.value === 'parent' ? parentProfileData.value : nounuProfileData.value;
  // TransformInterceptor wraps responses as { success, data }
  const profileData = raw && typeof raw === 'object' && 'success' in raw && 'data' in raw ? raw.data : raw;
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

  // Détermine si l'utilisateur est connecté pour activer les queries TanStack
  const nToken = (await StorageUtils().getStore('nToken'))?.value;
  isLoggedIn.value = !!nToken;

  // Initialize notification and message counts via WebSocket (only if logged in)
  // Ces appels socket ne sont plus dupliqués avec main.ts (supprimés de main.ts).
  if (nToken) {
    notificationStore.NCountChats();
    notificationStore.NCountNotification();
  }
});

watch(() => route.path, () => {
  determineUserType();
});

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
    MySubscription: { mode: 'back', title: 'Mon abonnement', subtitle: 'Détails de votre souscription' },
    MY_JOBS: { mode: 'back', title: 'Mes annonces', subtitle: 'Gérez vos offres' },
    CREATE_JOB: { mode: 'back', title: 'Publier une offre', subtitle: 'Remplissez les informations' },
    JOB_DETAIL: { mode: 'back', title: "Détail de l'offre" },
    SETTINGS: { mode: 'back', title: 'Paramètres', subtitle: 'Gérez votre compte et préférences' },
    PROFIL_PARENT: { mode: 'back', title: 'Profil' },
  };
  return configs[route.name as string] || { mode: 'logo' };
});

const showBottomNav = computed(() => {
  if (route.name === 'PROFIL') return true;
  return route.name !== 'SETTINGS' && route.name !== 'PROFIL_PARENT' && route.name !== 'CREATE_JOB' && route.name !== 'JOB_DETAIL' && route.name !== 'MY_JOBS' && route.name !== 'PackSubscrible' && route.name !== 'MySubscription';
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
  if (route.name === 'PackSubscrible' || route.name === 'MySubscription') {
    router.push({ name: userType.value === 'parent' ? 'HOME' : 'HOME_JOBS' });
  } else {
    router.back();
  }
};
</script>
