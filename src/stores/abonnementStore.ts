import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import { unwrap, isSubscriptionActive } from "@/utils/helpers.utils";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAbonnementStore = defineStore("Abonnement", () => {
  const isAbonnement = ref(false);
  const isExpired = ref(false);
  const isVerity = ref(false);
  const isLifetime = ref(false);
  const subscriptionFeatures = ref<string[]>([]);
  const subscriptionData = ref<any>(null);

  const myAbonnement = async () => {
    const nToken = await StorageUtils().getStore("nToken");
    const token = nToken?.value;
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    const { data: raw } = await axios.get(
      URL_API_ROUTE.ABONNEMENT_HAS_ACTIVE_SUBSCRIPTION,
      { headers }
    );

    // Unwrap TransformInterceptor response
    const data = unwrap(raw) as any;

    const hasActive = isSubscriptionActive(data);
    isAbonnement.value = hasActive;
    isLifetime.value = !!data && data.expiresAt === null;
    isExpired.value = !!data && data.status === 'active' && data.expiresAt !== null && new Date(data.expiresAt) <= new Date();
    subscriptionData.value = data || null;

    const packFeatures = data?.pack?.features;
    let featuresArr: string[] = [];
    if (Array.isArray(packFeatures)) {
      featuresArr = packFeatures as string[];
    } else if (typeof packFeatures === 'string') {
      try {
        const parsed = JSON.parse(packFeatures);
        featuresArr = Array.isArray(parsed) ? parsed : [];
      } catch { /* not JSON */ }
    } else if (Array.isArray(data?.features)) {
      featuresArr = data.features as string[];
    }
    subscriptionFeatures.value = featuresArr;

    await StorageUtils().setStore("nIsAbonnement", hasActive ? "true" : "false");

    return data;
  };

  const iscroll = (isOwner: boolean) => {
    if (isOwner == true && isAbonnement.value == true) {
      isVerity.value = true;
    } else if (isOwner == false && isAbonnement.value == true) {
      isVerity.value = true;
    } else if (isOwner == true && isAbonnement.value == false) {
      isVerity.value = true;
    } else if (isOwner == false && isAbonnement.value == false) {
      isVerity.value = false;
    } else {
      isVerity.value = false;
    }

    return isVerity.value;
  };

  const updateAbonnement = async () => {
    if (!isAbonnement.value) {
      const { data: raw } = await axios.post(URL_API_ROUTE.ABONNEMENT_COMFIRM, {
        userId: (await StorageUtils().getStore("nUser_Id")).value,
        transactionId: (await StorageUtils().getStore("nTransactionId")).value,
      });

      // Unwrap TransformInterceptor response
      const data = unwrap(raw) as any;

      if (data?.paiement?.id) {
        isAbonnement.value = true;
        isLifetime.value = data.expiresAt === null;
        isExpired.value = data.expiresAt !== null && new Date(data.expiresAt) <= new Date();
      }

      return data;
    }
  };

  const isAdminLogged = async () => {
    if(
      (await StorageUtils().getStore("nType_Profil")).value == "administrateur"){
        isAbonnement.value = true
      }
  };

  const hasFeature = (key: string): boolean => {
    return subscriptionFeatures.value.includes(key);
  };

  return {
    myAbonnement,
    updateAbonnement,
    isAdminLogged,
    isAbonnement,
    isExpired,
    isLifetime,
    iscroll,
    subscriptionFeatures,
    subscriptionData,
    hasFeature,
  };
});
