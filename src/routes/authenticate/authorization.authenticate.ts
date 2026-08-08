import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';

const REFRESH_ENDPOINT = URL_API_ROUTE.AUTH_REFRESH;

let interceptorSetup = false;
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (token: string | null, error: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
};

const setupAxiosInterceptor = () => {
  if (interceptorSetup) return;
  interceptorSetup = true;

  axios.interceptors.request.use(
    async (config) => {
      const isRefreshRequest = config.url?.includes(REFRESH_ENDPOINT);
      if (!config.headers?.Authorization && !isRefreshRequest) {
        const nToken = await StorageUtils().getStore('nToken');
        const token = nToken?.value;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const isRefreshRequest = originalRequest?.url?.includes(REFRESH_ENDPOINT);

      if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const nRefreshToken = await StorageUtils().getStore('nRefreshToken');
          const refreshToken = nRefreshToken?.value;

          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const { data } = await axios.post(URL_API_ROUTE.AUTH_REFRESH, {
            refresh_token: refreshToken,
          });

          const newToken = data.user.access_token;
          const newRefreshToken = data.user.refresh_token;

          await StorageUtils().setStore('nToken', newToken);
          await StorageUtils().setStore('nRefreshToken', newRefreshToken);

          axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

          processQueue(newToken, null);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          processQueue(null, refreshError);

          await StorageUtils().removeStore('nToken');
          await StorageUtils().removeStore('nRefreshToken');
          await StorageUtils().removeStore('nUser_Id');
          await StorageUtils().removeStore('nRole');
          await StorageUtils().removeStore('nAdmin_Id');
          await StorageUtils().removeStore('nProfil_1_Id');

          if (window.location.pathname !== '/auth/sign-in') {
            window.location.href = '/auth/sign-in';
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (error.response?.status === 403) {
        const errorMessage = error.response.data?.message;
        if (errorMessage?.includes('abonnement actif')) {
          if (window.location.pathname !== '/subscription') {
            window.location.href = '/subscription';
          }
        }
      }

      if (error.response?.status === 429) {
        const retryAfter = error.response.headers?.['retry-after'];
        const delaySec = retryAfter ? parseInt(retryAfter, 10) : 5;
        if (!originalRequest._throttledRetry) {
          originalRequest._throttledRetry = true;
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(axios(originalRequest));
            }, delaySec * 1000);
          });
        }
      }

      return Promise.reject(error);
    }
  );
};

export const authentificateApp = async () => {
  setupAxiosInterceptor();

   // Verify is Token exist
   const nToken = await StorageUtils().getStore('nToken');
   const TOKEN = nToken.value ? nToken.value : null;

   if (TOKEN) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + TOKEN;
   }

   return {TOKEN}
};
