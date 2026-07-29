import { ref, reactive } from 'vue';
import axios from 'axios';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { StorageUtils } from '@/utils/store.utils';

export type LikeStatus = { liked: boolean; likeCount: number };

export function useLikes() {
  const likeMap = reactive<Record<string, LikeStatus>>({});
  const loading = ref(false);

  const getAuthToken = async (): Promise<string | null> => {
    try {
      const nToken = await StorageUtils().getStore('nToken');
      return nToken?.value || null;
    } catch {
      return null;
    }
  };

  const fetchBatchStatus = async (nounuIds: string[]) => {
    if (nounuIds.length === 0) return;
    const token = await getAuthToken();
    if (!token) return;

    try {
      const { data } = await axios.post(
        URL_API_ROUTE.LIKE_BATCH_STATUS,
        { nounuIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.data) {
        for (const [id, status] of Object.entries(data.data)) {
          likeMap[id] = status as LikeStatus;
        }
      }
    } catch {
      // silent fail — user might not be authenticated
    }
  };

  const fetchSingleStatus = async (nounuId: string) => {
    const token = await getAuthToken();
    if (!token) {
      try {
        const { data } = await axios.get(`${URL_API_ROUTE.LIKE_GET_BY_NOUNU}/${nounuId}`);
        likeMap[nounuId] = { liked: false, likeCount: data.likeCount || 0 };
      } catch {
        // silent
      }
      return;
    }

    try {
      const [countRes, mineRes] = await Promise.all([
        axios.get(`${URL_API_ROUTE.LIKE_GET_BY_NOUNU}/${nounuId}`),
        axios.get(`${URL_API_ROUTE.LIKE_GET_BY_NOUNU}/${nounuId}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      likeMap[nounuId] = {
        liked: mineRes.data.liked || false,
        likeCount: countRes.data.likeCount || 0,
      };
    } catch {
      // silent
    }
  };

  const toggleLike = async (nounuId: string): Promise<LikeStatus | null> => {
    const token = await getAuthToken();
    if (!token) return null;

    loading.value = true;
    try {
      const { data } = await axios.post(
        URL_API_ROUTE.LIKE_TOGGLE,
        { nounuId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      likeMap[nounuId] = { liked: data.liked, likeCount: data.likeCount };
      return likeMap[nounuId];
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return null;
      }
      return null;
    } finally {
      loading.value = false;
    }
  };

  const isLiked = (nounuId: string): boolean => {
    return likeMap[nounuId]?.liked || false;
  };

  const getLikeCount = (nounuId: string): number => {
    return likeMap[nounuId]?.likeCount || 0;
  };

  return {
    likeMap,
    loading,
    fetchBatchStatus,
    fetchSingleStatus,
    toggleLike,
    isLiked,
    getLikeCount,
  };
}
