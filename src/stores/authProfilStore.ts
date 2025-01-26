import { Preferences } from '@capacitor/preferences';
import router from "@/routes";
import { chidrenInfoProfilSchema } from "@/validations/auth/profils/childrenInfoProfil.valide";
import { infoPersonalParentProfilSchema } from "@/validations/auth/profils/InfoPersonalParentProfil.validate";
import {
  AutreParentProfilSchema,
  ChidrenInfoProfilSchema,
  LocalizationProfilSchema,
  PaymentTermsParentProfilSchema,
  PreferenceParentProfilSchema,
  PricingParentProfilSchema,
  ServicesSoughtParentProfilSchema,
} from "@/validations/auth/profils/profil.validate";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useParentHook } from '@/hooks/parentHooks/parent.hooks';

export const useProfilStore = defineStore("AuthProfilStore", () => {
 const state:any = reactive({
      stepProfil: 1,
      activeMenu_typeOfProfil: 'open-modal-auth-profil-nounu',
      InfoPersonalParentProfilValue: {
        fullName: "",
        emailAdress: "",
        phone: "",
        image_profil: ref<any>(null),
      },
      ChildrenInfoProfilValue: {
        numberOfChildren: "",
        agesOfChildrens: "",
        specificNeeds: "",
      },
      ServicesSoughtParentProfilValue: {
        childcares: "",
        housekeepers: "",
        frequencyOfServices: "",
        desiredTimes: "",
      },
      LocalizationProfilValue: {
        my_address: "",
        prestation_zone: "",
      },
      PricingParentProfilValue: {
        price_min: 0,
        price_max: 0,
      },
      PreferenceParentProfilValue: {
        specificSkills: "",
        languages: "",
        availabilityServiceProvider: "",
      },
      PaymentTermsParentProfilValue: {
        payment_terms: "",
      },
      AutreInfoParentProfilValue: {
        autre_infos: "",
      },
      in_error: {
        path: "",
        message: "",
      },
    });
  
    const VALIDATE = (data: any, Schema: any) => {
      const validate = Schema.safeParse(data);
      if (!validate.success) {
        state.in_error = {
          path: validate.error.issues[0].path[0].toString(),
          message: validate.error.issues[0].message,
        };
        return { err: true };
      }
      return { err: false };
    };

    const { createParentProfile } = useParentHook();
  
    const handleStepValidation = (key: string, schema: any, finalStep = false) => {
      const { err } = VALIDATE(state[key], schema);
      if (err) return "bonjour";
  
      if (finalStep) {
        createParentProfile();
      } else {
        state.stepProfil++;
      }
    };
  
    return {
      state,
      handleStepValidation,
      LessStepProfil: () => {
        if (state.stepProfil <= 1) state.stepProfil = 1;
        else state.stepProfil--;
      },
      InfoPersonalParentProfil: () =>
        handleStepValidation(
          "InfoPersonalParentProfilValue",
          infoPersonalParentProfilSchema
        ),
      ChildrenInfoParentProfil: () =>
        handleStepValidation("ChildrenInfoProfilValue", ChidrenInfoProfilSchema),
      ServicesSoughtParentProfil: () =>
        handleStepValidation(
          "ServicesSoughtParentProfilValue",
          ServicesSoughtParentProfilSchema
        ),
      LocalizationProfil: () =>
        handleStepValidation(
          "LocalizationProfilValue",
          LocalizationProfilSchema
        ),
      PricingParentProfil: () =>
        handleStepValidation(
          "PricingParentProfilValue",
          PricingParentProfilSchema
        ),
      PreferenceParentProfil: () =>
        handleStepValidation(
          "PreferenceParentProfilValue",
          PreferenceParentProfilSchema
        ),
      PaymentTermsParentProfil: () =>
        handleStepValidation(
          "PaymentTermsParentProfilValue",
          PaymentTermsParentProfilSchema
        ),
      AutreInfoParentProfil: () =>
        handleStepValidation(
          "AutreInfoParentProfilValue",
          AutreParentProfilSchema,
          true // Dernière étape
        ),
    };
  });
  

