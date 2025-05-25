<template>
  <div
    class="flex w-full mb-3"
    :class="{
      'justify-end': isCurrentUser,
      'justify-start': !isCurrentUser
    }"
  >
    <div
      class="flex flex-col max-w-[80%]"
      :class="{
        'items-end transform translate-x-[-8px]': isCurrentUser,
        'items-start transform translate-x-[8px]': !isCurrentUser,
      }"
    >
      <!-- Avatar pour les messages des autres utilisateurs -->
      <div v-if="!isCurrentUser" class="flex items-center mb-1 ml-2">
        <div class="w-6 h-6 rounded-full bg-gray-200 mr-1 overflow-hidden flex-shrink-0">
          <!-- Placeholder pour avatar -->
          <div class="w-full h-full flex items-center justify-center text-xs text-gray-500">
            ?
          </div>
        </div>
        <span class="text-xs text-gray-500">Prestataire</span>
      </div>
      
      <div 
        class="bg-gradient-to-br rounded-2xl p-5 border overflow-hidden shadow-sm"
        :class="{
          'from-white to-gray-50 border-gray-100 rounded-tr-[4px]': isCurrentUser,
          'from-white to-gray-50 border-gray-100 rounded-tl-[4px]': !isCurrentUser
        }"
      >
        <!-- Proposal header -->
        <div 
          class="relative py-4 mb-4 -mx-5 px-5 -mt-5"
          :class="{
            'bg-primary/30': isCurrentUser,
            'bg-primary/10': !isCurrentUser
          }"
        >
          <div class="absolute bottom-0 left-0 right-0 h-2 bg-primary/5"></div>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-full">
              <IcIcons
                name="RiLightbulbFlashFill"
                :size="24"
                :class="{
                  'text-secondary': message.status === 'Accepted',
                  'text-red-500': message.status === 'Refused',
                  'text-primary': message.status === 'Pending',
                }"
              />
            </div>
            <div>
              <h3 class="m-0 text-lg font-bold text-gray-800">
                Proposition de service
              </h3>
              <p class="text-xs text-gray-500 mt-1">
                {{
                  message.status === "Pending"
                    ? message.expired ||
                      "En attente de réponse"
                    : message.status === "Accepted"
                    ? "Proposition acceptée"
                    : "Proposition refusée"
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Proposal details -->
        <div class="mb-5 space-y-4">
          <div
            class="flex items-center justify-between py-2 bg-white rounded-lg border border-gray-100 shadow-xs"
          >
            <div class="flex items-center gap-2">
              <IcIcons
                name="RiMoneyEuroCircleLine"
                :size="18"
                class="text-gray-500"
              />
              <span class="text-gray-600 font-medium">Prix</span>
            </div>
            <span class="text-ng font-bold text-primary">
              {{ getMessageContent(message)?.price }} Fcfa
            </span>
          </div>

          <div
            class="flex items-center justify-between py-2 bg-white rounded-lg border border-gray-100 shadow-xs"
          >
            <div class="flex items-center gap-2">
              <IcIcons
                name="RiTimeLine"
                :size="18"
                class="text-gray-500"
              />
              <span class="text-gray-600 font-medium">Durée</span>
            </div>
            <span class="text-gray-800 font-medium">
              {{ getMessageContent(message)?.duration }}
              <span class="text-gray-500">
                {{ getMessageContent(message)?.durationUnit }}
              </span>
            </span>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-2 text-gray-600">
              <IcIcons name="RiChatQuoteLine" :size="18" />
              <span class="font-medium">Message</span>
            </div>
            <div
              class="bg-white p-4 rounded-lg border border-gray-100 shadow-xs text-gray-700 italic"
            >
              "{{
                getMessageContent(message)?.comment ||
                "Pas de message supplémentaire"
              }}"
            </div>
          </div>
        </div>

        <!-- Proposal actions -->
        <div class="flex gap-2" v-if="!isCurrentUser">
          <button
            class="flex-1 py-3 px-3 rounded-xl font-semibold border-none bg-gradient-to-r from-secondary/90 to-secondary hover:from-secondary hover:to-green-700 text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            @click="$emit('accept')"
            :disabled="
              isProposalExpired ||
              message.status === 'Accepted' ||
              message.status === 'Refused'
            "
            :class="{
              'opacity-50':
                isProposalExpired ||
                message.status === 'Accepted' ||
                message.status === 'Refused',
            }"
          >
            <IcIcons name="RiCheckLine" :size="18" />
            Accepter
          </button>

          <button
            class="flex-1 py-3 px-3 rounded-xl font-semibold border-none bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            @click="$emit('decline')"
            :disabled="
              isProposalExpired ||
              message.status === 'Accepted' ||
              message.status === 'Refused'
            "
            :class="{
              'opacity-50':
                isProposalExpired ||
                message.status === 'Accepted' ||
                message.status === 'Refused',
            }"
          >
            <IcIcons name="RiCloseLine" :size="18" />
            Refuser
          </button>
        </div>
        
        <div v-else class="text-right text-sm text-gray-500 mt-2">
          {{ formatTime(message.createdAt) }}
          <span class="ml-1">
            {{ message.isRead ? "✓✓" : "✓" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IcIcons from "@/components/icons/IcIcons.vue";

defineProps({
  message: {
    type: Object,
    required: true
  },
  isCurrentUser: {
    type: Boolean,
    default: false
  },
  isProposalExpired: {
    type: Boolean,
    default: false
  },
  getMessageContent: {
    type: Function,
    required: true
  },
  formatTime: {
    type: Function,
    required: true
  }
});

defineEmits(['accept', 'decline']);
</script>

<style scoped>
/* Animation d'entrée pour les messages */
@keyframes slideInRight {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.justify-end > div {
  animation: slideInRight 0.3s ease-out forwards;
}

.justify-start > div {
  animation: slideInLeft 0.3s ease-out forwards;
}
</style>