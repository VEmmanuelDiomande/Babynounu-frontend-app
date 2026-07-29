// @ts-check
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useMessageStore = defineStore("MESSAGE", () => {
  const isLogged = ref(false);
  const RoomsOpenId = ref(null)
  const state = reactive({
    searchValueData: ref(""),
  });
  return {state, RoomsOpenId};
});
