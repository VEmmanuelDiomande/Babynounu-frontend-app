// @ts-check
import { INPUT_ERROR, SIGN_UP } from "@/types/auth.types";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useConversationStore = defineStore("CONVERSATION", () => {
 
  const state = reactive({
    Rooms: ref(<any>[]),
    isLoading: ref(false),
    isError: ref(false),
   RoomsOpenId: ref(null),
   countMessageNotRead: ref(0)
  });
  return {state};
});
