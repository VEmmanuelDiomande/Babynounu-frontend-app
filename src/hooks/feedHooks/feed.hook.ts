import { reactive } from "vue";

export const useFeedHook = () => {

  const state = reactive({
    actions: [
      {
        name: "Likes",
        icon: "RiHeart3Line",
        actived: false,
        count: "0",
      },
      {
        name: "Comments",
        icon: "RiChat3Line",
        actived: false,
        count: "0",
      },
      {
        name: "Participes",
        icon: "RiGroupLine",
        actived: false,
        count: "0",
      },
    ]
  })

  return {
    state
  };
};
