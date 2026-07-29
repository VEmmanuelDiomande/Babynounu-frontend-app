import { useMutation } from '@tanstack/vue-query';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';

export function useSearchNounu() {
  return useMutation({
    mutationFn: async (data: {
      searchValue: string;
      page?: string;
      limit?: string;
      preferences: {
        adress: any[];
        zone_de_travail: any[];
        horaire_disponible: any[];
        tranche_age_enfants: any[];
        competance_specifique: any[];
        langue_parler: any[];
      };
    }) => {
      const preferencesIds = () => {
        return Object.fromEntries(
          Object.entries(data.preferences).map(([key, value]) => [
            key,
            value.map((item: { id: number }) => item.id),
          ])
        );
      };

      const page = data.page || '1';
      const limit = data.limit || '25';

      const response = await axios.post(`${URL_API_ROUTE.NOUNU_SEARCH}?page=${page}&limit=${limit}`, {
        fullname: data.searchValue,
        adress: preferencesIds().adress,
        zone_de_travail: preferencesIds().zone_de_travail,
        horaire_disponible: preferencesIds().horaire_disponible,
        tranche_age_enfants: preferencesIds().tranche_age_enfants,
        competance_specifique: preferencesIds().competance_specifique,
        langue_parler: preferencesIds().langue_parler
      });
      return response.data;
    },
  });
}
