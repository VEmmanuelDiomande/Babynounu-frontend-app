import { Preferences } from "@capacitor/preferences";
import router from "@/routes";
import { chidrenInfoProfilSchema } from "@/validations/auth/profils/childrenInfoProfil.valide";
import { infoPersonalParentProfilSchema } from "@/validations/auth/profils/InfoPersonalParentProfil.validate";
import {
  ChidrenInfoProfilSchema,
  LocalizationProfilSchema,
  PreferenceParentProfilSchema,
  PricingParentProfilSchema,
  ServicesSoughtParentProfilSchema,
} from "@/validations/auth/profils/profil.validate";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useProfilStore } from "./authProfilStore";
import {
  AreaWorkProfilSchema,
  AvailabeProfilSchema,
  BiographieProfilSchema,
  ExperienceAndSkillProfilSchema,
  GaleryProfilSchema,
  InfoPersonalProfilSchema,
  PricingProfilSchema,
  VerificationProfilSchema,
} from "@/validations/auth/profils/profilNounu.validate";
import { useNounuHook } from "@/hooks/nounuHooks/nounu.hooks";
import { StorageUtils } from "@/utils/store.utils";

export const useProfiNounulStore = defineStore("AuthProfilNounuStore", () => {
  const state = reactive({
    StepProfil: 1,
    InfoPersonalValue: {
      fullName: "",
      age: "",
      phone: "",
      address: "",
      image_profil: ref<any>(null),
    },
    ExperienceAndSkillValue: {
      yearsOfExperience: "",
      ageGroupOfChildren: "",
      specificSkills: "",
      languages: ""
    },
    AvailabeValue: {
      schedulesAvailable: "",
      emergencie: "",
    },
    PricingValue: {
      monthlyRate: "",
      hourlyRate: "",
      flexiblePrice: ""
    },
    VerificationValue: {
      verificationOfConfirmed: "",
      refrence_1: "",
      refrence_2: "",
      reference_3: "",
      certifications: ""
    },
    BiographieValue: {
      text: ""
    },
    AreaWorkValue: {
      areaWork: "",
    },
    GaleryValue: {
      gallery: ref<any>([]) as unknown as Array<File>
    },
    in_error: {
      path: '',
      message: ''
    }
  });


  const { createProfile } = useNounuHook();

  const VALIDATE = (data: any, Schema: any) => {
    const validate = Schema.safeParse(data);
    console.log(validate)
    if (!validate.success) {
      state.in_error = {
        path: validate.error.issues[0].path[0].toString(),
        message: validate.error.issues[0].message,
      };
      return { err: true };
    }
    return { err: false };
  };
  const LessStepProfil = () => {
    if (state.StepProfil <= 1) return (state.StepProfil = 1);
    return (state.StepProfil = state.StepProfil - 1);
  }

  /**
   * @function InfoPersonal - fonction qui permet de valider les informations personnelles d'un nounou
   * @returns {void}
   */
  const InfoPersonal = () => {
    const { err } = VALIDATE(state.InfoPersonalValue, InfoPersonalProfilSchema);
    if (err) return;
    state.StepProfil += 1;
  };

  /**
   * @function ExperienceAndSkill - fonction qui permet de valider les experiences et competences d'un nounou
   * @returns {void}
   */
  const ExperienceAndSkill = () => {
    const { err } = VALIDATE(
      state.ExperienceAndSkillValue,
      ExperienceAndSkillProfilSchema
    );
    if (err) return;
    state.StepProfil += 1;
  };

  /**
   * @function Availabe - fonction qui permet de valider la disponibilite d'un nounou
   * @returns {void}
   */
  const Availabe = () => {
    const { err } = VALIDATE(state.AvailabeValue, AvailabeProfilSchema);
    if (err) return;
    state.StepProfil += 1;
  };

  /**
   * @function Pricing - fonction qui permet de valider les tarifs d'un nounou
   * @returns {void}
   */
  const Pricing = () => {
    const { err } = VALIDATE(state.PricingValue, PricingProfilSchema);
    if (err) return;
    state.StepProfil += 1;
  };

  /**
   * @function Verification - fonction qui permet de valider les informations de verification d'un nounou
   * @returns {void}
   */
  const Verification = () => {
    const { err } = VALIDATE(state.VerificationValue, VerificationProfilSchema);
    if (err) return;
    state.StepProfil += 1;
  };


  /**
   * @function Biographie - fonction qui permet de valider les informations de verification d'un nounou
   * @returns {void}
   */
  const Biographie = () => {
    const { err } = VALIDATE(state.BiographieValue, BiographieProfilSchema);
    if (err) return;
    state.StepProfil += 1;
  };

  /**
   * @function AreaWork - fonction qui permet de valider les zones de travail d'un nounou
   * @returns {void}
   */
  const AreaWork = () => {
    const { err } = VALIDATE(state.AreaWorkValue, AreaWorkProfilSchema);
    if (err) return;
    state.StepProfil += 1;
    
  };

  const Galery = () => {
    const { err } = VALIDATE(state.GaleryValue, GaleryProfilSchema);
    if (err) return;
    createProfile()
  };

  return {
    state,
    LessStepProfil,
    InfoPersonal,
    ExperienceAndSkill,
    Availabe,
    Pricing,
    Verification,
    Biographie,
    AreaWork,
    Galery
  };
});
