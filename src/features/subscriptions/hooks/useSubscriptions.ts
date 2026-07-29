import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { StorageUtils } from '@/utils/store.utils';
import axios from 'axios';
import { queryKeys } from '@/lib/query/query-keys';

const getAuthHeaders = async () => {
  const nToken = await StorageUtils().getStore('nToken');
  const token = nToken?.value;
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
};

export function useSubscription(userId: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.status(userId),
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.ABONNEMENT_USER, { headers });
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useActivePacks() {
  return useQuery({
    queryKey: queryKeys.subscriptions.activePacks(),
    queryFn: async () => {
      const response = await axios.get(URL_API_ROUTE.PACKS_ACTIVE);
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (abonnementId: string) => {
      const headers = await getAuthHeaders();
      await axios.post(`${URL_API_ROUTE.ABONNEMENT_ID}${abonnementId}`, {}, { headers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.status() });
    },
  });
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: async (data: {
      amount: number;
      paymentMethod?: string;
      paymentType?: string;
      currency?: string;
      customerName?: string;
      customerSurname?: string;
      customerEmail?: string;
      customerPhoneNumber?: string;
      description?: string;
      packId?: number;
      returnUrl?: string;
    }) => {
      const headers = await getAuthHeaders();
      const response = await axios.post(URL_API_ROUTE.PAYMENTS_INITIATE, data, { headers });
      return response.data;
    },
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: async (transactionId: string) => {
      const headers = await getAuthHeaders();
      const response = await axios.post(URL_API_ROUTE.PAYMENTS_VERIFY, { transactionId }, { headers });
      return response.data;
    },
  });
}

export function usePaymentStatus(transactionId: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.paymentStatus(transactionId),
    queryFn: async () => {
      const response = await axios.get(`${URL_API_ROUTE.PAYMENTS_STATUS}/${transactionId}`);
      return response.data;
    },
    enabled: !!transactionId,
    refetchInterval: 3000,
    staleTime: 0,
  });
}

export function useSubscribeToPack() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { paymentId: string; packId?: number; typeId?: number; durationDays?: number }) => {
      const headers = await getAuthHeaders();
      const response = await axios.post(URL_API_ROUTE.SUBSCRIBE, data, { headers });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.status() });
    },
  });
}
