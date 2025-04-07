// @ts-check
import { INPUT_ERROR, SIGN_UP } from "@/types/auth.types";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useScrollStore = defineStore("SCROLL", () => {
  let countScroll = ref(0);
  let countScrollJob = ref(0);
  let countScrollMessage = ref(0);
  let countScrollChatAdmin = ref(0);
  let countScrollSearchNounu = ref(0);
  let countScrollSearchParent = ref(0);

  const onScroll = (event: any) => {
    console.log(event.target.scrollTop);
    countScroll.value = event.target.scrollTop;
  };

  const onScrollJobs = (event: any) => {
    countScrollJob.value = event.detail.scrollTop;
  };

  const onScrollParams = (event: any) => {
    console.log(event);
  };

  return {
    onScroll,
    onScrollParams,
    countScroll,
    countScrollMessage,
    countScrollChatAdmin,
    countScrollSearchNounu,
    countScrollSearchParent,
    countScrollJob,
    onScrollJobs
  };
});
