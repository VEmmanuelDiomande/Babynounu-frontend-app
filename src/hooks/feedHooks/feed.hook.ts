import { reactive } from "vue";

export const useFeedHook = () => {

  const state = reactive({
    actions: [
      {
        name: "Likes",
        icon: "heart-line",
        actived: false,
        count: "0",
      },
      {
        name: "Comments",
        icon: "chat-3-line",
        actived: false,
        count: "0",
      },
      {
        name: "Participes",
        icon: "group-line",
        actived: false,
        count: "0",
      },
    ]
  })

  return {
    state
  };
};
