import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import axios, { AxiosError } from "axios";

export const AdminServices = () => {
  const getAuthHeaders = async () => {
    const nToken = await StorageUtils().getStore("nToken");
    const token = nToken?.value;
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const getStats = async (): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.ADMIN_STATS, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des statistiques");
    }
  };

  const getUsers = async (page = 1, limit = 20, roleId?: number, search?: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const params: any = { page, limit };
      if (roleId) params.role = roleId;
      if (search) params.search = search;
      const response = await axios.get(URL_API_ROUTE.ADMIN_USERS, { headers, params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }
  };

  const getPendingNounus = async (page = 1, limit = 20): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.ADMIN_NOUNUS_PENDING, {
        headers,
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des nounus en attente");
    }
  };

  const certifyNounu = async (id: string, status: "Approved" | "Rejected"): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${URL_API_ROUTE.ADMIN_NOUNU_CERTIFY}/${id}/certify`,
        { status },
        { headers }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la certification du nounu");
    }
  };

  const deleteUser = async (id: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${URL_API_ROUTE.ADMIN_USER_DELETE}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const restoreUser = async (id: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${URL_API_ROUTE.ADMIN_USER_RESTORE}/${id}/restore`,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la restauration de l'utilisateur");
    }
  };

  const getSettings = async (): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.ADMIN_SETTINGS, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des paramètres");
    }
  };

  const updateSettings = async (data: any): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(URL_API_ROUTE.ADMIN_SETTINGS, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la mise à jour des paramètres");
    }
  };

  // ── Type Parameters ──
  const getTypeParameters = async (page = 1, limit = 20): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.ADMIN_TYPE_PARAMETERS, { headers, params: { page, limit } });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des types de paramètres");
    }
  };

  const createTypeParameter = async (data: any): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(URL_API_ROUTE.ADMIN_TYPE_PARAMETERS, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la création du type de paramètre");
    }
  };

  const updateTypeParameter = async (id: number, data: any): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${URL_API_ROUTE.ADMIN_TYPE_PARAMETERS}/${id}`, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la mise à jour du type de paramètre");
    }
  };

  const deleteTypeParameter = async (id: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${URL_API_ROUTE.ADMIN_TYPE_PARAMETERS}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la suppression du type de paramètre");
    }
  };

  // ── Parameters ──
  const getParameters = async (page = 1, limit = 20, typeParameterId?: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const params: any = { page, limit };
      if (typeParameterId) params.typeParameterId = typeParameterId;
      const response = await axios.get(URL_API_ROUTE.ADMIN_PARAMETERS, { headers, params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des paramètres");
    }
  };

  const createParameter = async (data: any): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(URL_API_ROUTE.ADMIN_PARAMETERS, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la création du paramètre");
    }
  };

  const updateParameter = async (id: number, data: any): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${URL_API_ROUTE.ADMIN_PARAMETERS}/${id}`, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la mise à jour du paramètre");
    }
  };

  const deleteParameter = async (id: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${URL_API_ROUTE.ADMIN_PARAMETERS}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la suppression du paramètre");
    }
  };

  // ── Permissions ──
  const getPermissions = async (page = 1, limit = 20): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.ADMIN_PERMISSIONS, { headers, params: { page, limit } });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des permissions");
    }
  };

  const createPermission = async (data: any): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(URL_API_ROUTE.ADMIN_PERMISSIONS, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la création de la permission");
    }
  };

  const updatePermission = async (id: number, data: any): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${URL_API_ROUTE.ADMIN_PERMISSIONS}/${id}`, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la mise à jour de la permission");
    }
  };

  const deletePermission = async (id: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${URL_API_ROUTE.ADMIN_PERMISSIONS}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la suppression de la permission");
    }
  };

  // ── Role-Permission assignments ──
  const getRolePermissions = async (roleId: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.ADMIN_ROLE_PERMISSIONS}/${roleId}/permissions`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des permissions du rôle");
    }
  };

  const assignPermissionToRole = async (roleId: number, permissionId: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${URL_API_ROUTE.ADMIN_ROLE_PERMISSIONS}/${roleId}/permissions`, { roleId, permissionId }, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de l'assignation de la permission");
    }
  };

  const removePermissionFromRole = async (roleId: number, permissionId: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${URL_API_ROUTE.ADMIN_ROLE_PERMISSIONS}/${roleId}/permissions/${permissionId}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors du retrait de la permission");
    }
  };

  // ── Jobs ──
  const getJobs = async (page = 1, limit = 20): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.ADMIN_JOBS, { headers, params: { page, limit } });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des annonces");
    }
  };

  const getJob = async (id: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.ADMIN_JOBS}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération du détail de l'annonce");
    }
  };

  const deleteJob = async (id: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${URL_API_ROUTE.ADMIN_JOBS}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la suppression de l'annonce");
    }
  };

  const suspendJob = async (id: number, suspended: boolean): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${URL_API_ROUTE.ADMIN_JOBS}/${id}/suspend`,
        { suspended },
        { headers }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la suspension de l'annonce");
    }
  };

  const prioritizeJob = async (id: number, priority: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${URL_API_ROUTE.ADMIN_JOBS}/${id}/prioritize`,
        { priority },
        { headers }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la priorisation de l'annonce");
    }
  };

  // ── Parents ──
  const getParents = async (page = 1, limit = 20): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.ADMIN_PARENTS, { headers, params: { page, limit } });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des parents");
    }
  };

  const updateParent = async (id: string, data: any): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${URL_API_ROUTE.ADMIN_PARENTS}/${id}`, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la mise à jour du parent");
    }
  };

  const deleteParent = async (id: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${URL_API_ROUTE.ADMIN_PARENTS}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la suppression du parent");
    }
  };

  const restrictParent = async (id: string, restricted: boolean): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${URL_API_ROUTE.ADMIN_PARENTS}/${id}/restrict`,
        { restricted },
        { headers }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la restriction du parent");
    }
  };

  // ── Payments ──
  const getPayments = async (page = 1, limit = 20, status?: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const params: any = { page, limit };
      if (status) params.status = status;
      const response = await axios.get(URL_API_ROUTE.ADMIN_PAYMENTS, { headers, params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des paiements");
    }
  };

  const getPayment = async (id: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.ADMIN_PAYMENTS}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération du paiement");
    }
  };

  const verifyAdminPayment = async (id: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${URL_API_ROUTE.ADMIN_PAYMENTS}/${id}/verify`, {}, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la vérification du paiement");
    }
  };

  const failAdminPayment = async (id: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${URL_API_ROUTE.ADMIN_PAYMENTS}/${id}/fail`, {}, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la mise en échec du paiement");
    }
  };

  // ── Chats ──
  const getChats = async (page = 1, limit = 20): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.ADMIN_CHATS, { headers, params: { page, limit } });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des conversations");
    }
  };

  const getChat = async (id: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.ADMIN_CHATS}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération de la conversation");
    }
  };

  const deleteChat = async (id: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${URL_API_ROUTE.ADMIN_CHATS}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la suppression de la conversation");
    }
  };

  // ── Nounus (full list) ──
  const getNounusList = async (page = 1, limit = 20, certif?: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const params: any = { page, limit };
      if (certif) params.certif = certif;
      const response = await axios.get(URL_API_ROUTE.ADMIN_NOUNUS_LIST, { headers, params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des nounous");
    }
  };

  // ── User detail ──
  const getUserDetail = async (id: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.ADMIN_USER_DETAIL}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération de l'utilisateur");
    }
  };

  // ── Subscriptions ──
  const getSubscriptions = async (page = 1, limit = 20, status?: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const params: any = { page, limit };
      if (status) params.status = status;
      const response = await axios.get(URL_API_ROUTE.ADMIN_SUBSCRIPTIONS, { headers, params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des abonnements");
    }
  };

  const createSubscription = async (data: { userId: string; typeId?: number; packId?: number; durationDays?: number; status?: string }): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(URL_API_ROUTE.ADMIN_SUBSCRIPTIONS, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la création de l'abonnement");
    }
  };

  const updateSubscription = async (id: string, data: { status?: string; expiresAt?: Date; typeId?: number; packId?: number }): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.patch(`${URL_API_ROUTE.ADMIN_SUBSCRIPTIONS}/${id}`, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la mise à jour de l'abonnement");
    }
  };

  const deleteSubscription = async (id: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${URL_API_ROUTE.ADMIN_SUBSCRIPTIONS}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la suppression de l'abonnement");
    }
  };

  // ── Nounu Payments ──
  const payNounu = async (data: { nounuId: string; amount: number; paymentMethod?: string; currency?: string; description?: string; operator?: 'mobile_money' | 'wave' }): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(URL_API_ROUTE.ADMIN_NOUNU_PAY, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors du paiement du nounu");
    }
  };

  const verifyNounuPayment = async (transactionId: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${URL_API_ROUTE.ADMIN_NOUNU_PAY}/verify`, { transactionId }, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la vérification du paiement");
    }
  };

  const getNounuPayments = async (nounuId: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.ADMIN_NOUNU_PAYMENTS}/${nounuId}/payments`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des paiements du nounu");
    }
  };

  const restrictNounu = async (id: string, restricted: boolean): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${URL_API_ROUTE.ADMIN_NOUNUS_LIST}/${id}/restrict`,
        { restricted },
        { headers }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la restriction du nounu");
    }
  };

  const getNounuDetails = async (id: string): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${URL_API_ROUTE.ADMIN_NOUNUS_LIST}/${id}/details`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des détails du nounu");
    }
  };

  // ── Sub-Admin Management ──
  const createSubAdmin = async (data: { email: string; password: string; roleId: number; permissionIds?: number[] }): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(URL_API_ROUTE.ADMIN_SUB_ADMINS, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la création du sous-admin");
    }
  };

  const sendMessageAsNounu = async (roomId: number, content: string, isProposition?: boolean, propositionExpired?: string, montant?: number, periode?: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${URL_API_ROUTE.ADMIN_CHAT_SEND_MESSAGE}/${roomId}/messages`, { content, isProposition, propositionExpired, montant, periode }, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de l'envoi du message");
    }
  };

  const sendMessageAsNounuWithFile = async (roomId: number, file: File | Blob, fileName: string, content?: string) => {
    try {
      const headers = await getAuthHeaders();
      const formData = new FormData();
      formData.append('file', file, fileName);
      if (content) formData.append('content', content);
      const response = await axios.post(
        `${URL_API_ROUTE.ADMIN_CHAT_SEND_MESSAGE}/${roomId}/messages/file`,
        formData,
        { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de l'envoi du fichier");
    }
  };

  const markRoomAsRead = async (roomId: number, userId: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${URL_API_ROUTE.ADMIN_CHAT_SEND_MESSAGE}/${roomId}/read`, { userId }, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors du marquage comme lu");
    }
  };

  const updateProposalStatus = async (roomId: number, messageId: number, status: 'Accepted' | 'Refused') => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${URL_API_ROUTE.ADMIN_CHAT_SEND_MESSAGE}/${roomId}/messages/${messageId}/proposal`, { status }, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la mise à jour de la proposition");
    }
  };

  // ── Packs ──
  const getPacks = async (page = 1, limit = 20): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.ADMIN_PACKS, { headers, params: { page, limit } });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des packs");
    }
  };

  const getActivePacks = async (): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(URL_API_ROUTE.ADMIN_PACKS_ACTIVE, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la récupération des packs actifs");
    }
  };

  const createPack = async (data: any): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(URL_API_ROUTE.ADMIN_PACKS, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la création du pack");
    }
  };

  const updatePack = async (id: number, data: any): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${URL_API_ROUTE.ADMIN_PACKS}/${id}`, data, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la mise à jour du pack");
    }
  };

  const deletePack = async (id: number): Promise<any> => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.delete(`${URL_API_ROUTE.ADMIN_PACKS}/${id}`, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de la suppression du pack");
    }
  };

  return {
    getStats,
    getUsers,
    getNounusList,
    getUserDetail,
    getSubscriptions,
    getPendingNounus,
    certifyNounu,
    deleteUser,
    restoreUser,
    getSettings,
    updateSettings,
    getTypeParameters,
    createTypeParameter,
    updateTypeParameter,
    deleteTypeParameter,
    getParameters,
    createParameter,
    updateParameter,
    deleteParameter,
    getPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    getRolePermissions,
    assignPermissionToRole,
    removePermissionFromRole,
    getJobs,
    getJob,
    deleteJob,
    suspendJob,
    prioritizeJob,
    getParents,
    updateParent,
    deleteParent,
    restrictParent,
    getPayments,
    getPayment,
    verifyAdminPayment,
    failAdminPayment,
    getChats,
    getChat,
    deleteChat,
    payNounu,
    verifyNounuPayment,
    getNounuPayments,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    restrictNounu,
    getNounuDetails,
    createSubAdmin,
    sendMessageAsNounu,
    sendMessageAsNounuWithFile,
    markRoomAsRead,
    updateProposalStatus,
    getPacks,
    getActivePacks,
    createPack,
    updatePack,
    deletePack,
  };
};
