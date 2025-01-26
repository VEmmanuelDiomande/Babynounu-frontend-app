import type { SEARCH_VERTICAL_MENU } from "./../../types/menu.types";
import { reactive } from "vue";

export const useNotificationHook = () => {
  const state = reactive({
    verticalMenu: reactive(<SEARCH_VERTICAL_MENU>[
      {
        link: "",
        name: "Tous",
        actived: true,
      },
      {
        link: "",
        name: "Disponibles",
        actived: false,
      },
      {
        link: "",
        name: "Paiements",
        actived: false,
      },
      // {
      //   link: "",
      //   name: "Systèmes",
      //   actived: false,
      // },
    ]),
  });

  const toggleActiveMenu = (index: number) => {
    state.verticalMenu.forEach((menu, i) => {
      menu.actived = i === index;
    });
  };

  return {
    state,
    toggleActiveMenu,
  };
};
