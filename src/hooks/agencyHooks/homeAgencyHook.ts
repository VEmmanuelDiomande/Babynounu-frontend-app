import type {
} from "@/types/agency.types";
import { reactive } from "vue";

export const useHomeAgencyHook = () => {
  const state = reactive({
    OptionAgency: [
      {
        name: "Demander de livraison",
        desc: "Partager votre lien de commande de livraison à tous vos clients.",
        icon: "RiShareForwardLine",
        route: "/agency/partager",
      },
      {
        name: "Ajouter un livreur",
        desc: "Ajouter un livreur un nouveau à votre agence et agrandir votre activité.",
        icon: "RiAddLine",
        route: "/agency/recharger",
      },
      {
        name: "Appel de vérification",
        desc: "Lancez un appel de vérification pour vous assurer que vos livreurs ont bien effectué les livraisons auprès de vos clients.",
        icon: "RiCustomerService2Line",
        route: "/agency/recharger",
      },
    ],
    StatsAccordingToPeriods: [
      {
        name: "Aujourd'hui",
        peridos: "",
      },
      {
        name: "Hier",
        peridos: "",
      },
      {
        name: "7 jours",
        peridos: "",
      },
      {
        name: "30 jours",
        peridos: "",
      },
      {
        name: "cette année",
        peridos: "",
      },
    ],
    StatsAgency: [
        {
            icon: "RiCustomServiceLine",
            name: "Chiffre d'affaire",
            color: "from-teal-500 to-teal-300",
            count: '0.00 CFA',
          },
          {
            icon: "RiBox3Line",
            name: "(T) Commander",
            color: "from-primary to-blue-300",
            count: 0,
          },
      {
        icon: "RiSpaceShipLine",
        name: "(T) Livrer",
        color: "from-green-500 to-green-300",
        count: 0,
      },
      {
        icon: "RiSendPlaneLine",
        name: "(T) Affecter",
        color: "from-yellow-500 to-yellow-300",
        count: 0,
      },
      
      {
        icon: "RiDeleteBin3Line",
        name: "(T) Annuler",
        color: "from-red-500 to-red-300",
        count: 0,
      },
      
    ],
    ListOfActivites: [
        {
            date: "10/02/2022 - 10H:00",
            title: "1 Colis livre à Plateau - Cocody",
            status_type: 0,
            status: "En cours",
            price: "15.000 Fcfa",
            icon: "RiShareForwardLine",
        },
        {
            date: "25/02/2022 - 14H:32",
            title: "3 Colis livre à tréchville - koumassi",
            status_type: 1,
            status: "Livré",
            price: "15.000 Fcfa",
            icon: "RiShareForwardLine",
        },
        {
            date: "10/02/2022 - 16H:40",
            title: "8 Colis livre à tréchville - Bassam",
            status_type: 2,
            status: "Annuler",
            price: "15.000 Fcfa",
            icon: "RiShareForwardLine",
        },
        {
            date: "10/02/2022 - 11H:14",
            title: "1 Colis livre à tréchville - koumassi",
            status_type: 2,
            status: "Annuler",
            price: "15.000 Fcfa",
            icon: "RiShareForwardLine",
        },
        {
            date: "10/02/2022 - 09H:30",
            title: "2 Colis livre à Ayama - Blocose",
            status: "En cours",
            status_type: 0,
            price: "15.000 Fcfa",
            icon: "RiShareForwardLine",
        },
        {
            date: "10/02/2022 - 15H:12",
            title: "4 Colis livre à Port bouet - koumassi",
            status_type: 1,
            status: "Livré", 
            price: "15.000 Fcfa",
            icon: "RiShareForwardLine",
        },
        {
            date: "10/02/2022 - 15H:12",
            title: "4 Colis livre à Port bouet - koumassi",
            status_type: 3,
            status: "Affecter", 
            price: "15.000 Fcfa",
            icon: "RiShareForwardLine",
        }
    ]
  });

  return {
    state,
  };
};
