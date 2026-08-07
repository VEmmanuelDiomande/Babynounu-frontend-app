// @ts-check
import { URL_API_ROUTE } from '@/routes/_requests/index.request'
import axios from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'


export const useNounuStore = defineStore('NOUNU', () => {
  const DataNounus = ref(<any>[])
  const DataHiddenNounus = ref(<any>[])
  const searchValueData = ref("")
  const isLoading = ref(false)
  const isError = ref(false)
  const loadingJob = ref(false)
  const currentPage = ref(1)
  const hasNextPage = ref(false)
  const isLoadingMore = ref(false)

  const searchPreferences = reactive({
    adress: [],
    zone_de_travail: [],
    horaire_disponible: [],
    tranche_age_enfants: [],
    competance_specifique: [],
    langue_parler: [],  
  })


  const searchNounu = async (searchValue: string, page: string = "1", limit: string = "25", append: boolean = false) => {
    if (append) {
      isLoadingMore.value = true;
    } else {
      useNounuStore().DataNounus = [];
      isLoading.value = true;
    }
    try {

      const preferencesIds = () => {
        return Object.fromEntries(
          Object.entries(searchPreferences).map(([key, value]) => [
            key,
            value.map((item: { id: number }) => item.id),
          ])
        );
      };

      const { data } = await axios.post(URL_API_ROUTE.NOUNU_SEARCH+`?page=${page}&limit=${limit}`, {
        fullname: searchValue,
        adress: preferencesIds().adress,
        zone_de_travail: preferencesIds().zone_de_travail,
        horaire_disponible: preferencesIds().horaire_disponible,
        tranche_age_enfants: preferencesIds().tranche_age_enfants,
        competance_specifique: preferencesIds().competance_specifique,
        langue_parler: preferencesIds().langue_parler
      });

      // Backend retourne { success, data: { data: [...], pagination } } via TransformInterceptor
      const payload = data?.data?.data || data?.data || data;
      const pagination = data?.data?.pagination || data?.pagination;

      if (Array.isArray(payload)) {
        if (append) {
          const seen = new Set(useNounuStore().DataNounus.map((n: any) => n.id));
          const deduped = payload.filter((n: any) => !seen.has(n.id));
          useNounuStore().DataNounus = [...useNounuStore().DataNounus, ...deduped];
        } else {
          useNounuStore().DataNounus = payload;
          document.getElementById("closeModelAuthProfil")?.click()
        }
        currentPage.value = parseInt(page);
        hasNextPage.value = pagination?.hasNextPage ?? false;
        isLoading.value = false
        isLoadingMore.value = false
      }
    } catch (error) {
      isError.value = true
      console.error("Erreur lors de la recherche de nounou:", error);
    } finally {
      isLoading.value = false
      isLoadingMore.value = false
    }
  };


  return {
    DataNounus,
    searchValueData,
    DataHiddenNounus,
    isLoading,
    isError,
    loadingJob,
    currentPage,
    hasNextPage,
    isLoadingMore,
    searchNounu,
    searchPreferences
  }
})