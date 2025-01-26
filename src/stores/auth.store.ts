// @ts-check
import { INPUT_ERROR } from '@/types/auth.types'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'


export const useAuthStore = defineStore('AUTH', () => {
  const isLogged = ref(false)
  const state = reactive({
    in_error: reactive(<INPUT_ERROR>{
        path: "",
        message: "",
      }),
      in_error_login: reactive(<INPUT_ERROR>{
        path: "",
        message: "",
      }),
  })
  return {
    isLogged,
    state
  }
})