import { reactive } from "vue";
import { SIDEBAR_MENU } from "../../types/menu.types";
import { StorageUtils } from "@/utils/store.utils";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { globalFetch } from "@/routes/authenticate/fetch.authenticates";

export const useSidebarHook = () => {
  const USER_PROFIL = reactive(<any>{});
  const state = reactive({
    
    menuSideBar: reactive(<SIDEBAR_MENU>[
      {
        icon: "RiSearchLine",
        name: "Rechercher",
        link: "SEARCH",
        actived: true,
      },
      {
        icon: "RiNotificationLine",
        name: "Notifications",
        link: "NOTIFICATIONS",
        actived: true,
      },
      {
        icon: "RiMegaphoneLine",
        name: "Mes annonces",
        link: "HOME",
        actived: true,
      },
      {
        icon: "RiBriefcaseLine",
        name: "Missions",
        link: "HOME",
        actived: true,
      },
      {
        icon: "RiCustomerService2Line",
        name: "Aide",
        link: "HOME",
        actived: true,
      },
      
    ]),
    countStatsProfile: [
      {
        name: "Interessés",
        count: 0,
      },
      {
        name: "Followers",
        count: 0,
      },
    ],
  });


  const Logout = () => {
    StorageUtils().clearStore();
    location.assign("/auth/sign");
  }

  const GetUserConnect = async () => {
    const UserId = (await StorageUtils().getStore('nUser_Id')).value
    const response = await globalFetch(URL_API_ROUTE.USER_IS_LOGGED + '/' + UserId);
    USER_PROFIL.value = response?.nounu ? response?.nounu : response?.parent ? response?.parent : null;
  }

  return {
    state,
    Logout,
    GetUserConnect,
    USER_PROFIL
  };
};
