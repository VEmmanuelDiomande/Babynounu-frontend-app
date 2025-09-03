import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { getUserId } from "@/utils/helpers.utils";
import { StorageUtils } from "@/utils/store.utils";
import { reactive } from "vue";

export const useConversationHook = () => {
  const state = reactive({});
  const { listSetting, createSetting } = SettingServices();

  const GetAllConversations = async (
    nounouId: string,
    parentId: string,
    router: any
  ) => {
    if (listSetting) {
      const userId = await getUserId();
      const data = await listSetting(
        `${URL_API_ROUTE.CONVERSATION_CREATE}?nounouId=${nounouId}&parentId=${parentId}&userId=${userId}`
      );

      if (data) {
        console.log(data);
        router.push({ name: "CHAT_MESSAGE_DETAIL", params: { id: data.id } });
      }
    } else {
      console.error("createSetting is undefined");
    }
  };

  const GetConversations = async () => {};

  const CreateConversation = async () => {};

  return {
    state,
    GetAllConversations,
    GetConversations,
    CreateConversation,
  };
};
