import { Preferences } from '@capacitor/preferences';
import router from "@/routes";
import {
    InfoGeneralJobSchema
} from "@/validations/jobs/job.validate";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useJobHook } from '@/hooks/jobHooks/job.hooks';

export const useJobStore = defineStore("AuthJobStore", () => {
 const state:any = reactive({
      stepJob: 1,
      activeMenu_typeOfJob: 'open-modal-auth-Job-nounu',
      InfoGeneralJobValue: {
        title: "",
        visibleAdress: "",
        meansOfContact: "",
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

    const { createJob } = useJobHook();
  
    const handleStepValidation = (key: string, schema: any, finalStep = false) => {
      const { err } = VALIDATE(state[key], schema);
      if (err) return "bonjour";
  
      if (finalStep) {
        createJob();
      } else {
        state.stepJob++;
      }
    };
  
    return {
      state,
      handleStepValidation,
      LessStepJob: () => {
        if (state.stepJob <= 1) state.stepJob = 1;
        else state.stepJob--;
      },
      InfoGeneralJob: () =>
        handleStepValidation(
          "InfoPersonalJobValue",
          InfoGeneralJobSchema
        ),
 
    };
  });
  

