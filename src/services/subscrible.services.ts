// @/api/subscription.ts
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import { unwrap } from "@/utils/helpers.utils";
import axios from "axios";

interface Subscription {
  planName: string;
  description: string;
  status: string;
  renewalDate: string;
  price: string;
  paiement: {
    paymentMethod: string;
    payment_date: null,
    amount: number,
    currency: string,
    status: string,
  }
}

export const fetchSubscription = async (): Promise<Subscription> => {
  const headers = await getAuthHeaders();
  const response = await axios.get(URL_API_ROUTE.ABONNEMENT_USER, { headers });
  return unwrap(response.data);
};

export const cancelSubscription = async (abonnementId:any): Promise<void> => {
  const headers = await getAuthHeaders();
  await axios.post(`${URL_API_ROUTE.ABONNEMENT_ID}${abonnementId}`, {}, { headers });
};

export const changeSubscriptionPlan = async (plan: string): Promise<void> => {
  await axios.put("/api/subscription/plan", { plan });
};

export const fetchActivePacks = async (): Promise<any[]> => {
  const response = await axios.get(URL_API_ROUTE.PACKS_ACTIVE);
  const data = unwrap(response.data);
  return Array.isArray(data) ? data : (data?.data ?? []);
};

const getAuthHeaders = async () => {
  const nToken = await StorageUtils().getStore("nToken");
  const token = nToken?.value;
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
};

export const initiatePayment = async (data: {
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
}): Promise<{
  paymentId: string;
  transactionId: string;
  paymentUrl: string;
  status: string;
  amount: number;
  currency: string;
}> => {
  const headers = await getAuthHeaders();
  const response = await axios.post(URL_API_ROUTE.PAYMENTS_INITIATE, data, { headers });
  return unwrap(response.data);
};

export const verifyPayment = async (transactionId: string): Promise<{
  paymentId: string;
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
}> => {
  const headers = await getAuthHeaders();
  const response = await axios.post(URL_API_ROUTE.PAYMENTS_VERIFY, { transactionId }, { headers });
  return unwrap(response.data);
};

export const getPaymentStatus = async (transactionId: string): Promise<any> => {
  const response = await axios.get(`${URL_API_ROUTE.PAYMENTS_STATUS}/${transactionId}`);
  return unwrap(response.data);
};

export const subscribeToPack = async (data: { paymentId: string; packId?: number; typeId?: number; durationDays?: number }): Promise<any> => {
  const headers = await getAuthHeaders();
  const response = await axios.post(URL_API_ROUTE.SUBSCRIBE, data, { headers });
  return unwrap(response.data);
};
