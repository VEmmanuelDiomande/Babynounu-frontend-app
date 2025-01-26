import { reactive } from "vue";
import { INPUT_ERROR, SIGN_VERIFY_EMAIL } from "@/types/auth.types";

export const useAuthSignVerifyEmailHook = () => {
  const state = reactive({
    in_verify_email: reactive(<SIGN_VERIFY_EMAIL>{
      email: "",
    }),
    in_error: reactive(<INPUT_ERROR>{
      path: "",
      message: ""
    }),
  });

  return {
    state,
  };
};
