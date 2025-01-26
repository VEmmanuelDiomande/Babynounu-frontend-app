<script lang="ts" setup>
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
import TitleText from "@/components/texts/titleText.vue";

defineProps(["title", "type", "loading", "setcolor", "actions", "id"]);
</script>

<template>
  <button
    :disabled="loading"
    :type="type"
    class="py-4  rounded-xl  bg-primary w-full font-love flex justify-center items-center"
    :class="setcolor"
    @click="actions"
    :id="id"
  >
    <TitleText :text="title" size="big" font="font-bold text-center text-white " v-show="!loading" />
    <SpinnerLoader size="medium" classCustom="text-white" v-show="loading" />
  </button>
</template>

<style scoped></style>
