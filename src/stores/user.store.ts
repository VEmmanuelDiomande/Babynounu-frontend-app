// @ts-check
import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useUserStore = defineStore('USER', () => {
  const isLogged = ref(false)

  return {
    isLogged
  }
})