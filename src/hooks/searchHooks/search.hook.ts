import type { SEARCH_VERTICAL_MENU } from "./../../types/menu.types";
import { reactive } from "vue";

export const useSearchHook = () => {
  const state = reactive({
    verticalMenu: reactive(<SEARCH_VERTICAL_MENU>[
      {
        link: "",
        name: "Nounus",
        actived: true,
      },
      {
        link: "",
        name: "Ménagères",
        actived: false,
      },
      {
        link: "",
        name: "Parents",
        actived: false,
      },
    ]),
  });

  return {
    state,
  };
};
