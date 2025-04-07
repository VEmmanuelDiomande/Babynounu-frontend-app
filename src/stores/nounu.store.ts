// @ts-check
import { URL_API_ROUTE } from '@/routes/_requests/index.request'
import { INPUT_ERROR } from '@/types/auth.types'
import axios from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'


export const useNounuStore = defineStore('NOUNU', () => {
  const DataNounus = ref(<any>[])
  const DataHiddenNounus = ref(<any>[])
  const searchValueData = ref("")
  const isLoading = ref(false)
  const loadingJob = ref(false)

  const searchPreferences = reactive({
    adress: [],
    zone_de_travail: [],
    horaire_disponible: [],
    tranche_age_enfants: [],
    competance_specifique: [],
    langue_parler: [],  
  })


  const searchNounu = async (searchValue: string) => {
    useNounuStore().DataNounus = [];
    isLoading.value = true
    try {

      const preferencesIds = () => {
        return Object.fromEntries(
          Object.entries(searchPreferences).map(([key, value]) => [
            key,
            value.map((item: { id: number }) => item.id),
          ])
        );
      };

      const { data } = await axios.post(URL_API_ROUTE.NOUNU_SEARCH, {
        fullname: searchValue,
        adress: preferencesIds().adress,
        zone_de_travail: preferencesIds().zone_de_travail,
        horaire_disponible: preferencesIds().horaire_disponible,
        tranche_age_enfants: preferencesIds().tranche_age_enfants,
        competance_specifique: preferencesIds().competance_specifique,
        langue_parler: preferencesIds().langue_parler
      });

      if(data) {
        isLoading.value = false
        useNounuStore().DataNounus = data;
      }
    } catch (error) {
      isLoading.value = false
      console.error("Erreur lors de la recherche de nounou:", error);
    }
  };


  return {
    DataNounus,
    searchValueData,
    DataHiddenNounus,
    isLoading,
    loadingJob,
    searchNounu,
    searchPreferences
  }
})