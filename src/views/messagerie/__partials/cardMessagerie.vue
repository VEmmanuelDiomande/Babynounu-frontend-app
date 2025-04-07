<template>
  <div>
    <div
      class="flex flex-col gap-4 w-full m-auto divide-y-[1px] px-4 font-love mb-8 text-zinc-800"
    >
      <div v-for="(message, index) in formattedMessages" :key="index">
        <RouterLink
          :to="{ name: 'CHAT_MESSAGE_DETAIL', params: { id: message.id } }"
        >
          <div class="mt-4 flex flex-row gap-4">
            <!-- Avatar -->
            <div class="size-14 rounded-full bg-slate-200">
              <img
                class="flex w-full h-full rounded-full object-cover"
                v-lazy="message?.photo?.originalUrl"
                :alt="message[sender]?.fullname"
              />
            </div>

            <!-- Content -->
            <div class="w-[calc(100%-70px)] flex flex-col gap-1">
              <div class="flex justify-between items-center">
                <span class="font-bold text-ng text-black">
                  {{ message[sender]?.fullname }}
                </span>
                <span
                  class="text-xs font-semibold first-letter:uppercase  "
                  :class="
                    message.unreadCount > 0 ? 'text-secondary' : 'text-black'
                  "
                >
                  {{ message.formattedDate }}
                </span>
              </div>

              <!-- Lu and recent message -->
              <div class="flex gap-2 items-center w-full">
                <IcIcons 
                  name="RiCheckDoubleLine"
                  :class="message.lastMessage.isRead ? 'text-secondary' : 'text-gray-400'"
                />
                <span class="truncate w-full font-medium text-black text-base">
                  {{ message.lastMessage?.content }}
                </span>
                <div
                  v-if="getUnreadCount(message) > 0"
                  class="w-[50px] flex justify-end text-end"
                >
                  <span
                    class="text-xs size-6 font-bold text-white rounded-full flex items-center justify-center bg-secondary"
                  >
                    {{getUnreadCount(message)}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted, onUnmounted, computed } from "vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { StorageUtils } from "@/utils/store.utils";
import moment from "moment";

// Props
const { Messages, sender } = defineProps<{ Messages: any[]; sender: string }>();

// Références et états
const GetUserId = ref<string | null>(null);
const now = ref(moment()); // Date actuelle qui sera mise à jour régulièrement

// Mettre à jour la date actuelle toutes les minutes
let interval: any | null = null;
onMounted(async () => {
  GetUserId.value = (await StorageUtils().getStore("nUser_Id")).value;

  // Mettre à jour la date actuelle toutes les minutes
  interval = setInterval(() => {
    now.value = moment(); // Mise à jour
  }, 1000); // 60000 ms = 1 minute
});

// Nettoyer l'intervalle lors du démontage
onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});

function getUnreadCount(conversation: any): number {
  return conversation.parentUnreadCount;
}

// Formater les messages avec une date qui se met à jour automatiquement
const formattedMessages = computed(() => {
  return Messages?.filter((msg) => msg.lastMessage).map((msg) => {
    return {
      ...msg,
      // Solution 1: Utiliser from() avec la valeur brute
      formattedDate: moment(msg.lastMessage?.createdAt).from(now.value.valueOf())
      
      // Solution alternative (plus simple): utiliser fromNow()
      // formattedDate: moment(msg.lastMessage?.createdAt).fromNow()
    };
  });
});
</script>