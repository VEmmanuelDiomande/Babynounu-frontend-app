import { reactive, ref } from "vue";
import { INPUT_ERROR, SIGN_IN } from "@/types/auth.types";
import { signInSchema } from "@/validations/auth/signInAuth.validate";
import authService from "@/services/auth.services";
import { useAuthStore } from "@/stores/auth.store";
import { useProfilStore } from "@/stores/authProfilStore";

export const useProfilNounuHook = () => {
  const state = reactive({});

  // States
  const Greeting = ref("");
  const Experiences = ref([
    { name: "Missons", count: 0, color: "bg-primary", icon: "RiServiceFill" },
    { name: "Visites", count: 0, color: "bg-secondary", icon: "RiEye2Fill" },
  ]);
  const Functionality = ref([
    { name: "Missions", icon: "RiServiceFill" },
    { name: "Visites", icon: "RiEye2Fill" },
    { name: "Alerte", icon: "RiAlarmWarningFill" },
    { name: "Récompenses", icon: "RiAwardFill" },
  ]);

  // Cards Information
  const cardData = (props: any) => {
    return [
      {
        data: props.DataNounu.preferences?.tranche_age_enfants,
        type: "tranche_age_enfants",
        title: "Ages encadrés",
      },
      {
        data: props.DataNounu.preferences?.competance_specifique,
        type: "competance_specifique",
        title: "Compétences",
      },
      {
        data: props.DataNounu.preferences?.langue_parler,
        type: "langue_parler",
        title: "Langues",
      },
      {
        data: props.DataNounu.preferences?.zone_de_travail,
        type: "zone_de_travail",
        title: "Zones d'intervention",
      },
      {
        data: props.DataNounu.preferences?.horaire_disponible,
        type: "horaire_disponible",
        title: "Heures préférées",
      },
      {
        data: props.DataNounu.preferences?.certifications_criteres,
        type: "certifications_criteres",
        title: "Certifications",
      }
    ];
  };

  return {
    state,
    Greeting,
    Experiences,
    Functionality,
    cardData,
  };
};
