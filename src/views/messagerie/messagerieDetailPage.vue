<template>
  <GlobalDetailMessage
    :dataChat="dataChat"
    typeProfil="nounou"
    :activeConversation="activeConversation"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import GlobalDetailMessage from "./globalDetailMessage.vue";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { socketService } from "@/services/socket.services";

const activeConversation = ref<any | null>(null);

const route = useRoute();

const fetchConversation = async () => {
  activeConversation.value = route.params.id;
  if (!activeConversation.value) return;
  const response = await SettingServices().listSetting(
    `${URL_API_ROUTE.CONVERSATION_ONLY}/${activeConversation.value}`
  );

  if (!response) return;
  return response;
};

const {
  refetch,
  data: dataChat,
  isLoading: loadingChat,
  isError: errorChat,
} = useQuery({
  queryKey: ["Rooms", activeConversation.value],
  queryFn: fetchConversation,
  retry: 2,
  refetchOnWindowFocus: false,
});


onMounted(() => {
  activeConversation.value = route.params.id;

});
</script>
