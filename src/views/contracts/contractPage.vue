<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Liste des Contrats</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="bg-gray-50">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center items-center h-full">
          <ion-spinner name="crescent"></ion-spinner>
        </div>
  
        <!-- Error state -->
        <div v-if="isError" class="p-4 text-red-500">
          Erreur lors du chargement des contrats: {{ error?.message }}
        </div>
  
        <!-- Success state -->
        <div v-if="data" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <ion-card v-for="contract in data" :key="contract.id" class="shadow-md">
            <ion-card-header>
              <ion-card-title class="text-lg font-semibold">{{ contract.title }}</ion-card-title>
              <ion-card-subtitle class="text-sm text-gray-500">
                {{ formatDate(contract.startDate) }} - {{ formatDate(contract.endDate) }}
              </ion-card-subtitle>
            </ion-card-header>
  
            <ion-card-content>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">Statut:</span>
                <ion-badge :color="getStatusColor(contract.status)" class="capitalize">
                  {{ contract.status }}
                </ion-badge>
              </div>
  
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">Montant:</span>
                <span class="font-semibold">{{ formatCurrency(contract.amount) }}</span>
              </div>
  
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Client:</span>
                <span class="text-sm">{{ contract.clientName }}</span>
              </div>
  
              <!-- Actions dropdown -->
              <div class="mt-4 flex justify-end">
                <ion-button fill="clear" @click="toggleDropdown(contract.id)">
                  <ion-icon :icon="ellipsisVertical" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
  
              <!-- Dropdown menu -->
              <div v-if="openDropdownId === contract.id" class="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div class="py-1">
                  <!-- Voir le détail (toujours visible) -->
                  <button 
                    @click="viewDetails(contract.id)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Voir le détail
                  </button>
  
                  <!-- Actions conditionnelles -->
                  <template v-if="isAdmin">
                    <button 
                      v-if="contract.status === 'pending'"
                      @click="confirmContract(contract.id)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Confirmer
                    </button>
  
                    <button 
                      v-if="contract.status === 'active'"
                      @click="terminateContract(contract.id)"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Résilier
                    </button>
  
                    <button 
                      @click="callClient(contract.clientPhone)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Appeler le client
                    </button>
                  </template>
  
                  <template v-if="isParent && contract.status === 'active'">
                    <button 
                      @click="requestTermination(contract.id)"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Demander résiliation
                    </button>
                  </template>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
  
        <!-- Empty state -->
        <div v-if="data && data.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
          <ion-icon :icon="documentTextOutline" class="text-4xl mb-2"></ion-icon>
          <p>Aucun contrat trouvé</p>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
  import { 
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
    IonCardContent, IonButton, IonIcon, IonBadge, IonSpinner,
    toastController
  } from '@ionic/vue';
  import { ellipsisVertical, documentTextOutline } from 'ionicons/icons';
  import { 
    fetchContracts,
    confirmContract as apiConfirmContract,
    terminateContract as apiTerminateContract,
    requestTermination as apiRequestTermination
  } from '@/services/contract.services';
  import { useAuthStore } from '@/stores/auth.store';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const openDropdownId = ref<string | null>(null);
  
  // Toast helper
  const showToast = async (message: string, color: string = 'success') => {
    const toast = await toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  };
  
  // Fetch contracts query
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ['contracts'],
    queryFn: fetchContracts,
  });
  
  // Confirm contract mutation
  const { mutate: confirmContract } = useMutation({
    mutationFn: (contractId: string) => apiConfirmContract(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries(['contracts']);
      showToast('Contrat confirmé avec succès');
    },
    onError: (error: Error) => {
      showToast(`Erreur: ${error.message}`, 'danger');
    }
  });
  
  // Terminate contract mutation (admin)
  const { mutate: terminateContract } = useMutation({
    mutationFn: (contractId: string) => apiTerminateContract(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries(['contracts']);
      showToast('Contrat résilié avec succès');
    },
    onError: (error: Error) => {
      showToast(`Erreur: ${error.message}`, 'danger');
    }
  });
  
  // Request termination mutation (parent)
  const { mutate: requestTermination } = useMutation({
    mutationFn: (contractId: string) => apiRequestTermination(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries(['contracts']);
      showToast('Demande de résiliation envoyée');
    },
    onError: (error: Error) => {
      showToast(`Erreur: ${error.message}`, 'danger');
    }
  });
  
  // Vérification des rôles
  const isAdmin = authStore.toRole === 'admin';
  const isParent = authStore.toRole === 'parent';
  // Fonctions utilitaires
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'terminated': return 'danger';
      default: return 'primary';
    }
  };
  
  // Gestion du dropdown
  const toggleDropdown = (contractId: string) => {
    openDropdownId.value = openDropdownId.value === contractId ? null : contractId;
  };
  
  // Actions
  const viewDetails = (contractId: string) => {
    router.push(`/contracts/${contractId}`);
    openDropdownId.value = null;
  };
  
  const callClient = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_blank');
    openDropdownId.value = null;
  };
  </script>
  
  <style scoped>
  /* Styles personnalisés si nécessaire */
  .ion-card {
    transition: transform 0.2s ease;
  }
  
  .ion-card:hover {
    transform: translateY(-2px);
  }
  </style>