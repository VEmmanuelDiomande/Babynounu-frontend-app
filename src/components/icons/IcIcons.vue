<script lang="ts" setup>
import { computed } from "vue";
import * as icons from "@remixicon/vue";

const Icons:any = icons

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: Number,
  color: String,
  strokeWidth: Number,
  defaultClass: String,
});

const icon = computed(() => Icons[props?.name]);
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth ? strokeWidth : 2.2"
    :default-class="defaultClass"
  />
</template>
