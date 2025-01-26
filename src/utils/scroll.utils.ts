import { ref } from "vue";

export const ScrollUtils = () => {
  const countScroll = ref(0);

  const onScroll = (event: CustomEvent) => {
    countScroll.value = event.detail.scrollTop;
    console.log(event.detail.scrollTop);
  };
  return {
    countScroll,
    onScroll,
  };
};
