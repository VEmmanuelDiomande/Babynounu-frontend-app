// @ts-check
import { INPUT_ERROR } from '@/types/auth.types'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'


export const useNounuStore = defineStore('NOUNU', () => {
  const DataNounus = ref(<any>[])
  const DataHiddenNounus = ref(<any>[])
  const searchValueData = ref("")
  const loading = ref(false)
  return {
    DataNounus,
    searchValueData,
    DataHiddenNounus,
    loading
  }
})