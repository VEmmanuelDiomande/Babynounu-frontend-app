// @ts-check
import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sideBar", {
  state: () => ({
    HideTabs: false
  }),

  actions: {
    HideTabsFunction() {
      this.HideTabs = !this.HideTabs;
    },

    OpenMenuFunction() {
      this.HideTabs = true;
    }
  },
});
