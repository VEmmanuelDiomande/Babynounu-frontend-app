// @/api/subscription.ts
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
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

export const fetchSubscription = async (userId: any): Promise<Subscription> => {
  const response = await axios.get(`${URL_API_ROUTE.ABONNEMENT_USER}${userId}`);
  return response.data;
};

export const cancelSubscription = async (abonnementId:any): Promise<void> => {
  await axios.post(`${URL_API_ROUTE.ABONNEMENT_USER}${abonnementId}`);
};

export const changeSubscriptionPlan = async (plan: string): Promise<void> => {
  await axios.put("/api/subscription/plan", { plan });
};
