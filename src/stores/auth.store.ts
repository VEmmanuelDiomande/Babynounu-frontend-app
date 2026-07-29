import { INPUT_ERROR, SIGN_UP } from '@/types/auth.types'
import { StorageUtils } from '@/utils/store.utils'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLogged: false,
    isUpdateProfil: false,
    toRole: null as string | null,
    isUpdateProfilID: null as string | null,
    isUpdateProfilType: 'nounu' as string,
    errors: {
      general: {
        path: '',
        message: ''
      } as INPUT_ERROR,
      login: {
        path: '',
        message: ''
      } as INPUT_ERROR
    },
    email: '',
    registration: {
      email: '',
      password: '',
      type: ''
    } as SIGN_UP
  }),

  getters: {
    hasErrors: (state) => {
      return state.errors.general.message !== '' || state.errors.login.message !== ''
    },
    isAuthenticated: (state) => state.isLogged,
    userRole: (state) => state.toRole
  },

  actions: {
    async getRole() {
      try {
        const role = await StorageUtils().getStore('nRole')
        this.toRole = role.value
        return this.toRole
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle:', error)
        return null
      }
    },

    setLoginStatus(status: boolean) {
      this.isLogged = status
    },

    setUpdateProfil(status: boolean, id?: string | null, type?: string) {
      this.isUpdateProfil = status
      if (id !== undefined) this.isUpdateProfilID = id
      if (type) this.isUpdateProfilType = type
    },

    setError(type: 'general' | 'login', error: INPUT_ERROR) {
      this.errors[type] = { ...error }
    },

    clearErrors() {
      this.errors.general = { path: '', message: '' }
      this.errors.login = { path: '', message: '' }
    },

    setEmail(email: string) {
      this.email = email
    },

    setRegistration(registration: Partial<SIGN_UP>) {
      this.registration = { ...this.registration, ...registration }
    },

    resetStore() {
      this.isLogged = false
      this.isUpdateProfil = false
      this.toRole = null
      this.isUpdateProfilID = null
      this.isUpdateProfilType = 'nounu'
      this.clearErrors()
      this.email = ''
      this.registration = { email: '', password: '', type: '', role: '' }
    }
  }
})