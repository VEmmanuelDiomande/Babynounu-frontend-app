<script lang="ts" setup>
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
import TitleText from "@/components/texts/titleText.vue";

defineProps(["title", "type", "loading", "setcolor", 'isTextChange']);
</script>

<template>
  <button
    :disabled="loading || isTextChange"
    :type="type"
    class="py-4 border-2 block rounded-lg  w-full font-love" :class="isTextChange ? 'bg-zinc-800' :  'bg-zinc-400'"
   
  >
    <TitleText :text="title" size="big" font="font-bold text-white" v-show="!loading" />
    <SpinnerLoader size="medium" classCustom="text-white" v-show="loading" />
  </button>
</template>

<style scoped></style>
