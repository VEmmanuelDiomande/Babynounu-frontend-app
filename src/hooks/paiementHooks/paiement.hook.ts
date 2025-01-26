import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useProfiNounulStore } from "./../../stores/authProfilNounuStore";
import type { SEARCH_VERTICAL_MENU } from "./../../types/menu.types";
import { reactive, ref } from "vue";
import { StorageUtils } from "@/utils/store.utils";
import { useRouter } from "vue-router";
import { useNounuStore } from "@/stores/nounu.store";
import { useProfilStore } from "@/stores/authProfilStore";

export const usePaiementHook = () => {
  const state = reactive({
    loading: false,
  });



 

  return {
    state,
   
  };
};
