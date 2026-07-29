<template>
  <div class="space-y-5">
    <!-- Loading -->
    <div v-if="adminStore.isLoading && !adminStore.stats" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <template v-else-if="adminStore.stats">
      <!-- Mobile Header Card -->
      <div class="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-5 text-white shadow-lg shadow-primary/25">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-love opacity-90 mb-1">{{ currentDate }}</p>
            <h2 class="font-anton text-2xl leading-tight">Bonjour, Admin</h2>
            <p class="text-sm font-love opacity-90 mt-1">Voici l'activité de votre plateforme</p>
          </div>
          <div class="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <i class="ri ri-dashboard-line text-white" style="font-size: 24px;"></i>
          </div>
        </div>
      </div>

      <!-- Quick Stats Cards -->
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="card in statCards"
          :key="card.key"
          :class="[
            'relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02]',
            card.bgClass
          ]"
        >
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-3">
              <div :class="['h-10 w-10 rounded-xl flex items-center justify-center', card.iconBgClass]">
                <i class="ri" :class="`ri-${card.icon}`" :style="{ fontSize: '20px', color: card.iconColor }"></i>
              </div>
              <span v-if="card.trend" class="text-[10px] font-love font-semibold px-2 py-0.5 rounded-full bg-white/30 text-white">
                {{ card.trend }}
              </span>
            </div>
            <p class="text-xs font-love opacity-80 mb-1">{{ card.label }}</p>
            <div class="font-anton text-2xl text-white">{{ card.value }}</div>
          </div>
          <div class="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10"></div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <Tabs v-model="activeTab" :tabs="tabs">
        <!-- Vue d'ensemble -->
        <div v-if="activeTab === 'overview'" class="space-y-5">
          <!-- Activity Cards -->
          <div class="grid grid-cols-1 gap-4">
            <!-- Certifications -->
            <Card variant="elevated" className="p-5">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <i class="ri ri-checkbox-circle-line text-amber-600" style="font-size: 20px;"></i>
                  </div>
                  <div>
                    <h3 class="font-anton text-base text-gray-900">Certifications</h3>
                    <p class="text-xs text-gray-500 font-love">Nounus en attente</p>
                  </div>
                </div>
                <Badge v-if="adminStore.stats.pendingNounus > 0" variant="warning" size="md">
                  {{ adminStore.stats.pendingNounus }} en attente
                </Badge>
                <Badge v-else variant="success" size="md">À jour</Badge>
              </div>
              <div v-if="adminStore.stats.pendingNounus > 0" class="space-y-3">
                <div class="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div class="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <i class="ri ri-notification-3-line text-amber-600" style="font-size: 18px;"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-900 font-love font-semibold">Action requise</p>
                    <p class="text-xs text-gray-500 font-love">{{ adminStore.stats.pendingNounus }} certification{{ adminStore.stats.pendingNounus > 1 ? 's' : '' }} à valider</p>
                  </div>
                </div>
                <router-link
                  :to="{ name: 'ADMIN_NOUNUS' }"
                  class="block w-full text-center py-2.5 rounded-xl bg-primary text-white font-love font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  Voir les certifications
                </router-link>
              </div>
              <div v-else class="flex flex-col items-center py-6">
                <div class="h-14 w-14 rounded-full bg-green-50 flex items-center justify-center mb-3">
                  <i class="ri ri-checkbox-circle-line text-green-500" style="font-size: 28px;"></i>
                </div>
                <p class="text-sm text-gray-900 font-love font-semibold">Tout est à jour</p>
                <p class="text-xs text-gray-500 font-love mt-1">Aucune certification en attente</p>
              </div>
            </Card>

            <!-- Quick Actions -->
            <Card variant="elevated" className="p-5">
              <div class="flex items-center gap-3 mb-4">
                <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <i class="ri ri-rocket-line text-primary" style="font-size: 20px;"></i>
                </div>
                <div>
                  <h3 class="font-anton text-base text-gray-900">Actions rapides</h3>
                  <p class="text-xs text-gray-500 font-love">Accès direct</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <router-link
                  v-for="action in quickActions"
                  :key="action.route"
                  :to="{ name: action.route }"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-primary/10 transition-colors group"
                >
                  <i class="ri text-gray-500 group-hover:text-primary transition-colors" :class="`ri-${action.icon}`" style="font-size: 20px;"></i>
                  <span class="text-xs font-love font-medium text-gray-700 group-hover:text-primary text-center">{{ action.label }}</span>
                </router-link>
              </div>
            </Card>
          </div>

          <!-- Overview Progress -->
          <Card variant="outlined" className="p-5">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <i class="ri ri-bar-chart-2-line text-indigo-600" style="font-size: 20px;"></i>
                </div>
                <h3 class="font-anton text-base text-gray-900">Vue d'ensemble</h3>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4">
              <div v-for="item in overviewItems" :key="item.label" class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600 font-love">{{ item.label }}</span>
                  <span class="text-sm font-anton text-gray-900">{{ item.value }}</span>
                </div>
                <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-700" :class="item.barColor" :style="{ width: item.percentage + '%' }"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Certifications Tab -->
        <div v-else-if="activeTab === 'certifications'" class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h3 class="font-anton text-lg text-gray-900">Nounus en attente</h3>
              <Badge v-if="adminStore.pendingNounusTotal > 0" variant="warning" size="md">{{ adminStore.pendingNounusTotal }}</Badge>
            </div>
            <button
              v-if="adminStore.pendingNounus.length > 0 && adminStore.pendingNounus.length < adminStore.pendingNounusTotal"
              @click="loadMorePending"
              class="text-sm font-love text-primary font-semibold hover:underline"
            >
              Voir plus
            </button>
          </div>

          <div v-if="adminStore.pendingNounus.length > 0" class="grid grid-cols-1 gap-4">
            <Card
              v-for="nounu in adminStore.pendingNounus"
              :key="nounu.id"
              variant="outlined"
              className="p-4 hover:border-primary/30 transition-all duration-200"
            >
              <div class="flex items-center gap-3 mb-3">
                <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span class="font-anton text-base text-primary">{{ getInitials(nounu) }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ getDisplayName(nounu) }}</div>
                  <div class="text-xs text-gray-500 font-love truncate">{{ nounu.user?.email }}</div>
                </div>
                <Badge variant="warning" size="sm">En attente</Badge>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500 font-love mb-3">
                <i class="ri ri-calendar-2-line" style="font-size: 14px;"></i>
                <span>Inscrit le {{ formatDate(nounu.createdAt) }}</span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="handleApprove(nounu.id)"
                  class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-green-50 text-green-700 text-xs font-love font-semibold hover:bg-green-100 transition-colors"
                >
                  <i class="ri ri-check-line" style="font-size: 14px;"></i>
                  Approuver
                </button>
                <button
                  @click="handleReject(nounu.id)"
                  class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 text-red-600 text-xs font-love font-semibold hover:bg-red-100 transition-colors"
                >
                  <i class="ri ri-close-line" style="font-size: 14px;"></i>
                  Rejeter
                </button>
              </div>
            </Card>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-3xl">
            <div class="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-3">
              <i class="ri ri-checkbox-circle-line text-green-500" style="font-size: 32px;"></i>
            </div>
            <h3 class="font-anton text-lg text-gray-900 mb-1">Aucune certification en attente</h3>
            <p class="text-sm text-gray-500 font-love text-center">Tous les nounus ont été traités</p>
          </div>
        </div>

        <!-- Activité Tab -->
        <div v-else-if="activeTab === 'activity'" class="space-y-4">
          <div class="grid grid-cols-1 gap-4">
            <Card v-for="metric in activityMetrics" :key="metric.label" variant="filled" :className="`p-4 ${metric.bgClass}`">
              <div class="flex items-center gap-3">
                <div :class="['h-10 w-10 rounded-xl flex items-center justify-center', metric.iconBgClass]">
                  <i class="ri" :class="`ri-${metric.icon}`" :style="{ fontSize: '20px', color: metric.iconColor }"></i>
                </div>
                <div>
                  <p class="text-xs font-love text-gray-500">{{ metric.label }}</p>
                  <p class="font-anton text-xl text-gray-900">{{ metric.value }}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card variant="outlined" className="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <i class="ri ri-group-line text-secondary" style="font-size: 20px;"></i>
              </div>
              <div>
                <h3 class="font-anton text-base text-gray-900">Utilisateurs récents</h3>
                <p class="text-xs text-gray-500 font-love">Derniers inscrits sur la plateforme</p>
              </div>
            </div>
            <div v-if="recentUsers.length > 0" class="space-y-3">
              <div
                v-for="user in recentUsers"
                :key="user.id"
                class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors"
              >
                <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                  <span class="font-anton text-xs text-primary">{{ getUserInitials(user) }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-gray-900 font-love truncate">{{ getUserDisplayName(user) }}</p>
                  <p class="text-xs text-gray-500 font-love truncate">{{ user.email }}</p>
                </div>
                <span class="text-xs text-gray-400 font-love">{{ formatDate(user.createdAt) }}</span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-sm text-gray-500 font-love">Aucun utilisateur récent à afficher</p>
            </div>
          </Card>
        </div>
      </Tabs>
    </template>

    <!-- Error -->
    <div v-else-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-6 text-center">
      <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
        <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      </div>
      <p class="text-sm text-red-600 font-love font-medium">{{ adminStore.error }}</p>
      <button
        @click="adminStore.fetchStats()"
        class="mt-4 px-5 py-2 rounded-xl bg-primary text-white text-sm font-love font-semibold hover:bg-primary/90 transition-colors"
      >
        Réessayer
      </button>
    </div>
  </div>

  <ConfirmModal
    :show="showConfirm"
    :title="confirmTitle"
    :message="confirmMessage"
    :icon="confirmIcon"
    :iconBgClass="confirmIconBg"
    :iconClass="confirmIconClass"
    :confirmLabel="confirmLabel"
    :confirmBgClass="confirmBgClass"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { Card, Badge, Tabs, ConfirmModal } from '@/components/ui';
import { useConfirmModal } from '@/composables/useConfirmModal';
import { usePullToRefresh } from '@/composables/usePullToRefresh';

const adminStore = useAdminStore();
const { showConfirm, confirmTitle, confirmMessage, confirmIcon, confirmIconBg, confirmIconClass, confirmLabel, confirmBgClass, requestConfirm, onConfirm, onCancel } = useConfirmModal();
const activeTab = ref('overview');
const pendingPage = ref(1);
const pendingLimit = 6;

const tabs = [
  { label: 'Vue d\'ensemble', value: 'overview', icon: 'bar-chart-2-line' },
  { label: 'Certifications', value: 'certifications', icon: 'shield-line', badge: adminStore.stats?.pendingNounus || 0 },
  { label: 'Activité', value: 'activity', icon: 'pulse-line' },
];

const currentDate = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
});

const statCards = computed(() => {
  if (!adminStore.stats) return [];
  const s = adminStore.stats;
  return [
    {
      key: 'users',
      label: 'Utilisateurs',
      value: s.totalUsers,
      icon: 'group-line',
      bgClass: 'bg-gradient-to-br from-primary to-primary/80',
      iconBgClass: 'bg-white/20',
      iconColor: '#ffffff',
      trend: '+ actifs',
    },
    {
      key: 'nounus',
      label: 'Nounus',
      value: s.totalNounus,
      icon: 'user-3-line',
      bgClass: 'bg-gradient-to-br from-secondary to-secondary/80',
      iconBgClass: 'bg-white/20',
      iconColor: '#ffffff',
      trend: 'disponibles',
    },
    {
      key: 'parents',
      label: 'Parents',
      value: s.totalParents,
      icon: 'heart-line',
      bgClass: 'bg-gradient-to-br from-indigo-500 to-indigo-400',
      iconBgClass: 'bg-white/20',
      iconColor: '#ffffff',
      trend: 'inscrits',
    },
    {
      key: 'jobs',
      label: 'Annonces',
      value: s.totalJobs,
      icon: 'briefcase-line',
      bgClass: 'bg-gradient-to-br from-amber-500 to-amber-400',
      iconBgClass: 'bg-white/20',
      iconColor: '#ffffff',
      trend: 'publiées',
    },
  ];
});

const overviewItems = computed(() => {
  if (!adminStore.stats) return [];
  const s = adminStore.stats;
  const max = Math.max(s.totalRooms, s.totalMessages, s.totalPayments, s.totalSubscriptions, 1);
  return [
    {
      label: 'Conversations',
      value: s.totalRooms,
      percentage: Math.round((s.totalRooms / max) * 100),
      barColor: 'bg-primary',
    },
    {
      label: 'Messages',
      value: s.totalMessages,
      percentage: Math.round((s.totalMessages / max) * 100),
      barColor: 'bg-secondary',
    },
    {
      label: 'Paiements',
      value: s.totalPayments,
      percentage: Math.round((s.totalPayments / max) * 100),
      barColor: 'bg-indigo-500',
    },
    {
      label: 'Abonnements',
      value: s.totalSubscriptions,
      percentage: Math.round((s.totalSubscriptions / max) * 100),
      barColor: 'bg-amber-500',
    },
  ];
});

const activityMetrics = computed(() => {
  if (!adminStore.stats) return [];
  const s = adminStore.stats;
  return [
    {
      label: 'Conversations',
      value: s.totalRooms,
      icon: 'chat-3-line',
      bgClass: 'bg-primary/5',
      iconBgClass: 'bg-primary/10',
      iconColor: '#F77C3D',
    },
    {
      label: 'Messages',
      value: s.totalMessages,
      icon: 'chat-3-line',
      bgClass: 'bg-secondary/5',
      iconBgClass: 'bg-secondary/10',
      iconColor: '#55c4bd',
    },
    {
      label: 'Paiements',
      value: s.totalPayments,
      icon: 'bank-card-2-line',
      bgClass: 'bg-indigo-50',
      iconBgClass: 'bg-indigo-100',
      iconColor: '#6574cd',
    },
  ];
});

const quickActions = [
  { label: 'Utilisateurs', route: 'ADMIN_USERS', icon: 'group-line' },
  { label: 'Nounus', route: 'ADMIN_NOUNUS_LIST', icon: 'user-3-line' },
  { label: 'Paiements', route: 'ADMIN_PAYMENTS', icon: 'bank-card-2-line' },
  { label: 'Paramètres', route: 'ADMIN_SETTINGS', icon: 'settings-3-line' },
];

const recentUsers = computed(() => {
  return (adminStore.users || []).slice(0, 5);
});

const handleApprove = async (id: string) => {
  try {
    await adminStore.certifyNounu(id, 'Approved');
  } catch {
    // error handled in store
  }
};

const handleReject = (id: string) => {
  requestConfirm('Voulez-vous vraiment rejeter cette certification ?', async () => {
    try {
      await adminStore.certifyNounu(id, 'Rejected');
    } catch {
      // error handled in store
    }
  }, { icon: 'close-circle-line', iconBgClass: 'bg-red-50', iconClass: 'text-red-500', confirmLabel: 'Rejeter', confirmBgClass: 'bg-red-500 hover:bg-red-600 shadow-red-200' });
};

const loadMorePending = () => {
  if (adminStore.isLoading) return;
  pendingPage.value++;
  adminStore.fetchPendingNounus(pendingPage.value, pendingLimit, true);
};

const getInitials = (nounu: any) => {
  const name = getDisplayName(nounu);
  return name.substring(0, 2).toUpperCase();
};

const getDisplayName = (nounu: any) => {
  const firstName = nounu.firstName || '';
  const lastName = nounu.lastName || '';
  const name = `${firstName} ${lastName}`.trim();
  return name || nounu.user?.email?.split('@')[0] || 'Nounu';
};

const getUserInitials = (user: any) => {
  const name = getUserDisplayName(user);
  return name.substring(0, 2).toUpperCase();
};

const getUserDisplayName = (user: any) => {
  if (user.nounus?.length > 0) {
    const n = user.nounus[0];
    return `${n.firstName || ''} ${n.lastName || ''}`.trim() || user.email;
  }
  if (user.parents?.length > 0) {
    const p = user.parents[0];
    return `${p.firstName || ''} ${p.lastName || ''}`.trim() || user.email;
  }
  return user.email?.split('@')[0] || 'Utilisateur';
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

usePullToRefresh(async () => {
  await adminStore.fetchStats();
  pendingPage.value = 1;
  await adminStore.fetchPendingNounus(pendingPage.value, pendingLimit);
  await adminStore.fetchUsers(1, 5);
});

onMounted(() => {
  if (!adminStore.stats) {
    adminStore.fetchStats();
  }
  pendingPage.value = 1;
  adminStore.fetchPendingNounus(pendingPage.value, pendingLimit);
  adminStore.fetchUsers(1, 5);
});
</script>
