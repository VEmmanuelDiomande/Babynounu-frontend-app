import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { z, ZodSchema } from "zod";
import { useJobHook } from "@/hooks/jobHooks/job.hooks";
import { JobSchemas } from "@/validations/jobs/job.validate";

// Enums et types -----------------------------------------------------------------
export enum TypeContact {
  EMAIL = "Email",
  CHAT = "Chat via l'application",
}

export enum TypeService {
  NOUNOU = "Nounou",
  FEMME_DE_MENAGE = "Femme de ménage",
  AUTRE = "Autre",
}

export enum TypeDuree {
  PONCTUELLE = "Ponctuelle",
  REGULIERE = "Régulière",
  LONG_TERME = "Long Terme",
}

// Interfaces -------------------------------------------------------------------
interface ErrorState {
  path?: string;
  message?: string;
}

interface JobStoreState {
  stepJob: number;
  in_error: ErrorState;
  loading: boolean; 
  informationsGenerales: {
    titre: string;
    description: string;
    adress: any[];
    zone_de_travail: any[];
    moyens_de_contact?: any[];
  };
  typeService: {
    type_services: any[];
    combinaison_service: any[];
    taches: any[];
  };
  detailsMission: {
    frequence_des_services: any[];
    horaire_souhaites: any[];
    inclus_weekend: any[];
  };
  nounou: {
    nombre_enfants?: string;
    garde_enfants?: any[];
    besions_specifiques?: any[];
    competance_specifique?: any[];
    langue_parler?: any[];
  };
  femmeDeMenage: {
    aide_menagere?: any[];
    equipement_menager?: any[];
  };
  criteres: {
    experience_minimun: any[];
    annee_experience: string;
    certifications: any[];
    criteres_selections: any[];
  };
  remuneration: {
    tarifPropose: string;
    negociable: any[];
  };
  dateDebut: {
    dateDebut: string;
    missionUrgente: any[];
  };
  autresInfos: {
    descriptionComplementaire: string;
    photoVideo?: any[];
  };
}

// Store --------------------------------------------------------------------------
export const useJobStore = defineStore("AuthJobStore", () => {
  const { createJob } = useJobHook();

  const isUpdateJob = ref(false);
  const isUpdateJobID = ref(null);

  const state = reactive<JobStoreState>({
    stepJob: 1,
    in_error: {},
    loading: false,
    informationsGenerales: {
      titre: "",
      description: "",
      adress: [],
      zone_de_travail: [],
      moyens_de_contact: [],
    },
    typeService: {
      type_services: [],
      combinaison_service: [],
      taches: [],
    },
    detailsMission: {
      frequence_des_services: [],
      horaire_souhaites: [],
      inclus_weekend: [],
    },
    nounou: {
      nombre_enfants: "",
      garde_enfants: [],
      besions_specifiques: [],
      competance_specifique: [],
      langue_parler: [],
    },
    femmeDeMenage: {
      aide_menagere: [],
      equipement_menager: [],
    },
    criteres: {
      experience_minimun: [],
      annee_experience: "",
      certifications: [],
      criteres_selections: [],
    },
    remuneration: {
      tarifPropose: "",
      negociable: [],
    },
    dateDebut: {
      dateDebut: "",
      missionUrgente: [],
    },
    autresInfos: {
      descriptionComplementaire: "",
      photoVideo: [],
    },
  });

  const DataMoyensContact = reactive([
    {
      name: "Email",
      value: "email",
    },
    {
      name: "Chat via l’application",
      value: "chat",
    },
    ]);   

  // Validation -------------------------------------------------------------------
  const validateStep = (data: unknown, schema: z.ZodSchema) => {
    const result = schema.safeParse(data);
    console.log(data, result);
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

  type ValidationStepKey = keyof Omit<
    JobStoreState,
    | "stepProfil"
    | "activeMenu_typeOfProfil"
    | "image_profil_preview"
    | "in_error"
  >;

  // Gestion des étapes ----------------------------------------------------------
  const handleStepValidation = async (
    key: ValidationStepKey,
    schema: ZodSchema,
    isFinalStep = false
  ) => {
    if (!validateStep(state[key], schema)) return;

    console.log(isFinalStep);
    if (isFinalStep) {
      try {
        await createJob();
      } catch (error) {
        state.in_error = {
          message: "Erreur lors de la création de l'offre",
        };
      }
    } else {
      console.log(
        state.typeService.type_services[0]?.slug,
        state.typeService.combinaison_service[0]?.value, state.stepJob
      );
      if (
        state.typeService.type_services[0]?.slug == "nounu-type" &&
        state.stepJob == 3 &&
        state.typeService.combinaison_service[0]?.value == false
      ) {
        state.stepJob = 6;
      } else if (
        state.typeService.type_services[0]?.slug == "menagere" &&
        state.stepJob == 2 &&
        state.typeService.combinaison_service[0]?.value == false
      ) {
        state.stepJob = 5;
      } else {
        state.stepJob = Math.min(state.stepJob + 1, 9);
      }
    }
  };

  const previousStep = () => {
    state.stepJob = Math.max(state.stepJob - 1, 1);
  };

  const DataCombinationServices = [
    {
      name: "Oui, je veux une combinaison des deux services",
      value: true,
      id: 1,
    },
    {
      name: "Non, je ne veux pas une combinaison des deux services",
      value: false,
      id: 2,
    },
  ]

  const DataExperienceMinimum = [
    { name: "Oui, la nounou/femme doit avoir une expérience minimale", value: true },
    { name: "Non, la nounou/femme ne doit pas avoir une expérience minimale", value: false },
  ]

  const DataNegociable = [
    { name: "Oui, mes tarif sont négociable ", value: true },
    { name: "Non, mes tarif sont négociable ", value: false },
  ]

  const DataUrgence = [
    { name: "Oui, ce post est très urgent ", value: true },
    { name: "Non, ce post n'est pas trop urgent", value: false },
  ];

  const ChangeInputToEdit = (Data: any) => {
    // state.activeMenu_typeOfProfil = "open-modal-auth-profil-edit";
    state.stepJob = 1;

    isUpdateJobID.value = Data.id;

    state.informationsGenerales.titre = Data.titre;
    state.informationsGenerales.description = Data.description;
    state.informationsGenerales.adress = Data.preferences.adress;
    state.informationsGenerales.zone_de_travail = Data.preferences.zone_de_travail;
    state.informationsGenerales.moyens_de_contact = DataMoyensContact.filter((item) => Data.moyens_de_contact == item.value);

    state.typeService.type_services = Data.preferences.type_services;
    state.typeService.combinaison_service = DataCombinationServices.filter((item) => item.value == Data.combinaison_service);
    state.typeService.taches = Data.preferences.taches;

    state.detailsMission.frequence_des_services = Data.preferences.frequence_des_services;
    state.detailsMission.horaire_souhaites = Data.preferences.horaire_souhaites;
    state.detailsMission.inclus_weekend = Data.inclus_weekend;

    state.nounou.nombre_enfants = Data.nombre_enfants;
    state.nounou.garde_enfants = Data.preferences.garde_enfants;
    state.nounou.besions_specifiques = Data.preferences.besions_specifiques;
    state.nounou.competance_specifique = Data.preferences.competance_specifique;
    state.nounou.langue_parler = Data.preferences.langue_parler;

    state.femmeDeMenage.aide_menagere = Data.preferences.aide_menagere;
    state.femmeDeMenage.equipement_menager = Data.preferences.equipement_menager;

    state.criteres.annee_experience = Data.annee_experience;
    state.criteres.experience_minimun =  DataExperienceMinimum.filter((item) => item.value == Data.experience_minimun);
    state.criteres.certifications = Data.preferences.certifications_criteres;
    state.criteres.criteres_selections = Data.preferences.criteres_selections;

    state.remuneration.negociable = DataNegociable.filter((item) => item.value == Data.negociable);
    state.remuneration.tarifPropose = Data.tarifPropose;

    state.dateDebut.dateDebut = Data.date_debut;
    state.dateDebut.missionUrgente = DataUrgence.filter((item) => item.value == Data.missionUrgente);

    state.autresInfos.descriptionComplementaire = Data.descriptionComplementaire;
    
  };

  return {
    state,
    previousStep,
    handleStepValidation,
    InfoGeneralJob: () =>
      handleStepValidation(
        "informationsGenerales",
        JobSchemas.InformationsGeneralesSchema
      ),
    TypeServiceJob: () =>
      handleStepValidation("typeService", JobSchemas.TypeServiceSchema),
    DetailsMissionJob: () =>
      handleStepValidation("detailsMission", JobSchemas.DetailsMissionSchema),
    NounouJob: () => handleStepValidation("nounou", JobSchemas.NounouSchema),
    FemmeDeMenageJob: () =>
      handleStepValidation("femmeDeMenage", JobSchemas.FemmeDeMenageSchema),
    CriteresJob: () =>
      handleStepValidation("criteres", JobSchemas.CriteresSchema),
    RemunerationJob: () =>
      handleStepValidation("remuneration", JobSchemas.RemunerationSchema),
    DateDebutJob: () =>
      handleStepValidation("dateDebut", JobSchemas.DateDebutSchema),
    AutresInfosJob: () =>
      handleStepValidation("autresInfos", JobSchemas.AutresInfosSchema, true),
    ChangeInputToEdit,
    DataMoyensContact,
    DataCombinationServices,
    DataExperienceMinimum,
    DataNegociable,
    DataUrgence,
    isUpdateJob,
    isUpdateJobID
  };
});
