import { reactive } from "vue";
import { TABS } from "../../types/menu.types";

export const useTabHook = () => {
  const state = reactive({
    menuTabs: reactive(<TABS>[
      {
        icon: "RiHomeLine",
        iconFull: "RiHomeFill",
        name: "Accueil",
        link: "/home/nounus",
        tab: "tab1",
        actived: true,
      },
      {
        icon: "RiSearch2Line",
        iconFull: "RiSearch2Fill",
        name: "Rechercher",
        link: "/search/nounus",
        tab: "tab2",
        actived: true,
      },
      {
        icon: "RiChat2Line",
        iconFull: "RiChat2Fill",
        name: "Messageries",
        link: "/chat",
        tab: "tab3",
        actived: true,
      },
      {
        icon: "RiNotificationLine",
        iconFull: "RiNotificationFill",
        name: "Notifications",
        link: "/notifications",
        tab: "tab4",
        actived: true,
      },
      {
        icon: "RiUser3Line",
        iconFull: "RiUser3Fill",
        name: "Profil",
        link: "/profil/parent",
        tab: "tab5",
        actived: true,
      },
    ]),

    menuJobTabs: reactive(<TABS>[
      {
        icon: "RiHomeLine",
        iconFull: "RiHomeFill",
        name: "Accueil",
        link: "/home/jobs",
        tab: "tab-jobs-1",
        actived: true,
      },
      {
        icon: "RiSearch2Line",
        iconFull: "RiSearch2Fill",
        name: "Rechercher",
        link: "/search/jobs",
        tab: "tab-jobs-2",
        actived: true,
      },
      {
        icon: "RiChat2Line",
        iconFull: "RiChat2Fill",
        name: "Messageries",
        link: "/chat",
        tab: "tab-jobs-3",
        actived: true,
      },
      {
        icon: "RiNotificationLine",
        iconFull: "RiNotificationFill",
        name: "Notifications",
        link: "/notifications",
        tab: "tab-jobs-4",
        actived: true,
      },
      {
        icon: "RiUser3Line",
        iconFull: "RiUser3Fill",
        name: "Profil",
        link: "/profil/parent",
        tab: "tab5",
        actived: true,
      },
    ]),

    menuAdminTabs: reactive(<TABS>[
      {
        icon: "RiChat1Line",
        iconFull: "RiChat1Fill",
        name: "Messageries",
        link: "/admin/chats",
        tab: "tab_admin_chats",
        actived: true,
      },
      {
        icon: "RiPassValidLine",
        iconFull: "RiPassValidFill",
        name: "Doc. valides",
        link: "/admin/checked",
        tab: "tab_admin_checked",
        actived: true,
      },
      {
        icon: "RiUser3Line",
        iconFull: "RiUser3Fill",
        name: "Utilisateurs",
        link: "/admin/users",
        tab: "tab_admin_users",
        actived: true,
      },
      // {
      //   icon: "RiContractLine",
      //   iconFull: "RiContractFill",
      //   name: "Misions",
      //   link: "/admin/misions",
      //   tab: "tab_admin_misions",
      //   actived: true,
      // },
      // {
      //   icon: "RiSettingsLine",
      //   iconFull: "RiSettingsFill",
      //   name: "Parametres",
      //   link: "/admin/parametres",
      //   tab: "tab_admin_parametres",
      //   actived: true,
      // },
      
    ]),

    
  });

  return {
    state,
  };
};
