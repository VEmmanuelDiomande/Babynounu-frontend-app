// @ts-check
import { StorageUtils } from "@/utils/store.utils";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("USER", () => {
  const isLogged = ref(false);
  const isAdmin = ref(false);
  const USER = ref();
  const userId = ref();
  const profilId = ref();
  const pageType = ref();
  const typeProfil = ref();
  const isOwner = ref(false);
  const dataProfil = ref();

  const _USER = async () => {
    userId.value = (await StorageUtils().getStore("nUser_Id")).value;
    typeProfil.value = (await StorageUtils().getStore("nType_Profil")).value;
  };

  const isOwnerUserConnected = async (_ProfilId: any) => {
    const profilId = (await StorageUtils().getStore("nProfil_1_Id")).value;
    if (_ProfilId == profilId) {
      isOwner.value = true;
    }else{
      isOwner.value = false;
    }
  };

  const getUser = async () => (await StorageUtils().getStore("nUser_Id")).value;

  const _isLogged = async () => {
    const user = await StorageUtils().getStore("nUser_Id");
    if (user) {
      isLogged.value = true;
    } else {
      isLogged.value = false;
    }
  }

  const _isAdmin = async () => {
    const user = await StorageUtils().getStore("nUser_Id");
    if (user) {
      isAdmin.value = true;
    } else {
      isAdmin.value = false;
    }
  };

  const _pageType = async (_pageType: any) => {
    pageType.value = _pageType;
  };

  const _isProfil = async () => {
    const profil = (await StorageUtils().getStore("nProfil_1_Id")).value;
    if (profil) {
      profilId.value = true;
    } else {
      profilId.value = false;
    }
  }


  return {
    isLogged,
    _USER,
    USER,
    userId,
    getUser,
    pageType,
    isOwner,
    isAdmin,
    typeProfil,
    isOwnerUserConnected,
    _isProfil,
    profilId,
    _isLogged,
    _isAdmin,
    _pageType,
  };
});
