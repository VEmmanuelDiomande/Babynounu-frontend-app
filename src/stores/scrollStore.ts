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
    countScroll.value = event.target.scrollTop;
  };

  const onScrollJobs = (event: any) => {
    countScrollJob.value = event.detail.scrollTop;
  };

  const onScrollParams = (event: any) => {
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
