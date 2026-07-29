import { apiClient } from '@/lib/api';
import { PaginatedResponse, PaginationParams } from '@/lib/api/types';
import { Nounu } from '../types';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';

export interface GetNounusParams extends PaginationParams {
  userId?: string;
  search?: string;
  city?: string;
  availability?: string;
  type?: 'nounu' | 'menagere' | 'cuisiniere' | 'parent' | 'all';
}

export const nounusApi = {
  getAll: async (params: GetNounusParams): Promise<PaginatedResponse<Nounu>> => {
    const queryParams = new URLSearchParams();

    if (params.userId) queryParams.append('userId', params.userId);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.city) queryParams.append('city', params.city);
    if (params.availability) queryParams.append('availability', params.availability);

    return apiClient.get(`${URL_API_ROUTE.NOUNU_ALL}?${queryParams.toString()}`);
  },

  getById: async (id: string): Promise<Nounu> => {
    return apiClient.get(`${URL_API_ROUTE.NOUNU_ALL}/${id}`);
  },

  search: async (params: GetNounusParams): Promise<PaginatedResponse<Nounu>> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    return apiClient.post(`${URL_API_ROUTE.NOUNU_SEARCH}?${queryParams.toString()}`, {
      fullname: params.search,
      userId: params.userId,
      type: params.type,
    });
  },

  create: async (data: Partial<Nounu>): Promise<Nounu> => {
    return apiClient.post(`${URL_API_ROUTE.NOUNU_CREATE}`, data);
  },

  update: async (id: string, data: Partial<Nounu>): Promise<Nounu> => {
    return apiClient.patch(`${URL_API_ROUTE.NOUNU_UPDATE}/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`${URL_API_ROUTE.NOUNU_DELETE}/${id}`);
  },
};
