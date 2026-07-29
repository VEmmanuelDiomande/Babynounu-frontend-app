<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div>
        <h2 class="font-anton text-xl text-gray-900">Nounus</h2>
        <p class="text-sm text-gray-500 font-love mt-1">
          <span class="inline-flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-secondary"></span>
            {{ adminStore.nounusListTotal }} nounu(s) au total
          </span>
        </p>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <i class="ri ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style="font-size: 16px;"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher..."
            class="text-sm font-love border border-primary/10 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all w-full"
          />
        </div>
        <select
          v-model="certifFilter"
          @change="onFilterChange"
          class="text-sm font-love border border-primary/10 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
        >
          <option :value="undefined">Tous</option>
          <option value="Approved">Certifié</option>
          <option value="Pending">En attente</option>
          <option value="Rejected">Rejeté</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-secondary border-t-transparent"></div>
    </div>

    <!-- Cards -->
    <div v-else-if="filteredNounus.length > 0" class="space-y-3">
      <div
        v-for="nounu in filteredNounus"
        :key="nounu.id"
        class="bg-white rounded-2xl border border-primary/10 overflow-hidden hover:border-secondary/30 transition-all shadow-sm"
      >
        <div class="p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 border border-transparent">
              <span class="font-anton text-base text-secondary">{{ getInitials(nounu) }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ nounu.fullname || '—' }}</div>
              <div class="text-xs text-gray-500 font-love truncate">{{ nounu.user?.email }}</div>
            </div>
            <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love', getCertifClass(nounu.certif)]">
              <span :class="['h-1.5 w-1.5 rounded-full', getCertifDot(nounu.certif)]"></span>
              {{ getCertifLabel(nounu.certif) }}
            </span>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-500 font-love mb-3">
            <span class="flex items-center gap-1">
              <i class="ri ri-phone-line" style="font-size: 14px;"></i>
              {{ nounu.phone || '—' }}
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-coins-line" style="font-size: 14px;"></i>
              {{ nounu.tarifHoraire || '—' }} F/h
            </span>
            <span class="flex items-center gap-1">
              <i class="ri ri-wallet-line" style="font-size: 14px;"></i>
              {{ formatAmount(nounu._pendingBalance || 0) }} F
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span v-if="nounu.restricted" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-orange-50 text-orange-700">
              <span class="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
              Restreint
            </span>
            <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium font-love bg-green-50 text-green-700">
              <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Actif
            </span>
            <div class="flex items-center gap-2">
              <button
                v-if="nounu.userId"
                @click="openDetailsModal(nounu)"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-love font-semibold text-secondary border border-secondary/10 hover:bg-secondary/10 active:scale-95 transition-all"
              >
                <i class="ri ri-information-line" style="font-size: 14px;"></i>
              </button>
              <button
                v-if="nounu.userId"
                @click="openPayModal(nounu)"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-love font-semibold text-white bg-secondary hover:bg-secondary/80 active:scale-95 transition-all"
              >
                <i class="ri ri-wallet-line" style="font-size: 14px;"></i>
              </button>
              <button
                @click="handleToggleRestrict(nounu)"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-love font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all"
              >
                <i class="ri ri-shield-line" style="font-size: 14px;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load more -->
      <div class="flex items-center justify-center pt-2">
        <button @click="loadMore" :disabled="adminStore.nounusList.length < limit" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-love font-semibold text-secondary bg-white border border-primary/10 hover:bg-secondary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <i class="ri ri-add-line" style="font-size: 16px;"></i>
          Voir plus
        </button>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-3xl">
      <div class="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
        <i class="ri ri-user-3-line text-secondary/50" style="font-size: 32px;"></i>
      </div>
      <p class="text-sm text-gray-900 font-love font-semibold">Aucun nounu trouvé</p>
      <p class="text-xs text-gray-500 font-love mt-1">Essayez un autre filtre ou terme de recherche</p>
    </div>

    <!-- Error -->
    <div v-if="adminStore.error" class="bg-red-50 border border-red-200 rounded-3xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 24px;"></i>
      <p class="text-sm text-red-600 font-love">{{ adminStore.error }}</p>
    </div>

    <!-- Details Drawer -->
    <Drawer :show="showDetailsModal" title="Prestations du nounu" maxHeight="90vh" @close="closeDetailsModal">
      <div v-if="adminStore.isLoading" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-secondary border-t-transparent"></div>
      </div>

      <div v-else-if="adminStore.nounuDetail" class="space-y-3">
        <!-- Nounu info -->
        <div class="flex items-center gap-3 p-3 bg-secondary/5 rounded-xl border border-secondary/10">
          <div class="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <span class="font-anton text-sm text-secondary">{{ getInitials(adminStore.nounuDetail.nounu) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-gray-900 font-love truncate">{{ adminStore.nounuDetail.nounu?.fullname }}</div>
            <div class="text-xs text-gray-500 font-love truncate">{{ adminStore.nounuDetail.nounu?.user?.email }}</div>
          </div>
          <div class="text-right flex-shrink-0">
            <div class="text-xs text-gray-500 font-love">Téléphone</div>
            <div class="text-xs sm:text-sm font-medium text-gray-900 font-love">{{ adminStore.nounuDetail.nounu?.phone }}</div>
          </div>
        </div>

        <!-- References -->
        <div v-if="adminStore.nounuDetail.nounu?.references" class="p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div class="text-xs text-gray-500 font-love mb-1 font-medium flex items-center gap-1.5">
            <i class="ri ri-bookmark-line" style="font-size: 14px;"></i>
            Références
          </div>
          <ul v-if="parseReferences(adminStore.nounuDetail.nounu.references).length > 0" class="space-y-2">
            <li
              v-for="(reference, index) in parseReferences(adminStore.nounuDetail.nounu.references)"
              :key="index"
              class="text-sm text-gray-700 font-love"
            >
              <span class="font-medium text-gray-900">{{ reference.fullname || 'Référence' }}</span>
              <span v-if="reference.phone" class="text-gray-500 text-xs block">{{ reference.phone }}</span>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-700 font-love whitespace-pre-wrap break-words">{{ adminStore.nounuDetail.nounu.references }}</p>
        </div>

        <!-- Short bio -->
        <div v-if="adminStore.nounuDetail.nounu?.courteBiographie" class="p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div class="text-xs text-gray-500 font-love mb-1 font-medium flex items-center gap-1.5">
            <i class="ri ri-bookmark-line" style="font-size: 14px;"></i>
            Biographie
          </div>
          <p class="text-sm text-gray-700 font-love whitespace-pre-wrap break-words">{{ adminStore.nounuDetail.nounu.courteBiographie }}</p>
        </div>

        <!-- Summary cards -->
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-green-50 rounded-xl p-2 sm:p-3 text-center border border-green-100">
            <div class="text-xs text-green-600 font-love font-medium mb-1">Généré</div>
            <div class="text-xs sm:text-sm font-anton text-green-700">{{ formatAmount(adminStore.nounuDetail.summary?.totalGenerated || 0) }} F</div>
          </div>
          <div class="bg-blue-50 rounded-xl p-2 sm:p-3 text-center border border-blue-100">
            <div class="text-xs text-blue-600 font-love font-medium mb-1">Payé</div>
            <div class="text-xs sm:text-sm font-anton text-blue-700">{{ formatAmount(adminStore.nounuDetail.summary?.totalPaid || 0) }} F</div>
          </div>
          <div class="bg-orange-50 rounded-xl p-2 sm:p-3 text-center border border-orange-100">
            <div class="text-xs text-orange-600 font-love font-medium mb-1">Reste</div>
            <div class="text-xs sm:text-sm font-anton text-orange-700">{{ formatAmount(adminStore.nounuDetail.summary?.remaining || 0) }} F</div>
          </div>
        </div>

        <!-- Documents -->
        <div v-if="adminStore.nounuDetail.nounu?.user?.medias?.length > 0">
          <div class="text-xs text-gray-500 font-love mb-2 font-medium flex items-center gap-1.5">
            <i class="ri ri-file-line" style="font-size: 14px;"></i>
            Documents ({{ adminStore.nounuDetail.nounu.user.medias.length }})
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            <button
              v-for="media in adminStore.nounuDetail.nounu.user.medias"
              :key="media.id"
              type="button"
              @click="handleMediaClick(media)"
              class="w-full flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-left hover:border-secondary/30 hover:bg-secondary/5 transition-all"
            >
              <div class="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <i :class="['ri', getMediaIcon(media), 'text-secondary']" style="font-size: 16px;"></i>
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-xs font-medium text-gray-900 font-love truncate">{{ media.originalName }}</div>
                <div class="text-xs text-gray-400 font-love truncate">{{ media.typeMedia?.label || 'Document' }}</div>
              </div>
              <i class="ri ri-popup-line text-gray-400" style="font-size: 12px;"></i>
            </button>
          </div>
        </div>
        <div v-else class="text-sm text-gray-400 font-love text-center py-2 bg-gray-50 rounded-lg border border-gray-100">
          <i class="ri ri-file-line" style="font-size: 16px;"></i>
          Aucun document téléversé
        </div>

        <!-- Payment History -->
        <div>
          <div class="text-xs text-gray-500 font-love mb-2 font-medium flex items-center justify-between gap-1.5">
            <div class="flex items-center gap-1.5">
              <i class="ri ri-wallet-line" style="font-size: 14px;"></i>
              Historique des paiements
            </div>
            <button
              @click="loadNounuPayments"
              :disabled="loadingPayments"
              class="text-xs text-secondary hover:text-secondary/80 font-love font-medium disabled:opacity-40"
            >
              <i class="ri ri-refresh-line" style="font-size: 14px;"></i>
            </button>
          </div>
          <div v-if="loadingPayments" class="flex items-center justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-secondary border-t-transparent"></div>
          </div>
          <div v-else-if="adminStore.nounuPayments && adminStore.nounuPayments.length > 0" class="space-y-2 max-h-48 overflow-y-auto">
            <div
              v-for="payment in adminStore.nounuPayments"
              :key="payment.id"
              class="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div class="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="getPaymentStatusBg(payment.status)">
                <i :class="['ri', getPaymentStatusIcon(payment.status), getPaymentStatusText(payment.status)]" style="font-size: 16px;"></i>
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-xs font-medium text-gray-900 font-love">{{ formatAmount(payment.amount) }} {{ payment.currency || 'FCFA' }}</div>
                <div class="text-xs text-gray-400 font-love">{{ formatDate(payment.paymentDate || payment.createdAt) }}</div>
              </div>
              <span :class="['text-xs font-medium font-love px-2 py-0.5 rounded-full', getPaymentStatusClass(payment.status)]">
                {{ getPaymentStatusLabel(payment.status) }}
              </span>
            </div>
          </div>
          <div v-else class="text-sm text-gray-400 font-love text-center py-4 bg-gray-50 rounded-lg border border-gray-100">
            <i class="ri ri-wallet-line" style="font-size: 16px;"></i>
            Aucun paiement enregistré
          </div>
        </div>
      </div>
    </Drawer>

    <!-- Pay Nounu Drawer -->
    <Drawer :show="showPayModal" title="Payer le nounu" maxHeight="85vh" @close="closePayModal">
      <div v-if="selectedNounu" class="space-y-3">
        <div class="flex items-center gap-3 p-3 bg-secondary/5 rounded-xl border border-secondary/10">
          <div class="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
            <span class="font-anton text-sm text-secondary">{{ getInitials(selectedNounu) }}</span>
          </div>
          <div>
            <div class="text-sm font-semibold text-gray-900 font-love">{{ selectedNounu.fullname }}</div>
            <div class="text-xs text-gray-500 font-love">{{ selectedNounu.user?.email }}</div>
          </div>
        </div>
        <div>
          <label class="block text-xs font-love font-medium text-gray-500 mb-1">Montant (FCFA)</label>
          <input
            v-model="payAmount"
            type="number"
            min="0"
            placeholder="Entrez le montant"
            class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all"
          />
        </div>
        <div>
          <label class="block text-xs font-love font-medium text-gray-500 mb-1">Opérateur</label>
          <select
            v-model="payOperator"
            class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all bg-white"
          >
            <option value="" disabled>Choisir un opérateur</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="wave">Wave</option>
          </select>
        </div>
        <div v-if="selectedNounu?.phone" class="p-3 bg-secondary/5 rounded-xl border border-secondary/10">
          <div class="text-xs font-love font-medium text-gray-500 mb-1">Numéro du destinataire</div>
          <div class="text-sm font-love font-semibold text-gray-900 flex items-center gap-2">
            <i class="ri ri-phone-line text-secondary" style="font-size: 16px;"></i>
            {{ selectedNounu.phone }}
          </div>
        </div>
        <div>
          <label class="block text-xs font-love font-medium text-gray-500 mb-1">Description (optionnel)</label>
          <textarea
            v-model="payDescription"
            rows="2"
            placeholder="Description du paiement..."
            class="w-full text-sm font-love border border-primary/10 rounded-xl px-3 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all resize-none"
          ></textarea>
        </div>
        <div v-if="payError" class="text-sm text-red-600 font-love">{{ payError }}</div>
        <div v-if="paySuccess" class="flex items-center gap-2 text-sm text-green-600 font-love bg-green-50 rounded-xl px-3 py-2">
          <i class="ri ri-checkbox-circle-line" style="font-size: 16px;"></i>
          {{ paySuccessMessage || 'Paiement effectué avec succès' }}
        </div>
      </div>
      <template #footer>
        <div class="flex items-center gap-3">
          <button
            @click="submitPayment"
            :disabled="adminStore.isLoading || !payAmount || payAmount <= 0 || !payOperator"
            class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-love font-semibold text-white bg-secondary hover:bg-secondary/80 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {{ adminStore.isLoading ? 'Traitement...' : 'Confirmer le paiement' }}
          </button>
          <button @click="closePayModal" class="px-4 py-2.5 rounded-xl text-sm font-love font-semibold text-gray-600 border border-primary/10 hover:bg-primary/5 transition-colors">
            Annuler
          </button>
        </div>
      </template>
    </Drawer>

    <!-- Confirm Restrict Drawer -->
    <Drawer :show="showRestrictModal" title="Confirmation" maxHeight="auto" @close="cancelRestrict">
      <p class="text-sm text-gray-600 font-love">
        Voulez-vous vraiment {{ restrictActionLabel }} <span class="font-semibold text-gray-900">{{ selectedNounu?.fullname }}</span> ?
      </p>
      <template #footer>
        <div class="flex items-center gap-3">
          <button
            @click="cancelRestrict"
            class="flex-1 px-4 py-2.5 rounded-xl text-sm font-love font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
          >
            Annuler
          </button>
          <button
            @click="confirmRestrict"
            class="flex-1 px-4 py-2.5 rounded-xl text-sm font-love font-medium text-white bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all shadow-sm shadow-orange-200"
          >
            Confirmer
          </button>
        </div>
      </template>
    </Drawer>
  </div>

  <ImageModal
    :show="showImageModal"
    :src="selectedImageUrl"
    @close="showImageModal = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { usePullToRefresh } from '@/composables/usePullToRefresh';
import Drawer from '@/components/ui/Drawer/Drawer.vue';
import ImageModal from '@/components/ui/ImageModal/ImageModal.vue';
import { getMediaIcon, getMediaUrl, isImageMedia, openMedia } from '@/utils/media.utils';
import { parseReferences } from '@/utils/helpers.utils';

const adminStore = useAdminStore();
const currentPage = ref(1);
const limit = 20;
const certifFilter = ref<string | undefined>(undefined);
const searchQuery = ref('');

const showPayModal = ref(false);
const showDetailsModal = ref(false);
const showRestrictModal = ref(false);
const restrictActionLabel = ref('');
const restrictTarget = ref<any>(null);
const selectedNounu = ref<any>(null);
const payAmount = ref<number>(0);
const payOperator = ref<'mobile_money' | 'wave' | ''>('');
const payDescription = ref('');
const payError = ref('');
const paySuccess = ref(false);
const paySuccessMessage = ref('');
const loadingPayments = ref(false);

const showImageModal = ref(false);
const selectedImageUrl = ref('');

const handleMediaClick = (media: any) => {
  if (isImageMedia(media)) {
    selectedImageUrl.value = getMediaUrl(media);
    showImageModal.value = true;
  } else {
    openMedia(media);
  }
};

const openPayModal = (nounu: any) => {
  selectedNounu.value = nounu;
  payAmount.value = 0;
  payOperator.value = '';
  payDescription.value = '';
  payError.value = '';
  paySuccess.value = false;
  showPayModal.value = true;
};

const closePayModal = () => {
  showPayModal.value = false;
  selectedNounu.value = null;
};

const openDetailsModal = (nounu: any) => {
  selectedNounu.value = nounu;
  showDetailsModal.value = true;
  adminStore.fetchNounuDetails(nounu.id);
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
};

const loadNounuPayments = async () => {
  if (!selectedNounu.value?.userId) return;
  loadingPayments.value = true;
  try {
    await adminStore.fetchNounuPayments(selectedNounu.value.id);
  } catch (e) {
    console.error('Erreur chargement paiements:', e);
  } finally {
    loadingPayments.value = false;
  }
};

const handleToggleRestrict = (nounu: any) => {
  restrictTarget.value = nounu;
  restrictActionLabel.value = nounu.restricted ? 'lever la restriction de' : 'restreindre';
  showRestrictModal.value = true;
};

const cancelRestrict = () => {
  showRestrictModal.value = false;
  restrictTarget.value = null;
};

const confirmRestrict = async () => {
  const nounu = restrictTarget.value;
  if (!nounu) return;
  const next = !nounu.restricted;
  showRestrictModal.value = false;
  try { await adminStore.restrictNounu(nounu.id, next); } catch { /* error in store */ }
  restrictTarget.value = null;
};

const submitPayment = async () => {
  if (!selectedNounu.value || !payAmount.value || payAmount.value <= 0) return;
  payError.value = '';
  paySuccess.value = false;
  try {
    const result = await adminStore.payNounu({
      nounuId: selectedNounu.value.id,
      amount: payAmount.value,
      paymentMethod: payOperator.value ? (payOperator.value === 'wave' ? 'Wave' : 'Mobile Money') : undefined,
      operator: payOperator.value || undefined,
      description: payDescription.value || undefined,
    });

    // Payout direct vers le téléphone du nounu
    paySuccess.value = true;
    paySuccessMessage.value = `Transfert de ${payAmount.value} ${result.currency} initié vers ${result.recipientPhone || 'le nounu'}. Référence: ${result.reference}`;
    
    // Fermer le modal après succès
    setTimeout(() => {
      closePayModal();
      // Rafraîchir les paiements du nounu
      if (selectedNounu.value) {
        loadNounuPayments();
      }
    }, 2000);
  } catch (e: any) {
    payError.value = e.message;
  }
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fr-FR').format(amount || 0);
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const filteredNounus = computed(() => {
  if (!searchQuery.value) return adminStore.nounusList;
  const q = searchQuery.value.toLowerCase();
  return adminStore.nounusList.filter((n: any) =>
    (n.fullname || '').toLowerCase().includes(q) || (n.user?.email || '').toLowerCase().includes(q)
  );
});

const getInitials = (nounu: any) => {
  const name = nounu.fullname || nounu.user?.email || '';
  return name.substring(0, 2).toUpperCase();
};

const getCertifLabel = (certif: string) => {
  switch (certif) {
    case 'Approved': return 'Certifié';
    case 'Rejected': return 'Rejeté';
    default: return 'En attente';
  }
};

const getCertifClass = (certif: string) => {
  switch (certif) {
    case 'Approved': return 'bg-green-50 text-green-700';
    case 'Rejected': return 'bg-red-50 text-red-700';
    default: return 'bg-amber-50 text-amber-700';
  }
};

const getCertifDot = (certif: string) => {
  switch (certif) {
    case 'Approved': return 'bg-green-500';
    case 'Rejected': return 'bg-red-500';
    default: return 'bg-amber-500';
  }
};

const getPaymentStatusBg = (status: string) => {
  switch (status) {
    case 'Success': return 'bg-green-100';
    case 'Failed': return 'bg-red-100';
    case 'Cancelled': return 'bg-gray-100';
    default: return 'bg-amber-100';
  }
};

const getPaymentStatusIcon = (status: string) => {
  switch (status) {
    case 'Success': return 'ri-check-line';
    case 'Failed': return 'ri-close-line';
    case 'Cancelled': return 'ri-prohibited-line';
    default: return 'ri-time-line';
  }
};

const getPaymentStatusText = (status: string) => {
  switch (status) {
    case 'Success': return 'text-green-600';
    case 'Failed': return 'text-red-600';
    case 'Cancelled': return 'text-gray-600';
    default: return 'text-amber-600';
  }
};

const getPaymentStatusClass = (status: string) => {
  switch (status) {
    case 'Success': return 'bg-green-50 text-green-700';
    case 'Failed': return 'bg-red-50 text-red-700';
    case 'Cancelled': return 'bg-gray-50 text-gray-700';
    default: return 'bg-amber-50 text-amber-700';
  }
};

const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case 'Success': return 'Réussi';
    case 'Failed': return 'Échoué';
    case 'Cancelled': return 'Annulé';
    default: return 'En attente';
  }
};

const onFilterChange = () => {
  currentPage.value = 1;
  adminStore.fetchNounusList(currentPage.value, limit, certifFilter.value);
};

const loadMore = () => {
  currentPage.value++;
  adminStore.fetchNounusList(currentPage.value, limit, certifFilter.value);
};

// Vérifier le retour de paiement Genius Pay
const checkPaymentReturn = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const transactionId = urlParams.get('transaction_id');
  const status = urlParams.get('status');

  if (transactionId) {
    try {
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/admin/nounus-list');

      if (status === 'error') {
        payError.value = 'Le paiement a échoué ou a été annulé';
        showPayModal.value = true;
        return;
      }

      // Vérifier le paiement
      await adminStore.verifyNounuPayment(transactionId);
      adminStore.fetchNounusList(currentPage.value, limit, certifFilter.value);
    } catch (e: any) {
      console.error('Erreur vérification paiement:', e);
    }
  }
};

onMounted(() => {
  adminStore.fetchNounusList(currentPage.value, limit, certifFilter.value);
  checkPaymentReturn();
});

usePullToRefresh(() => adminStore.fetchNounusList(currentPage.value, limit, certifFilter.value));
</script>
