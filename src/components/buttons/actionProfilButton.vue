<script lang="ts" setup>
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
import TitleText from "@/components/texts/titleText.vue";
import IcIcons from "../icons/IcIcons.vue";

defineProps(["title", "type", "loading", "setcolor", "actions", "icon", "sizeText"]);
</script>

<template>
  <button
    :disabled="loading"
    :type="type"
    class="py-4  rounded-xl  bg-primary w-full font-love flex gap-1 justify-center items-center"
    :class="setcolor"
    @click="actions"
  >
  <IcIcons :name="icon" :size="24" class="text-white" />
    <TitleText :text="title" :size="sizeText ? sizeText : 'big'" font="font-bold text-center text-white " v-show="!loading" />
    <SpinnerLoader size="medium" classCustom="text-white" v-show="loading" />
  </button>
</template>

<style scoped></style>
