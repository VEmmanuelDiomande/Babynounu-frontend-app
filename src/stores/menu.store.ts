// @ts-check
import { defineStore } from "pinia";

export const useMenuStore = defineStore({
  id: "Menu",
  state: () => ({
    XTranslateMenu: 0 || '0',
    ActiveIndexMenu: 0
  }),

  actions: {

  }
   
});
