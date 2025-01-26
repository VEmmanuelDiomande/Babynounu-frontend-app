import { reactive } from "vue";
import { INPUT_ERROR, SIGN_VERIFY_CODE } from "@/types/auth.types";

export const useAuthSignVerifyCodeHook = () => {
  const state = reactive({
    in_verify_code: reactive(<SIGN_VERIFY_CODE>{
      email: "",
      code: ""
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
