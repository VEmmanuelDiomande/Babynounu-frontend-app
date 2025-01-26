<template>
  <div class="flex flex-col gap-2 w-full">
    <!-- STATS ACCORDION TO PERIOD -->
    <div class="flex w-full m-auto overflow-scroll no-scrollbar gap-2">
      <div v-for="(item, index) in state.StatsAccordingToPeriods" :key="index">
        <div
          class="flex gap-2 w-full border-[1px] border-zinc-500/50 rounded-xl p-2 px-4 justify-center"
        >
          <div class="flex min-w-max">
            <span class="font-bold text-xr"> {{ item.name }} </span>
            <IcIcons :name="item.name" :size="28" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-1">
      <!-- STATS ON AGENCY -->
      <div :class="index == 0 ? 'col-span-2' : 'col-span-1'"  v-for="(item, index) in state.StatsAgency" :key="index">
        <div
          class="flex gap-2 bg-gradient-to-r rounded-xl p-4 text-white"
          :class="item.color"
        >
          <div class="">
            <IcIcons :name="item.icon" :size="28" />
          </div>

          <div class="flex flex-col">
            <span class="text-xl font-black"> {{ item.count }} </span>
            <span class="text-sm font-light"> {{ item.name }} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IcIcons from "@/components/icons/IcIcons.vue";
import { useHomeAgencyHook } from "@/hooks/agencyHooks/homeAgencyHook";
const { state } = useHomeAgencyHook();
</script>
<style scoped></style>
