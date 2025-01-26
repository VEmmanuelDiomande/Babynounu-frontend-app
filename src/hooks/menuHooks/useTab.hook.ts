import { reactive } from "vue";
import { TABS } from "../../types/menu.types";

export const useTabHook = () => {
 
  const state = reactive({
  
    menuHomeTabs: reactive(<TABS>[
      {
        icon: "RiHomeLine",
        iconFull: "RiHomeFill",
        name: "Accueil",
        link: "/home",
        tab: "tab1",
        actived: true,
      },
      {
        icon: "RiSearch2Line",
        iconFull: "RiSearch2Fill",
        name: "Rechercher",
        link: "/search",
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
          link: "/profil",
          tab: "tab5",
          actived: true,
        },
      
    ]),

    menuHomeNounuTabs: reactive(<TABS>[
      {
        icon: "RiHomeLine",
        iconFull: "RiHomeFill",
        name: "Accueil",
        link: "/home/nounu",
        tab: "tab-nounu-1",
        actived: true,
      },
      {
        icon: "RiSearch2Line",
        iconFull: "RiSearch2Fill",
        name: "Rechercher",
        link: "/search/nounu",
        tab: "tab-nounu-2",
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
          link: "/profil",
          tab: "tab5",
          actived: true,
        },
      
    ]),
  });

  return {
    state,
  };
};
