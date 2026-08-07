import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { StorageUtils } from "@/utils/store.utils";
import axios from "axios";

/**
 * Helper générique pour les requêtes admin authentifiées.
 * Gère automatiquement:
 *  - le header Authorization (Bearer token)
 *  - la gestion d'erreurs axios (extraction du message serveur)
 *  - le fallback sur un message par défaut contextuel
 */
async function adminRequest<T = any>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  defaultErrorMessage: string,
  options?: {
    params?: Record<string, any>;
    data?: any;
    headers?: Record<string, string>;
  }
): Promise<T> {
  const nToken = await StorageUtils().getStore("nToken");
  const token = nToken?.value;
  if (!token) {
    throw new Error("Token d'authentification manquant");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options?.headers,
  };

  try {
    const response = await axios.request<T>({
      method,
      url,
      headers,
      params: options?.params,
      data: options?.data,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Erreur serveur");
    }
    throw new Error(defaultErrorMessage);
  }
}

export const AdminServices = () => {
  // ── Stats ──
  const getStats = () => adminRequest("get", URL_API_ROUTE.ADMIN_STATS, "Erreur lors de la récupération des statistiques");

  // ── Users ──
  const getUsers = (page = 1, limit = 20, roleId?: number, search?: string) => {
    const params: Record<string, any> = { page, limit };
    if (roleId) params.role = roleId;
    if (search) params.search = search;
    return adminRequest("get", URL_API_ROUTE.ADMIN_USERS, "Erreur lors de la récupération des utilisateurs", { params });
  };

  const getUserDetail = (id: string) =>
    adminRequest("get", `${URL_API_ROUTE.ADMIN_USER_DETAIL}/${id}`, "Erreur lors de la récupération de l'utilisateur");

  const deleteUser = (id: string) =>
    adminRequest("delete", `${URL_API_ROUTE.ADMIN_USER_DELETE}/${id}`, "Erreur lors de la suppression de l'utilisateur");

  const restoreUser = (id: string) =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_USER_RESTORE}/${id}/restore`, "Erreur lors de la restauration de l'utilisateur", { data: {} });

  // ── Nounus ──
  const getPendingNounus = (page = 1, limit = 20) =>
    adminRequest("get", URL_API_ROUTE.ADMIN_NOUNUS_PENDING, "Erreur lors de la récupération des nounus en attente", { params: { page, limit } });

  const certifyNounu = (id: string, status: "Approved" | "Rejected") =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_NOUNU_CERTIFY}/${id}/certify`, "Erreur lors de la certification du nounu", { data: { status } });

  const getNounusList = (page = 1, limit = 20, certif?: string) => {
    const params: Record<string, any> = { page, limit };
    if (certif) params.certif = certif;
    return adminRequest("get", URL_API_ROUTE.ADMIN_NOUNUS_LIST, "Erreur lors de la récupération des nounous", { params });
  };

  const restrictNounu = (id: string, restricted: boolean) =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_NOUNUS_LIST}/${id}/restrict`, "Erreur lors de la restriction du nounu", { data: { restricted } });

  const getNounuDetails = (id: string) =>
    adminRequest("get", `${URL_API_ROUTE.ADMIN_NOUNUS_LIST}/${id}/details`, "Erreur lors de la récupération des détails du nounu");

  // ── Settings ──
  const getSettings = () => adminRequest("get", URL_API_ROUTE.ADMIN_SETTINGS, "Erreur lors de la récupération des paramètres");
  const updateSettings = (data: any) => adminRequest("put", URL_API_ROUTE.ADMIN_SETTINGS, "Erreur lors de la mise à jour des paramètres", { data });

  // ── Type Parameters ──
  const getTypeParameters = (page = 1, limit = 20) =>
    adminRequest("get", URL_API_ROUTE.ADMIN_TYPE_PARAMETERS, "Erreur lors de la récupération des types de paramètres", { params: { page, limit } });
  const createTypeParameter = (data: any) =>
    adminRequest("post", URL_API_ROUTE.ADMIN_TYPE_PARAMETERS, "Erreur lors de la création du type de paramètre", { data });
  const updateTypeParameter = (id: number, data: any) =>
    adminRequest("put", `${URL_API_ROUTE.ADMIN_TYPE_PARAMETERS}/${id}`, "Erreur lors de la mise à jour du type de paramètre", { data });
  const deleteTypeParameter = (id: number) =>
    adminRequest("delete", `${URL_API_ROUTE.ADMIN_TYPE_PARAMETERS}/${id}`, "Erreur lors de la suppression du type de paramètre");

  // ── Parameters ──
  const getParameters = (page = 1, limit = 20, typeParameterId?: number) => {
    const params: Record<string, any> = { page, limit };
    if (typeParameterId) params.typeParameterId = typeParameterId;
    return adminRequest("get", URL_API_ROUTE.ADMIN_PARAMETERS, "Erreur lors de la récupération des paramètres", { params });
  };
  const createParameter = (data: any) => adminRequest("post", URL_API_ROUTE.ADMIN_PARAMETERS, "Erreur lors de la création du paramètre", { data });
  const updateParameter = (id: number, data: any) =>
    adminRequest("put", `${URL_API_ROUTE.ADMIN_PARAMETERS}/${id}`, "Erreur lors de la mise à jour du paramètre", { data });
  const deleteParameter = (id: number) => adminRequest("delete", `${URL_API_ROUTE.ADMIN_PARAMETERS}/${id}`, "Erreur lors de la suppression du paramètre");

  // ── Permissions ──
  const getPermissions = (page = 1, limit = 20) =>
    adminRequest("get", URL_API_ROUTE.ADMIN_PERMISSIONS, "Erreur lors de la récupération des permissions", { params: { page, limit } });
  const createPermission = (data: any) => adminRequest("post", URL_API_ROUTE.ADMIN_PERMISSIONS, "Erreur lors de la création de la permission", { data });
  const updatePermission = (id: number, data: any) =>
    adminRequest("put", `${URL_API_ROUTE.ADMIN_PERMISSIONS}/${id}`, "Erreur lors de la mise à jour de la permission", { data });
  const deletePermission = (id: number) => adminRequest("delete", `${URL_API_ROUTE.ADMIN_PERMISSIONS}/${id}`, "Erreur lors de la suppression de la permission");

  // ── Role-Permission assignments ──
  const getRolePermissions = (roleId: number) =>
    adminRequest("get", `${URL_API_ROUTE.ADMIN_ROLE_PERMISSIONS}/${roleId}/permissions`, "Erreur lors de la récupération des permissions du rôle");
  const assignPermissionToRole = (roleId: number, permissionId: number) =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_ROLE_PERMISSIONS}/${roleId}/permissions`, "Erreur lors de l'assignation de la permission", { data: { roleId, permissionId } });
  const removePermissionFromRole = (roleId: number, permissionId: number) =>
    adminRequest("delete", `${URL_API_ROUTE.ADMIN_ROLE_PERMISSIONS}/${roleId}/permissions/${permissionId}`, "Erreur lors du retrait de la permission");

  // ── Jobs ──
  const getJobs = (page = 1, limit = 20) =>
    adminRequest("get", URL_API_ROUTE.ADMIN_JOBS, "Erreur lors de la récupération des annonces", { params: { page, limit } });
  const getJob = (id: number) => adminRequest("get", `${URL_API_ROUTE.ADMIN_JOBS}/${id}`, "Erreur lors de la récupération du détail de l'annonce");
  const deleteJob = (id: number) => adminRequest("delete", `${URL_API_ROUTE.ADMIN_JOBS}/${id}`, "Erreur lors de la suppression de l'annonce");
  const suspendJob = (id: number, suspended: boolean) =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_JOBS}/${id}/suspend`, "Erreur lors de la suspension de l'annonce", { data: { suspended } });
  const prioritizeJob = (id: number, priority: number) =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_JOBS}/${id}/prioritize`, "Erreur lors de la priorisation de l'annonce", { data: { priority } });

  // ── Parents ──
  const getParents = (page = 1, limit = 20) =>
    adminRequest("get", URL_API_ROUTE.ADMIN_PARENTS, "Erreur lors de la récupération des parents", { params: { page, limit } });
  const updateParent = (id: string, data: any) => adminRequest("put", `${URL_API_ROUTE.ADMIN_PARENTS}/${id}`, "Erreur lors de la mise à jour du parent", { data });
  const deleteParent = (id: string) => adminRequest("delete", `${URL_API_ROUTE.ADMIN_PARENTS}/${id}`, "Erreur lors de la suppression du parent");
  const restrictParent = (id: string, restricted: boolean) =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_PARENTS}/${id}/restrict`, "Erreur lors de la restriction du parent", { data: { restricted } });

  // ── Payments ──
  const getPayments = (page = 1, limit = 20, status?: string) => {
    const params: Record<string, any> = { page, limit };
    if (status) params.status = status;
    return adminRequest("get", URL_API_ROUTE.ADMIN_PAYMENTS, "Erreur lors de la récupération des paiements", { params });
  };
  const getPayment = (id: string) => adminRequest("get", `${URL_API_ROUTE.ADMIN_PAYMENTS}/${id}`, "Erreur lors de la récupération du paiement");
  const verifyAdminPayment = (id: string) =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_PAYMENTS}/${id}/verify`, "Erreur lors de la vérification du paiement", { data: {} });
  const failAdminPayment = (id: string) =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_PAYMENTS}/${id}/fail`, "Erreur lors de la mise en échec du paiement", { data: {} });

  // ── Chats ──
  const getChats = (page = 1, limit = 20) =>
    adminRequest("get", URL_API_ROUTE.ADMIN_CHATS, "Erreur lors de la récupération des conversations", { params: { page, limit } });
  const getChat = (id: number) => adminRequest("get", `${URL_API_ROUTE.ADMIN_CHATS}/${id}`, "Erreur lors de la récupération de la conversation");
  const deleteChat = (id: number) => adminRequest("delete", `${URL_API_ROUTE.ADMIN_CHATS}/${id}`, "Erreur lors de la suppression de la conversation");

  // ── Subscriptions ──
  const getSubscriptions = (page = 1, limit = 20, status?: string) => {
    const params: Record<string, any> = { page, limit };
    if (status) params.status = status;
    return adminRequest("get", URL_API_ROUTE.ADMIN_SUBSCRIPTIONS, "Erreur lors de la récupération des abonnements", { params });
  };
  const createSubscription = (data: { userId: string; typeId?: number; packId?: number; durationDays?: number; status?: string }) =>
    adminRequest("post", URL_API_ROUTE.ADMIN_SUBSCRIPTIONS, "Erreur lors de la création de l'abonnement", { data });
  const updateSubscription = (id: string, data: { status?: string; expiresAt?: Date; typeId?: number; packId?: number }) =>
    adminRequest("patch", `${URL_API_ROUTE.ADMIN_SUBSCRIPTIONS}/${id}`, "Erreur lors de la mise à jour de l'abonnement", { data });
  const deleteSubscription = (id: string) => adminRequest("delete", `${URL_API_ROUTE.ADMIN_SUBSCRIPTIONS}/${id}`, "Erreur lors de la suppression de l'abonnement");

  // ── Nounu Payments ──
  const payNounu = (data: { nounuId: string; amount: number; paymentMethod?: string; currency?: string; description?: string; operator?: 'mobile_money' | 'wave' }) =>
    adminRequest("post", URL_API_ROUTE.ADMIN_NOUNU_PAY, "Erreur lors du paiement du nounu", { data });
  const verifyNounuPayment = (transactionId: string) =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_NOUNU_PAY}/verify`, "Erreur lors de la vérification du paiement", { data: { transactionId } });
  const getNounuPayments = (nounuId: string) =>
    adminRequest("get", `${URL_API_ROUTE.ADMIN_NOUNU_PAYMENTS}/${nounuId}/payments`, "Erreur lors de la récupération des paiements du nounu");

  // ── Sub-Admin Management ──
  const createSubAdmin = (data: { email: string; password: string; roleId: number; permissionIds?: number[] }) =>
    adminRequest("post", URL_API_ROUTE.ADMIN_SUB_ADMINS, "Erreur lors de la création du sous-admin", { data });

  // ── Chat messaging (admin as nounu) ──
  const sendMessageAsNounu = (roomId: number, content: string, isProposition?: boolean, propositionExpired?: string, montant?: number, periode?: string) =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_CHAT_SEND_MESSAGE}/${roomId}/messages`, "Erreur lors de l'envoi du message", {
      data: { content, isProposition, propositionExpired, montant, periode },
    });

  const sendMessageAsNounuWithFile = async (roomId: number, file: File | Blob, fileName: string, content?: string) => {
    const nToken = await StorageUtils().getStore("nToken");
    const token = nToken?.value;
    if (!token) throw new Error("Token d'authentification manquant");
    const formData = new FormData();
    formData.append("file", file, fileName);
    if (content) formData.append("content", content);
    try {
      const response = await axios.post(`${URL_API_ROUTE.ADMIN_CHAT_SEND_MESSAGE}/${roomId}/messages/file`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Erreur serveur");
      }
      throw new Error("Erreur lors de l'envoi du fichier");
    }
  };

  const markRoomAsRead = (roomId: number, userId: string) =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_CHAT_SEND_MESSAGE}/${roomId}/read`, "Erreur lors du marquage comme lu", { data: { userId } });

  const updateProposalStatus = (roomId: number, messageId: number, status: 'Accepted' | 'Refused') =>
    adminRequest("post", `${URL_API_ROUTE.ADMIN_CHAT_SEND_MESSAGE}/${roomId}/messages/${messageId}/proposal`, "Erreur lors de la mise à jour de la proposition", { data: { status } });

  // ── Packs ──
  const getPacks = (page = 1, limit = 20) =>
    adminRequest("get", URL_API_ROUTE.ADMIN_PACKS, "Erreur lors de la récupération des packs", { params: { page, limit } });
  const getActivePacks = () => adminRequest("get", URL_API_ROUTE.ADMIN_PACKS_ACTIVE, "Erreur lors de la récupération des packs actifs");
  const createPack = (data: any) => adminRequest("post", URL_API_ROUTE.ADMIN_PACKS, "Erreur lors de la création du pack", { data });
  const updatePack = (id: number, data: any) => adminRequest("put", `${URL_API_ROUTE.ADMIN_PACKS}/${id}`, "Erreur lors de la mise à jour du pack", { data });
  const deletePack = (id: number) => adminRequest("delete", `${URL_API_ROUTE.ADMIN_PACKS}/${id}`, "Erreur lors de la suppression du pack");

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
