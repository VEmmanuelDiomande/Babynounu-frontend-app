import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';

export function useUploadMedia() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { file: File; typeMediaSlug?: string }) => {
      const nToken = await StorageUtils().getStore('nToken');
      const token = nToken?.value;
      if (!token) {
        router.push({ name: 'AUTH_SIGN_IN' });
        throw new Error('No token found');
      }
      const formData = new FormData();
      formData.append('file', data.file);
      if (data.typeMediaSlug) {
        formData.append('type', data.typeMediaSlug);
      }
      const response = await axios.post(`${URL_API_ROUTE.MEDIA_UPLOAD}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both parent and nounu profile keys
      queryClient.invalidateQueries({ queryKey: queryKeys.users.parentProfile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.nounuProfile() });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (mediaId: number) => {
      const nToken = await StorageUtils().getStore('nToken');
      const token = nToken?.value;
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.delete(`${URL_API_ROUTE.MEDIA_DELETE}/${mediaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate both parent and nounu profile keys
      queryClient.invalidateQueries({ queryKey: queryKeys.users.parentProfile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.nounuProfile() });
    },
  });
}
