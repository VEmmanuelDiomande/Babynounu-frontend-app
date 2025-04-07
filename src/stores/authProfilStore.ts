import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { ZodSchema } from "zod";
import {
  ServicesRecherchesSchema,
  LocalizationsSchema,
  TarificationsSchema,
  PreferencePourLesSpecifiquesSchema,
  ModalitesDePaiementSchema,
  AutreInformationsSchema,
  InformationPersonnelleSchema,
  InformationSurLesEnfantsSchema,
} from "../validations/auth/profils/profil.validate";
import { useParentHook } from "@/hooks/parentHooks/parent.hooks";
import { useAuthStore } from "./auth.store";
import { useProfiNounulStore } from "./authProfilNounuStore";

// Types ------------------------------------------------------------------------
interface ProfileState {
  stepProfil: number;
  activeMenu_typeOfProfil: string;
  image_profil_preview: string | null;
  InformationPersonnelle: {
    image_profil: FileList | null;
    fullname: string;
    adresse_mail: string;
    phone: string;
  };
  InformationSurLesEnfants: {
    number_of_children: string;
    besions_specifiques: string[];
  };
  ServicesRecherches: {
    garde_enfants: string[];
    aide_menagere: string[];
    frequence_des_services: string[];
    horaire_souhaites: string[];
  };
  Localizations: {
    adress: string[];
    zone_geographique_prestataire: string[];
  };
  Tarifications: {
    budget_estimated: string;
  };
  PreferencePourLesSpecifiques: {
    competance_specifique: string[];
    langue_parler: string[];
    disponibility_du_prestataire: string[];
  };
  ModalitesDePaiement: {
    mode_de_paiement: string[];
  };
  AutreInformations: {
    informations_complementaires: string;
  };
  in_error: {
    path?: string;
    message?: string;
  };
}

type ValidationStepKey = keyof Omit<
  ProfileState,
  "stepProfil" | "activeMenu_typeOfProfil" | "image_profil_preview" | "in_error"
>;

// Store ------------------------------------------------------------------------
export const useProfilStore = defineStore("AuthProfilStore", () => {
  const { createParentProfile } = useParentHook();

  // État réactif typé
  const state = reactive<ProfileState>({
    stepProfil: 1,
    activeMenu_typeOfProfil: "open-modal-auth-profil-nounu",
    image_profil_preview: null,
    InformationPersonnelle: {
      image_profil: null,
      fullname: "",
      adresse_mail: "",
      phone: "",
    },
    InformationSurLesEnfants: {
      number_of_children: "",
      besions_specifiques: [],
    },
    ServicesRecherches: {
      garde_enfants: [],
      aide_menagere: [],
      frequence_des_services: [],
      horaire_souhaites: [],
    },
    Localizations: {
      adress: [],
      zone_geographique_prestataire: [],
    },
    Tarifications: {
      budget_estimated: "",
    },
    PreferencePourLesSpecifiques: {
      competance_specifique: [],
      langue_parler: [],
      disponibility_du_prestataire: [],
    },
    ModalitesDePaiement: {
      mode_de_paiement: [],
    },
    AutreInformations: {
      informations_complementaires: "",
    },
    in_error: {},
  });

  // Validation générique
  const validateStep = (data: unknown, schema: ZodSchema) => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const firstError = result.error.issues[0];
      state.in_error = {
        path: firstError.path.join("."),
        message: firstError.message,
      };
      return false;
    }

    state.in_error = {};
    return true;
  };

  // Gestion des étapes
  const handleStepValidation = async (
    key: ValidationStepKey,
    schema: ZodSchema,
    isFinalStep = false
  ) => {
    if (!validateStep(state[key], schema)) return;

    if (isFinalStep) {
      try {
        await createParentProfile();
      } catch (error) {
        state.in_error = {
          message: "Erreur lors de la création du profil",
        };
      }
    } else {
      state.stepProfil = Math.min(state.stepProfil + 1, 8);
    }
  };

  // Navigation entre les étapes
  const previousStep = () => {
    state.stepProfil = Math.max(state.stepProfil - 1, 1);
  };

  const ChangeInputToEdit = (Data: any) => {
    useAuthStore().isUpdateProfilID = Data.id;
    state.InformationPersonnelle.fullname = Data.fullname;
    state.InformationPersonnelle.adresse_mail = Data.adresse_mail;
    state.InformationPersonnelle.phone = Data.phone;
    useProfiNounulStore().IMAGE_PREVIEW = Data.image

    state.InformationSurLesEnfants.number_of_children = Data.number_of_children;
    state.InformationSurLesEnfants.besions_specifiques =
      Data?.preferences?.besions_specifiques;

    state.ServicesRecherches.garde_enfants = Data?.preferences?.garde_enfants;
    state.ServicesRecherches.aide_menagere = Data?.preferences?.aide_menagere;
    state.ServicesRecherches.frequence_des_services =
      Data?.preferences?.frequence_des_services;
    state.ServicesRecherches.horaire_souhaites =
      Data?.preferences?.horaire_souhaites;

    state.Localizations.adress = Data?.preferences?.adress;
    state.Localizations.zone_geographique_prestataire =
      Data?.preferences?.zone_geographique_prestataire;

    state.Tarifications.budget_estimated = Data?.budget_estimated;

    state.PreferencePourLesSpecifiques.competance_specifique =
      Data?.preferences?.competance_specifique;
    state.PreferencePourLesSpecifiques.langue_parler =
      Data?.preferences?.langue_parler;
    state.PreferencePourLesSpecifiques.disponibility_du_prestataire =
      Data?.preferences?.disponibility_du_prestataire;

    state.ModalitesDePaiement.mode_de_paiement =
      Data?.preferences?.mode_de_paiement;

    state.AutreInformations.informations_complementaires =
      Data?.informations_complementaires;
  };

  return {
    state,
    ChangeInputToEdit,
    previousStep,
    handleStepValidation,
    InfoPersonalParentProfil: () =>
      handleStepValidation(
        "InformationPersonnelle",
        InformationPersonnelleSchema
      ),
    ChildrenInfoParentProfil: () =>
      handleStepValidation(
        "InformationSurLesEnfants",
        InformationSurLesEnfantsSchema
      ),
    ServicesSoughtParentProfil: () =>
      handleStepValidation("ServicesRecherches", ServicesRecherchesSchema),
    LocalizationProfil: () =>
      handleStepValidation("Localizations", LocalizationsSchema),
    PricingParentProfil: () =>
      handleStepValidation("Tarifications", TarificationsSchema),
    PreferenceParentProfil: () =>
      handleStepValidation(
        "PreferencePourLesSpecifiques",
        PreferencePourLesSpecifiquesSchema
      ),
    PaymentTermsParentProfil: () =>
      handleStepValidation("ModalitesDePaiement", ModalitesDePaiementSchema),
    AutreInfoParentProfil: () =>
      handleStepValidation("AutreInformations", AutreInformationsSchema, true),
  };
});
