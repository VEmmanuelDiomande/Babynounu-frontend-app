// @ts-check
import { SocketService } from "@/services/socket.services";
import { INPUT_ERROR } from "@/types/auth.types";
import { StorageUtils } from "@/utils/store.utils";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useNotificationStore = defineStore("NOTIFICATION", () => {
  const state = reactive({
    count: ref(0),
    countNotification: ref(0),
    countMessage: ref(),
    searchValueData: ref(""),
  });

  const socketService = new SocketService();

  const _IsUserConnect = async () => {
    const IsUserConnect = (await StorageUtils().getStore("nUser_Id")).value
      ? true
      : false;
    const GetUserId = IsUserConnect
      ? (await StorageUtils().getStore("nUser_Id")).value
      : (await StorageUtils().getStore("nAdmin_Id")).value;
    return GetUserId;
  };

  const NCountChats = async () => {
    socketService.emit("getGlobalUnreadCounts", _IsUserConnect());
    socketService.on("globalUnreadCounts", (data: any) => {
      console.log("globalUnreadCounts : ", data);
      state.countMessage = data;
    });
  };

  const NCountNotification = async () => {
    socketService.emit(
      "getAllCountNotificationsByReceiverId",
      await _IsUserConnect()
    );
    socketService.on("allCountNotificationsByReceiverId", (data: any) => {
      state.countNotification = data;
    });
  };




  return {
    state,
    NCountChats,
    NCountNotification
  };
});
