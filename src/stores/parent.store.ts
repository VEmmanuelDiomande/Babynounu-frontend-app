// @ts-check
import { URL_API_ROUTE } from '@/routes/_requests/index.request'
import { INPUT_ERROR } from '@/types/auth.types'
import axios from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'


export const useParentStore = defineStore('PARENTS', () => {
  const DataParents = ref(<any>[])
  const DataHiddenParents = ref(<any>[])
  const searchValueData = ref("")
  const isLoading = ref(false)
  const loadingJob = ref(false)
  const searchParentPreferences = reactive({
    besions_specifiques: [],
    garde_enfants: [],
    aide_menagere: [],
    frequence_des_services: [],
    horaire_souhaites: [],
    zone_geographique_prestataire: [],
    disponibility_du_prestataire: [],
  })

  const searchParent = async (searchValue: string) => {
    try {

      isLoading.value = true
      const preferencesIds = () => {
        return Object.fromEntries(
          Object.entries(searchParentPreferences).map(([key, value]) => [
            key,
            value.map((item: { id: number }) => item.id),
          ])
        );
      };

      console.log(preferencesIds());

      const { data } = await axios.post(URL_API_ROUTE.PARENT_SEARCH, {
        fullname: searchValue,
        besions_specifiques: preferencesIds().besions_specifiques,
        garde_enfants: preferencesIds().garde_enfants,
        aide_menagere: preferencesIds().aide_menagere,
        frequence_des_services: preferencesIds().frequence_des_services,
        horaire_souhaites: preferencesIds().horaire_souhaites,
        zone_geographique_prestataire: preferencesIds().zone_geographique_prestataire,
        disponibility_du_prestataire: preferencesIds().disponibility_du_prestataire
      });

      if(data) {
        isLoading.value = false
        useParentStore().DataParents = data;
      }
      
    } catch (error) {
      isLoading.value = false
      console.error("Erreur lors de la recherche de parent:", error);
    }
  };

  return {
    DataParents,
    searchValueData,
    DataHiddenParents,
    isLoading,
    loadingJob,
    searchParent,
    searchParentPreferences
  }
})