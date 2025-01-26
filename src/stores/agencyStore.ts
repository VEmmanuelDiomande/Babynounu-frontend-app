import type { DELIVERY_TYPE_STANDARD } from "@/types/agency.types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAgencyStore = defineStore("Agency", () => {
  const DATA_type_delivery_standard = ref(<DELIVERY_TYPE_STANDARD[]>[])

  return {
    DATA_type_delivery_standard
  }
})
