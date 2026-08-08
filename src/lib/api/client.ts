import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { StorageUtils } from '@/utils/store.utils';

class ApiClient {
  private instance: AxiosInstance;
  private storageUtils = StorageUtils();

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await this.storageUtils.getStore('nToken');
        if (token?.value) {
          config.headers.Authorization = `Bearer ${token.value}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.storageUtils.removeStore('nToken');
        }
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers?.['retry-after'];
          const delaySec = retryAfter ? parseInt(retryAfter, 10) : 5;
          const originalRequest = error.config;
          if (originalRequest && !originalRequest._throttledRetry) {
            originalRequest._throttledRetry = true;
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(this.instance(originalRequest));
              }, delaySec * 1000);
            });
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }
}

export default ApiClient;
