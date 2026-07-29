import ApiClient from './client';
import { BASE_URL_CENTER } from '@/routes/_requests/index.request';

const apiClient = new ApiClient(BASE_URL_CENTER);

export { apiClient };
export * from './types';
