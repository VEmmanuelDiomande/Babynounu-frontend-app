<template>
  <div class="flex">
    <img
      :class="`size-${size} ${rounded ? 'rounded-full' : ''} ${
        shadow ? 'shadow' : ''
      }`"
      class="inline-block object-cover rounded-full ring-2 ring-white "
     v-lazy="BASE_URL_CENTER+src"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { BASE_URL_CENTER } from "@/routes/_requests/index.request";
import { computed } from "vue";

const props = defineProps({
  src: {
    type: String,
    default: null,
  },
  alt: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "8",
    validator: (value: string) => ["8", "12", "14", "16", "20"].includes(value),
  },
  rounded: {
    type: Boolean,
    default: true,
  },
  shadow: {
    type: Boolean,
    default: false,
  },
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "xs":
      return "w-8 h-8";
    case "sm":
      return "w-12 h-12";
    case "md":
      return "w-16 h-16";
    case "lg":
      return "w-20 h-20";
    case "xl":
      return "w-24 h-24";
    default:
      return "";
  }
});
</script>

<style scoped>
.avatar {
  @apply relative;
}

.avatar-img {
  @apply w-full h-full object-cover;
}

.avatar-img-placeholder {
  @apply bg-gray-200;
}

.avatar-placeholder {
  @apply flex items-center justify-center w-full h-full bg-gray-200;
}
</style>
