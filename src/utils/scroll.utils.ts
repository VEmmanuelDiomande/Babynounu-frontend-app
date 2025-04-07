import { useScrollStore } from "@/stores/scrollStore";
import { ref } from "vue";

export const ScrollUtils = () => {
  const { countScroll } = useScrollStore();

  const onScroll = (event: any) => {
    // countScroll = event.target.scrollTop;
  };
  return {
    onScroll,
  };
};
