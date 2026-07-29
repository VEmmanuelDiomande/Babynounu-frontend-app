<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div>
        <h2 class="font-anton text-xl text-gray-900">Paiements des Nounous</h2>
        <p class="text-sm text-gray-500 font-love mt-1">
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-green-500"></span>
            {{ adminStore.paymentsTotal }} paiement(s) au total
          </span>
        </p>
      </div>
      <select v-model="statusFilter" @change="onFilterChange" class="text-sm font-love border border-primary/10 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all">
        <option :value="undefined">Tous les statuts</option>
        <option value="Success">Réussi</option>
        <option value="Pending">En attente</option>
        <option value="Failed">Échoué</option>
        <option value="Cancelled">Annulé</option>
      </select>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 gap-4" v-if="adminStore.payments.length > 0">
      <div class="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-green-500 to-green-400 text-white shadow-md shadow-green-200">
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs text-white/80 font-love uppercase tracking-wider font-semibold">Total réussis</div>
            <div class="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
              <i class="ri ri-check-line text-white" style="font-size: 18px;"></i>
            </div>
          </div>
          <div class="font-anton text-2xl">{{ successCount }}</div>
          <div class="text-xs text-white/90 font-love mt-0.5 font-medium">{{ formatAmount(successAmount) }}</div>
        </div>
        <div class="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10"></div>
      </div>
      <div class="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-amber-500 to-amber-400 text-white shadow-md shadow-amber-200">
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs text-white/80 font-love uppercase tracking-wider font-semibold">En attente</div>
            <div class="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
              <i class="ri ri-notification-3-line text-white" style="font-size: 18px;"></i>
            </div>
          </div>
          <div class="font-anton text-2xl">{{ pendingCount }}</div>
          <div class="text-xs text-white/90 font-love mt-0.5">Paiements en cours</div>
        </div>
        <div class="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10"></div>
      </div>
      <div class="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-red-500 to-red-400 text-white shadow-md shadow-red-200">
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs text-white/80 font-love uppercase tracking-wider font-semibold">Échoués / Annulés</div>
            <div class="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
              <i class="ri ri-close-line text-white" style="font-size: 18px;"></i>
            </div>
          </div>
          <div class="font-anton text-2xl">{{ failedCount }}</div>
          <div class="text-xs text-white/90 font-love mt-0.5">À vérifier</div>
        </div>
        <div class="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10"></div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Cards -->
    <div v-else-if="adminStore.payments.length > 0" class="space-y-3">
      <div
        v-for="payment in adminStore.payments"
        :key="payment.id"
        class="bg-white rounded-2xl border border-primary/10 overflow-hidden hover:border-primary/30 transition-all shadow-sm"
      >
        <div class="p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-transparent">
              <span class="font-anton text-base text-primary">{{ getInitials(payment.user) }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ getUserName(payment.user) }}</div>
              <div class="text-xs text-gray-500 font-love truncate">{{ payment.user?.email }}</div>
            </div>
            <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love', getStatusBadgeClass(payment.status)]">
              <span :class="['h-1.5 w-1.5 rounded-full', getStatusDotClass(payment.status)]"></span>
              {{ getStatusLabel(payment.status) }}
            </span>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-500 font-love mb-3">
            <span class="flex items-center gap-1">
              <i class="ri ri-coins-line" style="font-size: 14px;"></i>
              {{ formatAmount(payment.amount) }}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-bank-card-line" style="font-size: 14px;"></i>
              {{ payment.paymentMethod || '—' }}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-calendar-line" style="font-size: 14px;"></i>
              {{ formatDate(payment.createdAt) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span v-if="payment.subscriptions?.length" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-green-50 text-green-700">
              <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Abonnement actif
            </span>
            <span v-else class="text-xs text-gray-400 font-love">Aucun abonnement</span>
            <button
              @click="openDetail(payment)"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-love font-semibold text-primary border border-primary/20 hover:bg-primary/10 active:scale-95 transition-all"
            >
              <i class="ri ri-eye-line" style="font-size: 14px;"></i>
              Détails
            </button>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div class="flex items-center justify-center pt-2">
        <button @click="loadMore" :disabled="adminStore.payments.length < limit" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-primary bg-white border border-primary/10 hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <i class="ri ri-add-line" style="font-size: 16px;"></i>
          Voir plus
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-3xl">
      <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <i class="ri ri-bank-card-2-line text-primary/50" style="font-size: 32px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucun paiement trouvé</p>
      <p class="text-xs text-gray-500 font-love mt-1">Les transactions apparaîtront ici</p>
    </div>

    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      <p class="text-sm text-red-600 font-love">{{ adminStore.error }}</p>
    </div>

    <!-- Detail Drawer -->
    <Drawer :show="showDetail" title="Détail du paiement" maxHeight="85vh" @close="closeDetail">
      <div v-if="selectedPayment" class="space-y-5">
        <div class="flex items-center gap-3">
          <div class="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-transparent">
            <span class="font-anton text-base text-primary">{{ getInitials(selectedPayment.user) }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ getUserName(selectedPayment.user) }}</div>
            <div class="text-xs text-gray-500 font-love truncate">{{ selectedPayment.user?.email }}</div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love', getStatusBadgeClass(selectedPayment.status)]">
            <span :class="['h-1.5 w-1.5 rounded-full', getStatusDotClass(selectedPayment.status)]"></span>
            {{ getStatusLabel(selectedPayment.status) }}
          </span>
          <span v-if="selectedPayment.subscriptions?.length" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-green-50 text-green-700">
            <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            Abonnement actif
          </span>
        </div>

        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm text-gray-700 font-love">
            <i class="ri ri-coins-line text-primary" style="font-size: 16px;"></i>
            <span class="font-medium">Montant :</span>
            <span>{{ formatAmount(selectedPayment.amount) }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-700 font-love">
            <i class="ri ri-bank-card-line text-primary" style="font-size: 16px;"></i>
            <span class="font-medium">Méthode :</span>
            <span>{{ selectedPayment.paymentMethod || '—' }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-700 font-love">
            <i class="ri ri-exchange-dollar-line text-primary" style="font-size: 16px;"></i>
            <span class="font-medium">Devise :</span>
            <span>{{ selectedPayment.currency || 'FCFA' }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-700 font-love">
            <i class="ri ri-hashtag text-primary" style="font-size: 16px;"></i>
            <span class="font-medium">Transaction :</span>
            <span class="truncate">{{ selectedPayment.transactionId || '—' }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-700 font-love">
            <i class="ri ri-calendar-line text-primary" style="font-size: 16px;"></i>
            <span class="font-medium">Créé le :</span>
            <span>{{ formatDate(selectedPayment.createdAt) }}</span>
          </div>
          <div v-if="selectedPayment.paymentDate" class="flex items-center gap-2 text-sm text-gray-700 font-love">
            <i class="ri ri-check-line text-primary" style="font-size: 16px;"></i>
            <span class="font-medium">Payé le :</span>
            <span>{{ formatDate(selectedPayment.paymentDate) }}</span>
          </div>
          <div v-if="selectedPayment.metadata?.geniuspayReference" class="flex items-center gap-2 text-sm text-gray-700 font-love">
            <i class="ri ri-secure-payment-line text-primary" style="font-size: 16px;"></i>
            <span class="font-medium">Référence :</span>
            <span class="truncate">{{ selectedPayment.metadata.geniuspayReference }}</span>
          </div>
        </div>

        <div v-if="selectedPayment.metadata?.customerInfo" class="bg-gray-50 rounded-xl p-3 space-y-2">
          <h4 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide">Client</h4>
          <div class="space-y-1 text-sm text-gray-700 font-love">
            <p v-if="selectedPayment.metadata.customerInfo.name"><span class="font-medium">Nom :</span> {{ selectedPayment.metadata.customerInfo.name }} {{ selectedPayment.metadata.customerInfo.surname }}</p>
            <p v-if="selectedPayment.metadata.customerInfo.email"><span class="font-medium">Email :</span> {{ selectedPayment.metadata.customerInfo.email }}</p>
            <p v-if="selectedPayment.metadata.customerInfo.phone"><span class="font-medium">Téléphone :</span> {{ selectedPayment.metadata.customerInfo.phone }}</p>
          </div>
        </div>

        <div v-if="selectedPayment.subscriptions?.length" class="bg-green-50 rounded-xl p-3 border border-green-100">
          <div class="flex items-center gap-2 mb-2">
            <i class="ri ri-vip-crown-line text-green-500" style="font-size: 18px;"></i>
            <h4 class="font-love text-sm font-semibold text-gray-900">Abonnement</h4>
          </div>
          <div class="space-y-1 text-sm text-gray-700 font-love">
            <p><span class="font-medium">ID :</span> {{ selectedPayment.subscriptions[0].id }}</p>
            <p><span class="font-medium">Statut :</span> {{ selectedPayment.subscriptions[0].status }}</p>
            <p v-if="selectedPayment.subscriptions[0].expiresAt"><span class="font-medium">Expire le :</span> {{ formatDate(selectedPayment.subscriptions[0].expiresAt) }}</p>
            <p v-if="selectedPayment.subscriptions[0].type?.name"><span class="font-medium">Type :</span> {{ selectedPayment.subscriptions[0].type.name }}</p>
          </div>
        </div>

        <div v-if="selectedPayment.status === 'Pending'" class="flex flex-col gap-3 pt-2">
          <button
            @click="handleVerify"
            :disabled="verifying || adminStore.isLoading"
            class="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <i v-if="verifying || adminStore.isLoading" class="ri ri-loader-4-line animate-spin" style="font-size: 16px;"></i>
            <i v-else class="ri ri-refresh-line" style="font-size: 16px;"></i>
            Vérifier le paiement
          </button>
          <button
            @click="handleFail"
            :disabled="adminStore.isLoading"
            class="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <i class="ri ri-close-circle-line" style="font-size: 16px;"></i>
            Mettre en échec
          </button>
        </div>
      </div>
    </Drawer>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { usePullToRefresh } from '@/composables/usePullToRefresh';
import { useConfirmModal } from '@/composables/useConfirmModal';
import { ConfirmModal } from '@/components/ui';
import Drawer from '@/components/ui/Drawer/Drawer.vue';

const adminStore = useAdminStore();
const { showConfirm, confirmTitle, confirmMessage, confirmIcon, confirmIconBg, confirmIconClass, confirmLabel, confirmBgClass, requestConfirm, onConfirm, onCancel } = useConfirmModal();
const currentPage = ref(1);
const limit = 20;
const statusFilter = ref<string | undefined>(undefined);
const showDetail = ref(false);
const selectedPayment = ref<any>(null);
const verifying = ref(false);

const successCount = computed(() => adminStore.payments.filter((p) => p.status === 'Success').length);
const pendingCount = computed(() => adminStore.payments.filter((p) => p.status === 'Pending').length);
const failedCount = computed(() => adminStore.payments.filter((p) => p.status === 'Failed' || p.status === 'Cancelled').length);
const successAmount = computed(() => adminStore.payments.filter((p) => p.status === 'Success').reduce((sum, p) => sum + (p.amount || 0), 0));

const onFilterChange = () => { currentPage.value = 1; adminStore.fetchPayments(currentPage.value, limit, statusFilter.value); };

const getInitials = (user: any) => {
  const name = user?.email || user?.slug || '';
  return name.substring(0, 2).toUpperCase();
};

const getUserName = (user: any) => {
  if (user?.nounus?.[0]?.fullname) return user.nounus[0].fullname;
  if (user?.parents?.[0]?.fullname) return user.parents[0].fullname;
  return user?.email || 'Inconnu';
};

const formatAmount = (amount: number) => {
  if (!amount) return '—';
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(amount) + ' FCFA';
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'Success': return 'Réussi';
    case 'Pending': return 'En attente';
    case 'Failed': return 'Échoué';
    case 'Cancelled': return 'Annulé';
    default: return status || 'Inconnu';
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Success': return 'bg-green-50 text-green-700';
    case 'Pending': return 'bg-amber-50 text-amber-700';
    case 'Failed': return 'bg-red-50 text-red-700';
    case 'Cancelled': return 'bg-gray-100 text-gray-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'Success': return 'bg-green-500';
    case 'Pending': return 'bg-amber-500';
    case 'Failed': return 'bg-red-500';
    case 'Cancelled': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

const getRoleBadgeClass = (slug: string) => {
  switch (slug) {
    case 'admin': return 'bg-primary/10 text-primary';
    case 'nounu': return 'bg-secondary/10 text-secondary';
    case 'parent': return 'bg-indigo-100 text-indigo-600';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getRoleDotClass = (slug: string) => {
  switch (slug) {
    case 'admin': return 'bg-primary';
    case 'nounu': return 'bg-secondary';
    case 'parent': return 'bg-indigo-500';
    default: return 'bg-gray-400';
  }
};

const openDetail = (payment: any) => {
  selectedPayment.value = payment;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
  selectedPayment.value = null;
};

const handleVerify = async () => {
  if (!selectedPayment.value) return;
  try {
    verifying.value = true;
    await adminStore.verifyAdminPayment(selectedPayment.value.id);
    selectedPayment.value = adminStore.payments.find((p) => p.id === selectedPayment.value.id) || selectedPayment.value;
  } catch (e: any) {
    console.error('Erreur vérification paiement:', e);
  } finally {
    verifying.value = false;
  }
};

const handleFail = () => {
  if (!selectedPayment.value) return;
  requestConfirm(
    'Voulez-vous vraiment mettre ce paiement en échec ? Cette action est irréversible.',
    async () => {
      try {
        await adminStore.failAdminPayment(selectedPayment.value.id);
        selectedPayment.value = adminStore.payments.find((p) => p.id === selectedPayment.value.id) || selectedPayment.value;
      } catch (e: any) {
        console.error('Erreur mise en échec:', e);
      }
    },
    { title: 'Mettre en échec', icon: 'close-circle-line', iconBgClass: 'bg-red-50', iconClass: 'text-red-500', confirmLabel: 'Confirmer', confirmBgClass: 'bg-red-500 hover:bg-red-600 shadow-red-200' }
  );
};

const loadMore = () => { currentPage.value++; adminStore.fetchPayments(currentPage.value, limit, statusFilter.value); };

usePullToRefresh(() => adminStore.fetchPayments(currentPage.value, limit, statusFilter.value));

onMounted(() => { adminStore.fetchPayments(currentPage.value, limit); });
</script>
