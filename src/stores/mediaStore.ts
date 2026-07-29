import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useMediaStore = defineStore("MEDIA", () => {
  const state = reactive({
    mediaDocuments: ref([])
  });
  return {state};
});
