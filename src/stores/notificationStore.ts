import { socketService } from "@/services/socket.services";
import { StorageUtils } from "@/utils/store.utils";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useChatUnreadCount, useNotificationUnreadCount } from "@/features/notifications/hooks/useNotificationCounts";

export const useNotificationStore = defineStore("NOTIFICATION", () => {
  const state = reactive({
    count: ref(0),
    countNotification: ref(0),
    countMessage: ref(0),
    searchValueData: ref(""),
    scheduleNotificationData: ref([]),
  });

  let chatListenerRegistered = false;
  let notificationListenerRegistered = false;

  const _IsUserConnect = async () => {
    const IsUserConnect = (await StorageUtils().getStore("nUser_Id")).value
      ? true
      : false;
    const GetUserId = IsUserConnect
      ? (await StorageUtils().getStore("nUser_Id")).value
      : (await StorageUtils().getStore("nAdmin_Id")).value;
    return GetUserId;
  };

  const _IsAdmin = async () => {
    const role = (await StorageUtils().getStore("nRole"))?.value;
    const typeProfil = (await StorageUtils().getStore("nType_Profil"))?.value;
    return role === "admin" || typeProfil === "administrateur";
  };

  const NCountChats = async () => {
    const userId = await _IsUserConnect();
    socketService.emit("getUnreadCounts", userId);
    if (!chatListenerRegistered) {
      chatListenerRegistered = true;
      socketService.on("unreadCounts", (data: any) => {
        state.countMessage = data;
      });
      socketService.on("unreadUpdated", (data: { totalUnread: number }) => {
        state.countMessage = data.totalUnread;
      });
    }
  };

  const NCountNotification = async () => {
    const userId = await _IsUserConnect();
    socketService.emit(
      "getAllCountNotificationsByReceiverId",
      userId
    );
    if (!notificationListenerRegistered) {
      notificationListenerRegistered = true;
      socketService.on("allCountNotificationsByReceiverId", (data: any) => {
        state.countNotification = data;
      });
      socketService.on("unreadCountsNotification", (data: any) => {
        state.countNotification = data;
      });
      socketService.on("newNotification", () => {
        state.countNotification += 1;
      });
    }
  };


  return {
    state,
    NCountChats,
    NCountNotification,
  };
});
