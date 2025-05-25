import { reactive, computed } from "vue";
import { TABS } from "../../types/menu.types";

/**
 * Hook pour gérer les onglets de navigation dans l'application
 * @returns Un objet contenant l'état et les méthodes pour manipuler les onglets
 */
export const useTabHook = () => {
  // Définition des onglets pour les utilisateurs standards (nounus)
  const menuTabs = [
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
  ];

  // Définition des onglets pour les utilisateurs cherchant des emplois
  const menuJobTabs = [
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
      link: "/profil/nounu",
      tab: "tab-jobs-5", // Correction: tab5 -> tab-jobs-5 pour cohérence
      actived: true,
    },
  ];

  // Définition des onglets pour les administrateurs
  const menuAdminTabs = [
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
    {
      icon: "RiContractLine",
      iconFull: "RiContractFill",
      name: "Contrats",
      link: "/admin/contracts",
      tab: "tab_admin_misions", // Erreur de frappe: misions -> missions
      actived: true,
    },
    {
      icon: "RiLogoutBoxRLine",
      iconFull: "RiLogoutBoxRFill",
      name: "Logout",
      link: "/admin/logout",
      tab: "tab_admin_logout",
      actived: true,
    },
  ];

  // État réactif contenant tous les menus - Correction: éviter double reactive
  const state = reactive({
    menuTabs,
    menuJobTabs,
    menuAdminTabs,
  });

  // Computed properties pour les onglets actifs - Définies une seule fois
  const activeMenuTabs = computed(() => state.menuTabs.filter(tab => tab.actived));
  const activeMenuJobTabs = computed(() => state.menuJobTabs.filter(tab => tab.actived));
  const activeMenuAdminTabs = computed(() => state.menuAdminTabs.filter(tab => tab.actived));

  /**
   * Obtient les onglets actifs pour un type de menu spécifique
   * @param menuType Type de menu ('default', 'job', 'admin')
   * @returns Les onglets actifs pour le type de menu spécifié
   */
  const getActiveTabs = (menuType: 'default' | 'job' | 'admin') => {
    switch (menuType) {
      case 'job':
        return activeMenuJobTabs.value;
      case 'admin':
        return activeMenuAdminTabs.value;
      default:
        return activeMenuTabs.value;
    }
  };

  /**
   * Définit l'état actif d'un onglet
   * @param tabId Identifiant de l'onglet
   * @param isActive État actif à définir
   * @param menuType Type de menu ('default', 'job', 'admin')
   */
  const setTabActive = (tabId: string, isActive: boolean, menuType: 'default' | 'job' | 'admin' = 'default') => {
    let targetMenu;
    
    switch (menuType) {
      case 'job':
        targetMenu = state.menuJobTabs;
        break;
      case 'admin':
        targetMenu = state.menuAdminTabs;
        break;
      default:
        targetMenu = state.menuTabs;
    }
    
    const tabIndex = targetMenu.findIndex(tab => tab.tab === tabId);
    if (tabIndex !== -1) {
      targetMenu[tabIndex].actived = isActive;
    }
  };

  // Ajouter ces fonctions avant le return
  /**
   * Configure les onglets pour les utilisateurs nounus
   * @param tabs Tableau d'onglets à configurer
   */
  const configureNounuTabs = (tabs:any) => {
    // Modifier les liens pour les nounus
    if (tabs.length >= 2) {
      tabs[0].link = "/home/nounus";
      tabs[0].tab = "tab1";
      tabs[1].link = "/search/nounus";
      tabs[1].tab = "tab2";
    }
    
    // Supprimer l'élément à l'index 2 si nécessaire (pour les nounus)
    if (tabs.length === 5) {
      tabs.splice(2, 1);
    }
    
    // Configurer le lien du profil
    const profileIndex = tabs.findIndex((tab:any) => tab.name === "Profil");
    if (profileIndex !== -1) {
      tabs[profileIndex].link = `/profil/nounu`;
    }
  };

  /**
   * Configure les onglets pour les utilisateurs parents
   * @param tabs Tableau d'onglets à configurer
   */
  const configureParentTabs = (tabs:any) => {
    // Configurer le lien du profil
    const profileIndex = tabs.findIndex((tab:any) => tab.name === "Profil");
    if (profileIndex !== -1) {
      tabs[profileIndex].link = `/profil/parent`;
    }
  };

  return {
    state,
    getActiveTabs,
    setTabActive,
    configureNounuTabs,
    configureParentTabs,
    // Exposer les computed properties directement
    activeMenuTabs,
    activeMenuJobTabs,
    activeMenuAdminTabs
  };
};
