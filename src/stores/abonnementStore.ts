import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import type { DELIVERY_TYPE_STANDARD } from "@/types/agency.types";
import { StorageUtils } from "@/utils/store.utils";
import { a, u } from "@tanstack/vue-query/build/legacy/queryClient-C5JH3kKW";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAbonnementStore = defineStore("Abonnement", () => {
  const isAbonnement = ref(false);
  const isExpired = ref(false);
  const isVerity = ref(false);

  const myAbonnement = async () => {
    const { data } = await axios.get(
      URL_API_ROUTE.ABONNEMENT_HAS_ACTIVE_SUBSCRIPTION +
        "" +
        (
          await StorageUtils().getStore("nUser_Id")
        ).value
    );

    if (data) {
      isAbonnement.value = data.hasActiveSubscription;
      const createdAt = new Date(data.createdAt);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      isExpired.value = diffDays > 30 ? true : false;
    }

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
      const { data } = await axios.post(URL_API_ROUTE.ABONNEMENT_COMFIRM, {
        userId: (await StorageUtils().getStore("nUser_Id")).value,
        transactionId: (await StorageUtils().getStore("nTransactionId")).value,
      });

      if (data?.paiement?.id) {
        isAbonnement.value = true;
        const createdAt = new Date(data.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - createdAt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        isExpired.value = diffDays > 30 ? true : false;
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

  return {
    myAbonnement,
    updateAbonnement,
    isAdminLogged,
    isAbonnement,
    isExpired,
    iscroll,
  };
});
