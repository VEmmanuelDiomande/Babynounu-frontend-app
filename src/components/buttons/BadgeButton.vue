<script lang="ts" setup>
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
import TitleText from "@/components/texts/titleText.vue";

defineProps(["title", "type", "loading", "setcolor", "textcolor"]);
</script>

<template>
  <button
    :disabled="loading"
    :type="type"
    class="py-1 border-2 block rounded-lg bg-zinc-800 w-auto px-2 font-anton leading-5"
    :class="setcolor"
  >
    <TitleText :text="title" size="small" :font="'font-bold '+ textcolor ? textcolor : 'text-white'" v-show="!loading" />
    <SpinnerLoader size="medium" classCustom="text-white" v-show="loading" />
  </button>
</template>

<style scoped></style>
