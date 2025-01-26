<template>
  <!-- LISTE OF LAST ORDERS -->
  <div class="flex flex-col pb-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <span class="font-anton text-base">Activites sur les livraisons</span>
      </div>
      <div class="flex items-center bg-blue-100 rounded-lg px-2 py-1">
        <span class="text-xs font-bold">Voir</span>
        <IcIcons name="RiAddLine" class="flex w-full" :size="18" />
      </div>
    </div>

    <div class="flex flex-col gap-3 divide-y-[1px] divide-zinc-800/10">
      <div v-for="(item, index) in state.ListOfActivites" :key="index">
        <div class="flex w-full gap-4 pt-3">
          <div
            class="w-14 h-14 flex justify-center items-center rounded-lg border-[1px]"
          >
            <IcIcons
              :name="statusTypeIcon(item)"
              class="flex w-full"
              :size="18"
            />
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold"> {{ item.date }} </span>
              <span class="text-desc"> {{ item.title }} </span>
            </div>

            <div class="flex gap-1">
              <BadgeButton
                :title="item.status"
                type="button"
                :setcolor="statusTypeBgColor(item)"
                textcolor="text-white"
              />
              <BadgeButton
                :title="statusTypePrice(item) + ' '+ item.price"
                type="button"
                :textcolor="statusTypeColor(item)"
                setcolor="bg-zinc-500/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BadgeButton from "@/components/buttons/BadgeButton.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { useHomeAgencyHook } from "@/hooks/agencyHooks/homeAgencyHook";
const { state } = useHomeAgencyHook();

const statusTypeBgColor = (item: any) => {
  return item.status_type == 0
    ? "bg-sky-500"
    : item.status_type == 1
    ? "bg-teal-500"
    : item.status_type == 2
    ? "bg-red-500"
    : "bg-yellow-500";
};

const statusTypeColor = (item: any) => {
  return item.status_type == 0
    ? "text-sky-500"
    : item.status_type == 1
    ? "text-teal-500"
    : item.status_type == 2
    ? "text-red-500"
    : "text-yellow-500";
};

const statusTypeIcon = (item: any) => {
  return item.status_type == 0
    ? "RiBox3Line"
    : item.status_type == 1
    ? "RiSpaceShipLine"
    : item.status_type == 2
    ? "RiDeleteBin3Line"
    : "RiSendPlaneLine";
};

const statusTypePrice = (item: any) => {
  return item.status_type == 0
    ? "~"
    : item.status_type == 1
    ? "+"
    : item.status_type == 2
    ? "-"
    : "!";
};
</script>
<style scoped></style>
