// @ts-check
import { INPUT_ERROR, SIGN_UP } from '@/types/auth.types'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'


export const useAuthStore = defineStore('AUTH', () => {
  const isLogged = ref(false)
  const isUpdateProfil = ref(false)
  const isUpdateProfilID = ref(null)
  const isUpdateProfilType = ref('nounu')
  const state = reactive({
    in_error: reactive(<INPUT_ERROR>{
        path: "",
        message: "",
      }),
      in_error_login: reactive(<INPUT_ERROR>{
        path: "",
        message: "",
      }),
      email: ref(""),
      in_register: reactive(<SIGN_UP>{
        email: "",  
        password: "",
        type: "",
      })
  })
  return {
    isLogged,
    isUpdateProfil,
    state,
    
  }
})