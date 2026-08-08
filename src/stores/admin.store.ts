import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AdminServices } from "@/services/admin.services";

export const useAdminStore = defineStore("ADMIN", () => {
  const stats = ref<any>(null);
  const users = ref<any[]>([]);
  const usersTotal = ref(0);
  const pendingNounus = ref<any[]>([]);
  const pendingNounusTotal = ref(0);
  const settings = ref<any>(null);
  const typeParameters = ref<any[]>([]);
  const typeParametersTotal = ref(0);
  const parameters = ref<any[]>([]);
  const parametersTotal = ref(0);
  const permissions = ref<any[]>([]);
  const permissionsTotal = ref(0);
  const rolePermissions = ref<any[]>([]);
  const jobs = ref<any[]>([]);
  const jobsTotal = ref(0);
  const jobDetail = ref<any>(null);
  const parents = ref<any[]>([]);
  const parentsTotal = ref(0);
  const payments = ref<any[]>([]);
  const paymentsTotal = ref(0);
  const chats = ref<any[]>([]);
  const chatsTotal = ref(0);
  const currentChat = ref<any>(null);
  const nounusList = ref<any[]>([]);
  const nounusListTotal = ref(0);
  const userDetail = ref<any>(null);
  const subscriptions = ref<any[]>([]);
  const subscriptionsTotal = ref(0);
  const packs = ref<any[]>([]);
  const packsTotal = ref(0);
  const nounuPayments = ref<any[]>([]);
  const nounuDetail = ref<any>(null);
  const subAdminCreated = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const getRoomNounuUser = (room: any) => {
    if (room.sender?.nounus?.length > 0) return room.sender;
    return room.receiver;
  };

  const chatsTotalUnread = computed(() => {
    if (!Array.isArray(chats.value)) return 0;
    return chats.value.reduce((total: number, room: any) => {
      const nounu = getRoomNounuUser(room);
      if (!nounu?.id) return total;
      const roomUnread = (room.unreadCounts || [])
        .filter((uc: any) => uc.userId === nounu.id)
        .reduce((sum: number, uc: any) => sum + (uc.count || 0), 0);
      return total + roomUnread;
    }, 0);
  });

  const adminService = AdminServices();

  // Helper : extrait data + total d'une réponse paginée wrappée par TransformInterceptor.
  // L'API retourne { success: true, data: { data: [...], pagination: { total, ... } } }.
  const extractPaginated = (result: any): { data: any[]; total: number } => {
    const raw = result?.data ?? result;
    const arr = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
    const total = raw?.pagination?.total ?? result?.pagination?.total ?? raw?.total ?? 0;
    return { data: arr, total };
  };

  // Helper : extrait data d'une réponse simple wrappée par TransformInterceptor.
  // L'API retourne { success: true, data: { ... } }.
  const extractData = (result: any) => result?.data ?? result;

  const fetchStats = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const res = await adminService.getStats();
      stats.value = extractData(res);
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUsers = async (page = 1, limit = 20, roleId?: number, append = false, search?: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getUsers(page, limit, roleId, search);
      const { data: fetched, total } = extractPaginated(result);
      users.value = append ? [...users.value, ...fetched] : fetched;
      usersTotal.value = total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const searchUsers = async (search: string, page = 1, limit = 20) => {
    try {
      error.value = null;
      const result = await adminService.getUsers(page, limit, undefined, search);
      return extractPaginated(result).data;
    } catch (e: any) {
      error.value = e.message;
      return [];
    }
  };

  const fetchPendingNounus = async (page = 1, limit = 20, append = false) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getPendingNounus(page, limit);
      const { data: fetched, total } = extractPaginated(result);
      pendingNounus.value = append ? [...pendingNounus.value, ...fetched] : fetched;
      pendingNounusTotal.value = total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const certifyNounu = async (id: string, status: "Approved" | "Rejected") => {
    try {
      await adminService.certifyNounu(id, status);
      pendingNounus.value = pendingNounus.value.filter((n) => n.id !== id);
      if (stats.value) {
        stats.value.pendingNounus = Math.max(0, stats.value.pendingNounus - 1);
      }
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  };

  const removeUser = async (id: string) => {
    try {
      await adminService.deleteUser(id);
      users.value = users.value.map((u) =>
        u.id === id ? { ...u, deletedAt: new Date().toISOString() } : u
      );
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  };

  const restoreUser = async (id: string) => {
    try {
      await adminService.restoreUser(id);
      users.value = users.value.map((u) =>
        u.id === id ? { ...u, deletedAt: null } : u
      );
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  };

  const fetchSettings = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const res = await adminService.getSettings();
      settings.value = extractData(res);
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const saveSettings = async (data: any) => {
    try {
      isLoading.value = true;
      error.value = null;
      settings.value = extractData(await adminService.updateSettings(data));
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Type Parameters ──
  const fetchTypeParameters = async (page = 1, limit = 20) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getTypeParameters(page, limit);
      const { data, total } = extractPaginated(result);
      typeParameters.value = data;
      typeParametersTotal.value = total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const createTypeParameter = async (data: any) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.createTypeParameter(data);
      await fetchTypeParameters();
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const updateTypeParameter = async (id: number, data: any) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.updateTypeParameter(id, data);
      await fetchTypeParameters();
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const removeTypeParameter = async (id: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.deleteTypeParameter(id);
      typeParameters.value = typeParameters.value.filter((t) => t.id !== id);
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Parameters ──
  const fetchParameters = async (page = 1, limit = 20, typeParameterId?: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getParameters(page, limit, typeParameterId);
      const { data, total } = extractPaginated(result);
      parameters.value = data;
      parametersTotal.value = total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const createParameter = async (data: any) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.createParameter(data);
      await fetchParameters();
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const updateParameter = async (id: number, data: any) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.updateParameter(id, data);
      await fetchParameters();
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const removeParameter = async (id: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.deleteParameter(id);
      parameters.value = parameters.value.filter((p) => p.id !== id);
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Permissions ──
  const fetchPermissions = async (page = 1, limit = 50) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getPermissions(page, limit);
      const { data, total } = extractPaginated(result);
      permissions.value = data;
      permissionsTotal.value = total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const createPermission = async (data: any) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.createPermission(data);
      await fetchPermissions();
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const updatePermission = async (id: number, data: any) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.updatePermission(id, data);
      await fetchPermissions();
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const removePermission = async (id: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.deletePermission(id);
      permissions.value = permissions.value.filter((p) => p.id !== id);
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Role-Permissions ──
  const fetchRolePermissions = async (roleId: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      rolePermissions.value = extractData(await adminService.getRolePermissions(roleId));
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const assignPermission = async (roleId: number, permissionId: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.assignPermissionToRole(roleId, permissionId);
      await fetchRolePermissions(roleId);
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const removePermissionFromRole = async (roleId: number, permissionId: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.removePermissionFromRole(roleId, permissionId);
      rolePermissions.value = rolePermissions.value.filter((rp) => rp.permissionId !== permissionId);
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Jobs ──
  const fetchJobs = async (page = 1, limit = 20) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getJobs(page, limit);
      const { data, total } = extractPaginated(result);
      jobs.value = data;
      jobsTotal.value = total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchJob = async (id: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      jobDetail.value = extractData(await adminService.getJob(id));
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const removeJob = async (id: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.deleteJob(id);
      jobs.value = jobs.value.filter((j) => j.id !== id);
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const suspendJob = async (id: number, suspended: boolean) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.suspendJob(id, suspended);
      jobs.value = jobs.value.map((j) =>
        j.id === id ? { ...j, suspended } : j
      );
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const prioritizeJob = async (id: number, priority: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.prioritizeJob(id, priority);
      jobs.value = jobs.value.map((j) =>
        j.id === id ? { ...j, priority } : j
      );
      jobs.value = [...jobs.value].sort((a, b) =>
        b.priority - a.priority || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Parents ──
  const fetchParents = async (page = 1, limit = 20) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getParents(page, limit);
      const { data, total } = extractPaginated(result);
      parents.value = data;
      parentsTotal.value = total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const updateParent = async (id: string, data: any) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.updateParent(id, data);
      await fetchParents();
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const removeParent = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.deleteParent(id);
      parents.value = parents.value.filter((p) => p.id !== id);
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const restrictParent = async (id: string, restricted: boolean) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.restrictParent(id, restricted);
      parents.value = parents.value.map((p) =>
        p.id === id ? { ...p, restricted } : p
      );
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Payments ──
  const fetchPayments = async (page = 1, limit = 20, status?: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getPayments(page, limit, status);
      const { data, total } = extractPaginated(result);
      payments.value = data;
      paymentsTotal.value = total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const verifyAdminPayment = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.verifyAdminPayment(id);
      payments.value = payments.value.map((p) =>
        p.id === id ? { ...p, status: result.status, paymentDate: result.status === 'Success' ? new Date().toISOString() : p.paymentDate } : p
      );
      return result;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const failAdminPayment = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.failAdminPayment(id);
      payments.value = payments.value.map((p) =>
        p.id === id ? { ...p, status: 'Failed' } : p
      );
      return result;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Chats ──
  const fetchChats = async (page = 1, limit = 20, append = false) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getChats(page, limit);
      const { data, total } = extractPaginated(result);
      chats.value = append ? [...chats.value, ...data] : data;
      chatsTotal.value = total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchChat = async (id: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      currentChat.value = extractData(await adminService.getChat(id));
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const removeChat = async (id: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.deleteChat(id);
      chats.value = Array.isArray(chats.value) ? chats.value.filter((c) => c.id !== id) : [];
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Nounus (full list) ──
  const fetchNounusList = async (page = 1, limit = 20, certif?: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getNounusList(page, limit, certif);
      const { data, total } = extractPaginated(result);
      nounusList.value = data;
      nounusListTotal.value = total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  // ── User detail ──
  const fetchUserDetail = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      userDetail.value = extractData(await adminService.getUserDetail(id));
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Subscriptions ──
  const fetchSubscriptions = async (page = 1, limit = 20, status?: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getSubscriptions(page, limit, status);
      const { data, total } = extractPaginated(result);
      subscriptions.value = data;
      subscriptionsTotal.value = total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const createSubscription = async (data: { userId: string; typeId?: number; packId?: number; durationDays?: number; status?: string }) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.createSubscription(data);
      await fetchSubscriptions();
      return result;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const updateSubscription = async (id: string, data: { status?: string; expiresAt?: Date; typeId?: number; packId?: number }) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.updateSubscription(id, data);
      await fetchSubscriptions();
      return result;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.deleteSubscription(id);
      await fetchSubscriptions();
      return result;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Nounu Payments ──
  const payNounu = async (data: { nounuId: string; amount: number; paymentMethod?: string; currency?: string; description?: string; operator?: 'mobile_money' | 'wave' }) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.payNounu(data);
      return result;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const verifyNounuPayment = async (transactionId: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.verifyNounuPayment(transactionId);
      return result;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchNounuPayments = async (nounuId: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getNounuPayments(nounuId);
      nounuPayments.value = extractPaginated(result).data;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const restrictNounu = async (id: string, restricted: boolean) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.restrictNounu(id, restricted);
      nounusList.value = nounusList.value.map((n: any) =>
        n.id === id ? { ...n, restricted } : n
      );
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchNounuDetails = async (id: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      nounuDetail.value = extractData(await adminService.getNounuDetails(id));
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Packs ──
  const fetchPacks = async (page = 1, limit = 20) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.getPacks(page, limit);
      const { data, total } = extractPaginated(result);
      packs.value = data;
      packsTotal.value = total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const createPack = async (data: any) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.createPack(data);
      return result;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const updatePack = async (id: number, data: any) => {
    try {
      isLoading.value = true;
      error.value = null;
      const result = await adminService.updatePack(id, data);
      return result;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const removePack = async (id: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      await adminService.deletePack(id);
      packs.value = packs.value.filter((p: any) => p.id !== id);
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Sub-Admin Management ──
  const createSubAdmin = async (data: { email: string; password: string; roleId: number; permissionIds?: number[] }) => {
    try {
      isLoading.value = true;
      error.value = null;
      subAdminCreated.value = false;
      const result = await adminService.createSubAdmin(data);
      subAdminCreated.value = true;
      return result;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Send message as nounu ──
  const sendMessageAsNounu = async (roomId: number, content: string, isProposition?: boolean, propositionExpired?: string, montant?: number, periode?: string) => {
    try {
      error.value = null;
      const message = await adminService.sendMessageAsNounu(roomId, content, isProposition, propositionExpired, montant, periode);
      if (currentChat.value?.id === roomId) {
        currentChat.value = {
          ...currentChat.value,
          messages: [...(currentChat.value.messages || []), message],
        };
      }
      return message;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  };

  // ── Send message with file as nounu ──
  const sendMessageAsNounuWithFile = async (roomId: number, file: File | Blob, fileName: string, content?: string) => {
    try {
      error.value = null;
      const message = await adminService.sendMessageAsNounuWithFile(roomId, file, fileName, content);
      if (currentChat.value?.id === roomId) {
        currentChat.value = {
          ...currentChat.value,
          messages: [...(currentChat.value.messages || []), message],
        };
      }
      return message;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  };

  // ── Mark room as read ──
  const markRoomAsRead = async (roomId: number, userId: string) => {
    try {
      error.value = null;
      await adminService.markRoomAsRead(roomId, userId);
      const clearedRoom = { unreadCounts: [] };
      if (currentChat.value?.id === roomId) {
        currentChat.value = {
          ...currentChat.value,
          ...clearedRoom,
        };
      }
      chats.value = Array.isArray(chats.value)
        ? chats.value.map((room: any) =>
            room.id === roomId ? { ...room, ...clearedRoom } : room
          )
        : [];
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  };

  // ── Update proposal status ──
  const updateProposalStatus = async (roomId: number, messageId: number, status: 'Accepted' | 'Refused') => {
    try {
      error.value = null;
      const updated = await adminService.updateProposalStatus(roomId, messageId, status);
      if (currentChat.value?.id === roomId) {
        currentChat.value = {
          ...currentChat.value,
          messages: (currentChat.value.messages || []).map((m: any) =>
            m.id === messageId ? { ...m, proposalStatus: status } : m
          ),
        };
      }
      return updated;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  };

  return {
    stats,
    users,
    usersTotal,
    pendingNounus,
    pendingNounusTotal,
    settings,
    typeParameters,
    typeParametersTotal,
    parameters,
    parametersTotal,
    permissions,
    permissionsTotal,
    rolePermissions,
    jobs,
    jobsTotal,
    jobDetail,
    parents,
    parentsTotal,
    payments,
    paymentsTotal,
    chats,
    chatsTotal,
    chatsTotalUnread,
    currentChat,
    nounusList,
    nounusListTotal,
    userDetail,
    subscriptions,
    subscriptionsTotal,
    packs,
    packsTotal,
    nounuPayments,
    subAdminCreated,
    isLoading,
    error,
    fetchStats,
    fetchUsers,
    searchUsers,
    fetchPendingNounus,
    certifyNounu,
    removeUser,
    restoreUser,
    fetchSettings,
    saveSettings,
    fetchTypeParameters,
    createTypeParameter,
    updateTypeParameter,
    removeTypeParameter,
    fetchParameters,
    createParameter,
    updateParameter,
    removeParameter,
    fetchPermissions,
    createPermission,
    updatePermission,
    removePermission,
    fetchRolePermissions,
    assignPermission,
    removePermissionFromRole,
    fetchJobs,
    fetchJob,
    removeJob,
    suspendJob,
    prioritizeJob,
    fetchParents,
    updateParent,
    removeParent,
    restrictParent,
    fetchPayments,
    verifyAdminPayment,
    failAdminPayment,
    fetchChats,
    fetchChat,
    removeChat,
    fetchNounusList,
    fetchUserDetail,
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    fetchPacks,
    createPack,
    updatePack,
    removePack,
    payNounu,
    verifyNounuPayment,
    fetchNounuPayments,
    restrictNounu,
    fetchNounuDetails,
    nounuDetail,
    createSubAdmin,
    sendMessageAsNounu,
    sendMessageAsNounuWithFile,
    markRoomAsRead,
    updateProposalStatus,
  };
});
