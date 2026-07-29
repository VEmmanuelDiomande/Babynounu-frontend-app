<template>
  <div class="space-y-6">
    <!-- Back -->
    <button @click="goBack" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-love font-semibold text-primary bg-white border border-primary/10 hover:bg-primary/5 active:scale-95 transition-all">
      <i class="ri ri-arrow-left-line" style="font-size: 16px;"></i>
      Retour
    </button>

    <!-- Loading -->
    <div v-if="adminStore.isLoading && !user" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <template v-else-if="user">
      <!-- Profile header -->
      <div class="bg-white rounded-3xl border border-primary/10 p-6 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/10">
            <span class="font-anton text-xl text-primary">{{ getInitials() }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="font-anton text-xl text-gray-900">{{ displayName }}</h2>
            <p class="text-sm text-gray-500 font-love">{{ user.email }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-3">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-primary/10 text-primary">
                {{ user.role?.name || user.role?.slug || 'Aucun rôle' }}
              </span>
              <span v-if="user.typeProfil" class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-secondary/10 text-secondary">
                {{ user.typeProfil?.name || user.typeProfil?.slug }}
              </span>
              <span v-if="!user.deletedAt" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-green-50 text-green-700">
                <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Actif
              </span>
              <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-red-50 text-red-700">
                <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                Suspendu
              </span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 mt-6">
          <div class="bg-primary/5 rounded-2xl p-3 border border-primary/10">
            <div class="text-xs text-primary/70 font-love uppercase tracking-wide font-semibold">Annonces</div>
            <div class="font-anton text-lg text-gray-900 mt-0.5">{{ user.jobs?.length || 0 }}</div>
          </div>
          <div class="bg-primary/5 rounded-2xl p-3 border border-primary/10">
            <div class="text-xs text-primary/70 font-love uppercase tracking-wide font-semibold">Paiements</div>
            <div class="font-anton text-lg text-gray-900 mt-0.5">{{ user.payments?.length || 0 }}</div>
          </div>
          <div class="bg-primary/5 rounded-2xl p-3 border border-primary/10">
            <div class="text-xs text-primary/70 font-love uppercase tracking-wide font-semibold">Abonnements</div>
            <div class="font-anton text-lg text-gray-900 mt-0.5">{{ user.abonnements?.length || 0 }}</div>
          </div>
          <div class="bg-primary/5 rounded-2xl p-3 border border-primary/10">
            <div class="text-xs text-primary/70 font-love uppercase tracking-wide font-semibold">Inscrit le</div>
            <div class="text-sm text-gray-900 font-love mt-1">{{ formatDate(user.createdAt) }}</div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Payments -->
        <div class="bg-white rounded-3xl border border-primary/10 p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <i class="ri ri-bank-card-2-line text-primary" style="font-size: 16px;"></i>
            </div>
            <h3 class="font-anton text-base text-gray-900">Derniers paiements</h3>
          </div>
          <div v-if="user.payments?.length" class="space-y-2">
            <div v-for="p in user.payments" :key="p.id" class="flex items-center justify-between py-2 border-b border-primary/10 last:border-0">
              <div class="min-w-0">
                <div class="text-sm font-semibold text-gray-900 font-love">{{ formatAmount(p.amount) }}</div>
                <div class="text-xs text-gray-500 font-love">{{ formatDate(p.createdAt) }}</div>
              </div>
              <span :class="['inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium font-love', getPaymentClass(p.status)]">
                {{ p.status || '—' }}
              </span>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 font-love py-4 text-center">Aucun paiement</p>
        </div>

        <!-- Jobs -->
        <div class="bg-white rounded-3xl border border-primary/10 p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="h-8 w-8 rounded-xl bg-secondary/10 flex items-center justify-center">
              <i class="ri ri-briefcase-line text-secondary" style="font-size: 16px;"></i>
            </div>
            <h3 class="font-anton text-base text-gray-900">Annonces</h3>
          </div>
          <div v-if="user.jobs?.length" class="space-y-2">
            <div v-for="j in user.jobs" :key="j.id" class="py-2 border-b border-primary/10 last:border-0">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ j.titre }}</div>
              <div class="text-xs text-gray-500 font-love">{{ formatDate(j.createdAt) }}</div>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 font-love py-4 text-center">Aucune annonce</p>
        </div>
      </div>
    </template>

    <!-- Error -->
    <div v-else-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      <p class="text-sm text-red-600 font-love">{{ adminStore.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/admin.store';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();

const user = computed(() => adminStore.userDetail);

const displayName = computed(() => {
  const u = user.value;
  if (!u) return '';
  if (u.nounus?.[0]?.fullname) return u.nounus[0].fullname;
  if (u.parents?.[0]?.fullname) return u.parents[0].fullname;
  return u.email?.split('@')[0] || 'Utilisateur';
});

const getInitials = () => {
  return (displayName.value || '').substring(0, 2).toUpperCase();
};

const formatDate = (date: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatAmount = (amount: number) => {
  if (!amount) return '—';
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(amount) + ' FCFA';
};

const getPaymentClass = (status: string) => {
  switch (status) {
    case 'Success': return 'bg-green-50 text-green-700';
    case 'Pending': return 'bg-amber-50 text-amber-700';
    case 'Failed':
    case 'Cancelled': return 'bg-red-50 text-red-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const goBack = () => router.back();

onMounted(() => {
  const id = route.params.id as string;
  if (id) adminStore.fetchUserDetail(id);
});
</script>
