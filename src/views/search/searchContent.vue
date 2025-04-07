<template>
    <section class="h-full overflow-auto" v-on:scroll="onScroll($event)">
    
      <template v-if="isLoading || isLoading_search">
        <PageLoader classCustom="h-[100vh] fixed inset-0" />
      </template>
      <template v-else-if="isError">
        <E404Error />
      </template>
      <EmptyError
        v-else-if="filteredData && filteredData.length === 0"
        :nameIcons="emptyIcon"
        :heading="emptyHeading"
        :subHeading="emptySubHeading"
      />
      <template v-else>
        <div class="grid grid-cols-2 gap-1 w-11/12 m-auto mt-4 -z-40">
          <div v-for="(item, index) in filteredData" :key="index">
            <CardAccessHome :data="item" :index="index + 1" v-if="toCard == 'Nounu' "/>
            <CardParentHome :data="item" :index="index + 1" v-else />
          </div>
        </div>
      </template>
    </section>
  </template>
  
  <script lang="ts" setup>
  import { computed } from "vue";
  import PageLoader from "@/components/loaders/pageLoader.vue";
  import E404Error from "@/components/errors/e404.error.vue";
  import EmptyError from "@/components/errors/empty.error.vue";
  import CardAccessHome from "../home/partials/cardAccessHome.vue";
import CardParentHome from "../home/partials/cardParentHome.vue";
import { useScrollStore } from "@/stores/scrollStore";

const { onScroll } = useScrollStore();
  
  defineProps([
    "isLoading",
    "isError",
    "filteredData",
    "emptyIcon",
    "emptyHeading",
    "emptySubHeading",
    "toCard",
    "isLoading_search"
    ]);
  </script>