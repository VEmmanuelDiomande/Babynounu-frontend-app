<template>
    <ion-modal
      :is-open="modelValue"
      @didDismiss="closeModal"
      class="rounded-lg overflow-hidden"
    >
      <ion-header>
        <ion-toolbar class="bg-primary">
          <ion-title class="text-black font-anton text-lg">Assistance</ion-title>
          <ion-buttons slot="end">
            <button @click="closeModal" class="p-2 rounded-full hover:bg-black/10 transition">
              <IcIcons :size="24" name="RiCloseLine" class="text-black" />
            </button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding bg-gray-50 font-love">
        <div class="space-y-6 max-w-md mx-auto">
          <div class="text-center">
            <div class="bg-primary/10 p-4 rounded-full inline-block">
              <IcIcons
                name="RiCustomerService2Fill"
                :size="40"
                class="text-primary"
              />
            </div>
            <h3 class="font-bold text-xl text-gray-800 mt-3">Besoin d'aide ?</h3>
            <p class="text-gray-600 mt-1">Notre équipe est à votre disposition</p>
          </div>
  
          <div class="space-y-3">
            <!-- Email -->
            <button
              @click="openEmail"
              class="w-full flex items-center p-4 rounded-xl bg-white border border-gray-200 hover:border-primary transition-all shadow-sm hover:shadow-md"
            >
              <div class="bg-primary/10 p-2 rounded-lg">
                <IcIcons name="RiMailLine" :size="20" class="text-primary" />
              </div>
              <div class="ml-3 text-left">
                <p class="font-medium text-gray-800">Envoyer un email</p>
                <p class="text-sm text-gray-500">support@example.com</p>
              </div>
            </button>
  
            <!-- Téléphone -->
            <button
              @click="callSupport"
              class="w-full flex items-center p-4 rounded-xl bg-white border border-gray-200 hover:border-primary transition-all shadow-sm hover:shadow-md"
            >
              <div class="bg-primary/10 p-2 rounded-lg">
                <IcIcons name="RiPhoneLine" :size="20" class="text-primary" />
              </div>
              <div class="ml-3 text-left">
                <p class="font-medium text-gray-800">Appeler le support</p>
                <p class="text-sm text-gray-500">+33 1 23 45 67 89</p>
              </div>
            </button>
  
            <!-- WhatsApp -->
            <button
              @click="openWhatsApp"
              class="w-full flex items-center p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366]/40 transition-all shadow-sm hover:shadow-md"
            >
              <div class="bg-[#25D366]/20 p-2 rounded-lg">
                <IcIcons name="RiWhatsappLine" :size="20" class="text-[#25D366]" />
              </div>
              <div class="ml-3 text-left">
                <p class="font-medium text-gray-800">Contacter par WhatsApp</p>
                <p class="text-sm text-gray-500">Réponse rapide</p>
              </div>
            </button>
  
            <!-- Chat en ligne -->
            <button
              @click="openLiveChat"
              class="w-full flex items-center p-4 rounded-xl bg-primary/10 border border-primary/20 hover:border-primary/40 transition-all shadow-sm hover:shadow-md"
            >
              <div class="bg-primary/20 p-2 rounded-lg">
                <IcIcons name="RiChat1Line" :size="20" class="text-primary" />
              </div>
              <div class="ml-3 text-left">
                <p class="font-medium text-gray-800">Chat en direct</p>
                <p class="text-sm text-gray-500">Disponible maintenant</p>
              </div>
            </button>
          </div>
  
          <div class="text-center text-xs text-gray-400 pt-2">
            <p>Disponible du lundi au vendredi, 9h-18h</p>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent } from '@ionic/vue';
  import { Dialer } from "capacitor-dialer";
  import IcIcons from '@/components/icons/IcIcons.vue';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
  });
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
  }>();
  
  const closeModal = () => {
    emit('update:modelValue', false);
  };
  
  const callSupport = async () => {
    try {
      await Dialer.openDialer({ phoneNumber: '+33123456789' });
    } catch (error) {
      console.error('Error opening dialer:', error);
      // Option: show toast notification to user
    }
  };
  
  const openEmail = () => {
    window.open('mailto:support@example.com?subject=Demande d\'assistance', '_system');
  };
  
  const openWhatsApp = () => {
    const phone = '33123456789';
    const message = encodeURIComponent('Bonjour, je contacte le support...');
    window.open(`https://wa.me/${phone}?text=${message}`, '_system');
  };
  
  const openLiveChat = () => {
    console.log('Ouvrir le chat en ligne');
    // Option: emit('open-chat') pour gérer cela dans le parent
  };
  </script>
  
  <style scoped>
  /* Animation personnalisée */
  button {
    transition: all 0.2s ease;
  }
  
  button:active {
    transform: scale(0.98);
  }
  </style>