<script lang="ts" setup>
import SpinnerLoader from "@/components/loaders/spinnerLoader.vue";
import TitleText from "@/components/texts/titleText.vue";
import IcIcons from "../icons/IcIcons.vue";

defineProps([
  "title",
  "type",
  "loading",
  "setcolor",
  "actions",
  "id",
  "textcolor",
  "classCustom",
  "icon",
  "disabled"
]);
</script>

<template>
  <button
    :disabled="loading || disabled"
    :type="type"
    class="py-4 rounded-xl w-full font-love flex gap-1 justify-center items-center cursor-pointer"
    :class="setcolor ? setcolor : 'bg-primary ring-1  ring-primary '"
    @click="actions"
    :id="id"
  >
  <IcIcons v-if="icon" :name="icon" :size="24" :class="textcolor ? textcolor : 'text-white'" />
    <TitleText
      :text="title"
      size="medium"
      font="font-bold text-center "
      :class="textcolor ? textcolor : 'text-white'"
      v-show="!loading"
    />
    <SpinnerLoader
      size="medium"
      :classCustom="textcolor ? textcolor : 'text-white'"
      v-show="loading"
    />
  </button>
</template>

<style scoped></style>
