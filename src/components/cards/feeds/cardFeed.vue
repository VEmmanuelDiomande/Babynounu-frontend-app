<template>
  <div class="rounded-2xl p-3 border-[0px] flex flex-col gap-2">
    <CardFeedHeader :dataFeedHeader="dataFeed" />

    <CardFeedFile />

    <CardFeedActions />
  </div>
</template>

<script setup lang="ts">
import CardFeedActions from "./CardFeedActions.vue";
import CardFeedFile from "./CardFeedFile.vue";
import CardFeedHeader from "./cardFeedHeader.vue";

defineProps(["dataFeed"]);
</script>
