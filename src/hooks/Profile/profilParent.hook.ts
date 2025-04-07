import { reactive, ref } from "vue";
import { INPUT_ERROR, SIGN_IN } from "@/types/auth.types";
import { signInSchema } from "@/validations/auth/signInAuth.validate";
import authService from "@/services/auth.services";
import { useAuthStore } from "@/stores/auth.store";
import { useProfilStore } from "@/stores/authProfilStore";
import { useAbonnementStore } from "@/stores/abonnementStore";
import { useRoute } from "vue-router";


export const useProfilParentHook = () => {
  const state = reactive({
    
  });


  const route = useRoute();
  const Greeting = ref("");

  const Experiences = ref([
    { name: "Contrats", count: 0, color: "bg-primary", icon: "RiServiceFill" },
    { name: "Visites", count: 0, color: "bg-secondary", icon: "RiEye2Fill" },
  ]);
  
  // Cards Information
  const cardData = (props:any) => {
    return [
        {
          data: props.PARENT?.preferences?.besions_specifiques,
          type: "besions_specifiques",
          title: "Les besions de mes enfants",
        },
        {
          data: [{ name: props.PARENT?.budget_estimated, type: "budget" }],
          type: "budget",
          title: "Budget estimé",
        },
        {
          data: [
            { name: props.PARENT?.number_of_children, type: "number_of_children" },
          ],
          type: "number_of_children",
          title: "Nombre d’enfants",
        },
        {
          data: props.PARENT?.preferences?.disponibility_du_prestataire,
          type: "disponibility_du_prestataire",
          title: "Disponibilités",
        },
        {
          data: props.PARENT?.preferences?.competance_specifique,
          type: "competance_specifique",
          title: "Compétences que je recherches",
        },
        {
          data: props.PARENT?.preferences?.langue_parler,
          type: "langue_parler",
          title: "Les langues que je parle",
        },
        {
          data: props.PARENT?.preferences?.frequence_des_services,
          type: "frequence_des_services",
          title: "Les types de contrats",
        },
      
        {
          data: props.PARENT?.preferences?.zone_geographique_prestataire,
          type: "area",
          title: "Zones d'intervention",
        },
        {
          data: props.PARENT?.preferences?.horaire_souhaites,
          type: "horaire_souhaites",
          title: "Heures préférées pour les enfants",
        },
        {
          data: props.PARENT?.preferences?.garde_enfants,
          type: "AgeOfChildrens",
          title: "Ages de mes enfants",
        },
        {
          data: props.PARENT?.preferences?.aide_menagere,
          type: "aide_menagere",
          title: "Infos sur les dames de ménage",
        },
      ]
  };
  


  return {
    state,
    Greeting,
    Experiences,
    cardData
  };
};
