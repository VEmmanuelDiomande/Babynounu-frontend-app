<template>
  <div class="min-h-screen bg-rose-50  flex flex-col">
    <!-- Page content — no AppHeader, chat pages manage their own headers -->
    <main :class="['flex-1 flex flex-col', isDetailPage ? 'overflow-hidden' : 'pb-20']">
      <PullToRefresh v-if="!isDetailPage" :refreshing="isRefreshing" @refresh="handleRefresh">
        <router-view v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <keep-alive>
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </Transition>
        </router-view>
      </PullToRefresh>
      <router-view v-else v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </main>

    <!-- Bottom navigation — only on chat list, hidden in conversation detail -->
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
import { StorageUtils } from '@/utils/store.utils';
import { useNotificationStore } from '@/stores/notificationStore';
import { useUserStore } from '@/stores/user.store';
import { BottomNav, PullToRefresh } from '@/components/ui';
import { getRefreshHandler } from '@/composables/usePullToRefresh';
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
const { data: chatUnreadCount } = useChatUnreadCount(computed(() => isLoggedIn.value));
const { data: notificationUnreadCount } = useNotificationUnreadCount(computed(() => isLoggedIn.value));

// TanStack Query hooks for profiles (conditionally enabled based on user type)
const { data: parentProfileData } = useParentProfile(computed(() => userType.value === 'parent'));
const { data: nounuProfileData } = useNounuProfile(computed(() => userType.value === 'nounu'));

// Subscription status via TanStack Query
const { data: subscriptionData } = useHasActiveSubscription(computed(() => isLoggedIn.value));

// Sync abonnement store depuis la query TanStack
watch(subscriptionData, (data) => {
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

// Computed avatar that reacts to profile data changes (unused in layout but kept for parity)
const _userAvatar = computed(() => {
  const raw = userType.value === 'parent' ? parentProfileData.value : nounuProfileData.value;
  const profileData = raw && typeof raw === 'object' && 'success' in raw && 'data' in raw ? raw.data : raw;
  const medias = profileData?.user?.medias || [];
  return medias;
});

const isDetailPage = computed(() => route.name === 'CHAT_MESSAGE_DETAIL');

const showBottomNav = computed(() => !isDetailPage.value);

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
  await userStore._isLogged();

  const nToken = (await StorageUtils().getStore('nToken'))?.value;
  isLoggedIn.value = !!nToken;

  if (nToken) {
    notificationStore.NCountChats();
    notificationStore.NCountNotification();
  }
});

watch(() => route.path, () => {
  determineUserType();
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
</script>
