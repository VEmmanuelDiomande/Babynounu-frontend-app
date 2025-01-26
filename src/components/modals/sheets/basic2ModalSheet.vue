<template>
    <ion-modal :is-open="isOpen" @didDismiss="closeModal" mode="ios" presenting-element="ion-router-outlet" canDismiss="true">
      <ion-content>
        <div class="modal-sheet-content">
          <h2>Modal Sheet</h2>
          <p>Contenu du modal ici...</p>
          <ion-button @click="validate">Valider</ion-button>
        </div>
      </ion-content>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  
  // Props pour recevoir l'état d'ouverture du modal
  defineProps({
    isOpen: Boolean, // Indique si le modal est ouvert
  });
  
  // Fonction pour émettre des événements
  const emit = defineEmits(['close']);
  
  // Fonction de validation, qui ferme le modal
  const validate = () => {
    emit('close'); // Émet l'événement pour fermer le modal
  };
  
  // Fonction pour fermer le modal
  const closeModal = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .modal-sheet-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 20px;
  }
  </style>
  