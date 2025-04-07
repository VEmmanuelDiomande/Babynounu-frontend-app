// @ts-check
import { StorageUtils } from "@/utils/store.utils";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("USER", () => {
  const isLogged = ref(false);
  const isAdmin = ref(false);
  const USER = ref();
  const userId = ref();
  const pageType = ref();
  const typeProfil = ref();
  const isOwner = ref(false)

  const _USER = async () => {
    userId.value = (await StorageUtils().getStore("nUser_Id")).value;
    typeProfil.value = (await StorageUtils().getStore("nType_Profil")).value;
  };

  const getUser = async () => (await StorageUtils().getStore("nUser_Id")).value;

  return {
    isLogged,
    _USER,
    USER,
    userId,
    getUser,
    pageType,
    isOwner,
    isAdmin,
    typeProfil
  };
});
