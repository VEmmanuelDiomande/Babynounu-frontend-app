import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { ZodSchema } from "zod";
import { useNounuHook } from "@/hooks/nounuHooks/nounu.hooks"; // À créer
import {
  DisponibiliteGeographiqueSchema,
  DisponibilitesSchema,
  EvaluationEtAvisSchema,
  ExperienceEtCompetencesSchema,
  GalerySchema,
  GaleryUpdateSchema,
  InformationPersonnelleSchema,
  InformationPersonnelleUpdateSchema,
  PresentationDuPersonnelSchema,
  TarificationsSchema,
  VerificationEtReferencesSchema,
  VerificationEtReferencesUpdateSchema,
} from "@/validations/auth/profils/profilNounu.validate";
import { useAuthStore } from "./auth.store";

// Types ------------------------------------------------------------------------
interface NounuProfileState {
  StepProfil: number;
  InformationPersonnelle: {
    fullname: string;
    age: string;
    phone: string;
    address: any[];
    image_profil: FileList | null;
  };
  ExperienceEtCompetences: {
    annees_experience: string;
    tranche_age_enfants: any[];
    competance_specifique: any[];
    langue_parler: any[];
  };
  Disponibilites: {
    horaire_disponible: any[];
    urgences: any[];
  };
  Tarifications: {
    tarif_horaire: string;
    tarif_mensuel: string;
    flexibilite_tarifaire: any[];
  };
  VerificationEtReferences: {
    verification_confirmer: any[];
    references: CONTACT_REFERENCE[];
    certifications: any[];
  };
  PresentationDuPersonnel: {
    courte_biographie: string;
  };
  EvaluationEtAvis: {
    evaluation_precedentes: EVALUATION_PRECEDANTE[];
  };
  DisponibiliteGeographique: {
    zone_de_travail: any[];
  };
  Galery: {
    gallery: File[];
  };
  in_error: {
    path?: string;
    message?: string;
    errors?: Record<string, string>;
  };
}

interface EVALUATION_PRECEDANTE {
  nom: string;
  phone: string;
  note: string;
  commentaire: string;
}

interface CONTACT_REFERENCE {
  fullname: string;
  phone: string;
}

type ValidationStepKey = keyof Omit<
  NounuProfileState,
  "StepProfil" | "in_error"
>;

// Store ------------------------------------------------------------------------
export const useProfiNounulStore = defineStore("AuthProfilNounuStore", () => {
  const { createProfile } = useNounuHook(); // À implémenter
  const authStore = useAuthStore();

  // État réactif typé
  const GALLERY_PREVIEW = ref<any[]>([]);
  const IMAGE_PREVIEW = ref(<any>{});
  const state = reactive<NounuProfileState>({
    StepProfil: 1,
    InformationPersonnelle: {
      fullname: "",
      age: "",
      phone: "",
      address: [],
      image_profil: null,
    },
    ExperienceEtCompetences: {
      annees_experience: "",
      tranche_age_enfants: [],
      competance_specifique: [],
      langue_parler: [],
    },
    Disponibilites: {
      horaire_disponible: [],
      urgences: [],
    },
    Tarifications: {
      tarif_horaire: "",
      tarif_mensuel: "",
      flexibilite_tarifaire: [],
    },
    VerificationEtReferences: {
      verification_confirmer: [],
      references: [],
      certifications: [],
    },
    PresentationDuPersonnel: {
      courte_biographie: "",
    },
    EvaluationEtAvis: {
      evaluation_precedentes: [],
    },
    DisponibiliteGeographique: {
      zone_de_travail: [],
    },
    Galery: {
      gallery: [],
    },
    in_error: {
      path: "",
      message: "",
    },
  });

  // Validation générique
  const validateStep = (data: unknown, schema: ZodSchema) => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const firstError = result.error.issues[0];
      const errorsMap: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "_root";
        if (!errorsMap[key]) {
          errorsMap[key] = issue.message;
        }
      }
      state.in_error = {
        path: firstError.path.join("."),
        message: firstError.message,
        errors: errorsMap,
      };
      return false;
    }

    state.in_error = {};
    return true;
  };

  // Validation de toutes les étapes avant la finalisation
  const validateAllSteps = () => {
    const steps: { key: ValidationStepKey; schema: ZodSchema; step: number }[] = [
      {
        key: "InformationPersonnelle",
        schema: authStore.isUpdateProfil
          ? InformationPersonnelleUpdateSchema
          : InformationPersonnelleSchema,
        step: 1,
      },
      {
        key: "ExperienceEtCompetences",
        schema: ExperienceEtCompetencesSchema,
        step: 2,
      },
      { key: "Disponibilites", schema: DisponibilitesSchema, step: 3 },
      { key: "Tarifications", schema: TarificationsSchema, step: 4 },
      {
        key: "PresentationDuPersonnel",
        schema: PresentationDuPersonnelSchema,
        step: 5,
      },
      {
        key: "DisponibiliteGeographique",
        schema: DisponibiliteGeographiqueSchema,
        step: 6,
      },
      {
        key: "VerificationEtReferences",
        schema: authStore.isUpdateProfil
          ? VerificationEtReferencesUpdateSchema
          : VerificationEtReferencesSchema,
        step: 7,
      },
      {
        key: "Galery",
        schema: authStore.isUpdateProfil ? GaleryUpdateSchema : GalerySchema,
        step: 8,
      },
    ];

    for (const { key, schema, step } of steps) {
      if (!validateStep(state[key], schema)) {
        state.StepProfil = step;
        return false;
      }
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
      if (!validateAllSteps()) return;

      try {
        await createProfile();
      } catch (error) {
        state.in_error = {
          message: "Erreur lors de la création du profil",
          errors: { _root: "Erreur lors de la création du profil" },
        };
      }
    } else {
      state.StepProfil = Math.min(state.StepProfil + 1, 8);
    }
  };

  // Navigation entre les étapes
  const previousStep = () => {
    state.StepProfil = Math.max(state.StepProfil - 1, 1);
  };

  const DataEMERGENCIES = [
    {
      id: 1,
      name: "Oui, je suis disponible pour des missions urgentes.",
    },
    {
      id: 2,
      name: "Non, je ne suis pas disponible pour des missions urgentes.",
    },
  ];

  const DataFlexiblePrice = [
    {
      id: 1,
      name: "Oui, mes tarifs sont négociables",
    },
    {
      id: 2,
      name: "Non, mes tarifs ne sont pas négociables",
    },
  ];

  const ChangeInputToEdit = (Data: any) => {
    useAuthStore().setUpdateProfil(true, Data.id);
    state.InformationPersonnelle.address = Data.preferences.adress;
    state.InformationPersonnelle.fullname = Data.fullname;
    state.InformationPersonnelle.age = Data.age;
    state.InformationPersonnelle.phone = Data.phone;
    IMAGE_PREVIEW.value = Data.image;

    state.ExperienceEtCompetences.annees_experience = Data.annees_experience;
    state.ExperienceEtCompetences.tranche_age_enfants =
      Data.preferences.tranche_age_enfants;
    state.ExperienceEtCompetences.competance_specifique =
      Data.preferences.competance_specifique;
    state.ExperienceEtCompetences.langue_parler =
      Data.preferences.langue_parler;

    state.Disponibilites.horaire_disponible =
      Data.preferences.horaire_disponible;
    state.Disponibilites.urgences = DataEMERGENCIES.filter(
      (item) => item.id === (Data.urgences ? 1 : 2)
    );

    state.Tarifications.tarif_horaire = Data.tarif_horaire;
    state.Tarifications.tarif_mensuel = Data.tarif_mensuel;
    state.Tarifications.flexibilite_tarifaire = DataFlexiblePrice.filter(
      (item) => item.id === (Data.flexibilite_tarifaire ? 1 : 2)
    );

    state.VerificationEtReferences.verification_confirmer =
      Data.verification_confirmer || [];
    state.VerificationEtReferences.references = typeof Data.references === 'string'
      ? (() => { try { return JSON.parse(Data.references); } catch { return []; } })()
      : (Array.isArray(Data.references) ? Data.references : []);
    state.VerificationEtReferences.certifications =
      Data.preferences.certifications_criteres || [];

    state.PresentationDuPersonnel.courte_biographie = Data.courte_biographie || Data.courteBiographie || '';

    state.EvaluationEtAvis.evaluation_precedentes = typeof Data.evaluation_precedentes === 'string'
      ? (() => { try { return JSON.parse(Data.evaluation_precedentes); } catch { return []; } })()
      : (Array.isArray(Data.evaluation_precedentes) ? Data.evaluation_precedentes : []);

    state.DisponibiliteGeographique.zone_de_travail =
      Data.preferences.zone_de_travail;

    GALLERY_PREVIEW.value = Data.gallery;
  };

  return {
    state,
    previousStep,
    handleStepValidation,
    InfoPersonalNounuProfil: () =>
      handleStepValidation(
        "InformationPersonnelle",
        useAuthStore().isUpdateProfil
          ? InformationPersonnelleUpdateSchema
          : InformationPersonnelleSchema
      ),
    ExperienceEtCompetencesProfil: () =>
      handleStepValidation(
        "ExperienceEtCompetences",
        ExperienceEtCompetencesSchema
      ),
    DisponibilitesProfil: () =>
      handleStepValidation("Disponibilites", DisponibilitesSchema),
    TarificationsProfil: () =>
      handleStepValidation("Tarifications", TarificationsSchema),
    VerificationEtReferencesProfil: () =>
      handleStepValidation(
        "VerificationEtReferences",
        useAuthStore().isUpdateProfil
          ? VerificationEtReferencesUpdateSchema
          : VerificationEtReferencesSchema
      ),
    PresentationDuPersonnelProfil: () =>
      handleStepValidation(
        "PresentationDuPersonnel",
        PresentationDuPersonnelSchema
      ),
    DisponibiliteGeographiqueProfil: () =>
      handleStepValidation(
        "DisponibiliteGeographique",
        DisponibiliteGeographiqueSchema
      ),
    EvaluationEtAvisProfil: () =>
      handleStepValidation("EvaluationEtAvis", EvaluationEtAvisSchema),

    Galery: () =>
      handleStepValidation(
        "Galery",
        useAuthStore().isUpdateProfil ? GaleryUpdateSchema : GalerySchema,
        true
      ),
    ChangeInputToEdit,
    DataEMERGENCIES,
    DataFlexiblePrice,
    GALLERY_PREVIEW,
    IMAGE_PREVIEW,
  };
});
