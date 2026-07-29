import { useMutation } from '@tanstack/vue-query';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';

export function useSearchParent() {
  return useMutation({
    mutationFn: async (data: {
      searchValue: string;
      preferences: {
        besions_specifiques: any[];
        garde_enfants: any[];
        aide_menagere: any[];
        frequence_des_services: any[];
        horaire_souhaites: any[];
        zone_geographique_prestataire: any[];
        disponibility_du_prestataire: any[];
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

      const response = await axios.post(URL_API_ROUTE.PARENT_SEARCH, {
        fullname: data.searchValue,
        besions_specifiques: preferencesIds().besions_specifiques,
        garde_enfants: preferencesIds().garde_enfants,
        aide_menagere: preferencesIds().aide_menagere,
        frequence_des_services: preferencesIds().frequence_des_services,
        horaire_souhaites: preferencesIds().horaire_souhaites,
        zone_geographique_prestataire: preferencesIds().zone_geographique_prestataire,
        disponibility_du_prestataire: preferencesIds().disponibility_du_prestataire
      });
      return response.data;
    },
  });
}
