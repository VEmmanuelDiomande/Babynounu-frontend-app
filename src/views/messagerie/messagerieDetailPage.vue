<template>
  <IonPage>
    <MessagerieDetailheader />  
    <IonContent>
      <div class="h-full flex flex-col font-love bg-primary/15">
    <div class="flex-1 overflow-y-auto w-full px-4">
      <div v-for="(message, index) in messages" :key="index" class="my-4">
        <div class="flex items-end" :class="message.fromMe ? 'justify-end' : 'justify-start'">
          <div class="max-w-xs mx-2 p-3 rounded-lg rounded-bl-none" :class="message.fromMe ? 'bg-primary text-white' : 'bg-white text-black'">
            <p class="text-ng font-medium">{{ message.text }}</p>
          </div>
        </div>
        <div class="flex items-end mx-3 mt-1" :class="message.fromMe ? 'justify-end' : 'justify-start'">
          <p class="text-sm opacity-70 font-medium">{{ message.time }}</p>
        </div>
        
      </div>
    </div>

    <div class="flex items-center border rounded-lg p-2 bg-gray-100">
      <!-- Emoji Picker Trigger -->
      <button
        class="p-2 text-gray-500 hover:text-gray-800"
        
      >
        <IcIcons name="RiEmotionLine" :size="32" />
      </button>

      <!-- Text Input -->
      <input
        v-model="message"
        type="text"
        placeholder="Écrivez votre message..."
        class="flex-1 px-4 py-2 text-ng bg-transparent outline-none"
      />

      <!-- Send Button -->
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        @click="sendMessage"
      >
        <IcIcons name="RiSendPlaneFill" :size="20" />
      </button>
    </div>
  </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import MessagerieDetailheader from '@/components/headers/MessagerieDetailHeader.vue';
import IcIcons from '@/components/icons/IcIcons.vue';
import { IonContent, IonPage } from '@ionic/vue';
import { ref } from 'vue'

const message = ref('')

const messages = ref([
  {
    text: 'Bonjour, comment vas-tu?',
    fromMe: true,
    time: '10:00 AM'
  },
  {
    text: 'Je vais bien, merci. Et toi?',
    fromMe: false,
    time: '11:45 AM'
  },
  {
    text: 'Je vais bien, merci. Et toi?',
    fromMe: false,
    time: '12:45 PM'
  },
  {
    text: 'Je suis un peu fatigu . J\'ai besoin de prendre un peu de repos.',
    fromMe: true,
    time: '1:00 PM'
  },
/*************  ✨ Codeium Command ⭐  *************/
  {
    text: 'Je suis un peu fatigu . J\'ai besoin de prendre un peu de repos.',
    fromMe: true,
    time: '1:00 PM'
  },
  {
    text: 'Je vais bien, merci. Et toi?',
    fromMe: false,
    time: '2:45 PM'
  },
  {
    text: 'Je vais aux courses, tu veux que je t\'ach te quelque chose?',
    fromMe: true,
    time: '3:00 PM'
  },
  {
    text: 'Non merci, j\'ai tout ce qu\'il me faut. Mais merci pour la proposition.',
    fromMe: false,
    time: '3:15 PM'
  },
  {
    text: 'Je vais regarder un film, tu veux venir?',
    fromMe: true,
    time: '4:00 PM'
  },
  {
    text: 'Je ne peux pas, j\'ai des choses  faire. Mais merci pour l\'invitation.',
    fromMe: false,
    time: '4:15 PM'
  },
  {
    text: 'Dommage, j\'aurais aim  que tu viennes.  une autre fois peut- tre.',
    fromMe: true,
    time: '4:30 PM'
  },
  {
    text: 'Oui,  une autre fois peut- tre. Au revoir.',
    fromMe: false,
    time: '4:45 PM'
  },
  {
    text: 'Au revoir.',
    fromMe: true,
    time: '5:00 PM'
  },
/******  43a9f445-6bfe-48ad-ab9b-bc390481d076  *******/
])

const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value) {
    messages.value.push({
      text: newMessage.value,
      fromMe: true,
      time: new Date().toLocaleTimeString()
    })
    newMessage.value = ''
  }
}
</script>
