// @ts-check
import { INPUT_ERROR, SIGN_UP } from "@/types/auth.types";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useMediaStore = defineStore("MEDIA", () => {
  const state = reactive({
    mediaDocuments: ref([])
  });
  return {state};
});
