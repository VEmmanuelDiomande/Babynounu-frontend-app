<template>
  <div class="flex flex-col border-[1px] justify-center items-center relative rounded-full" :class="className">
    <RiUser3Line :size="sizeIcon ?? 24" class="opacity-70" v-if="!imgProfile"/>
    <img class="object-cover w-full h-full rounded-full"v-lazy="imgProfile" v-else />

    <div class=" size-10 border-4 border-white absolute bg-zinc-800 bottom-0 rounded-full -right-1 flex justify-center items-center" v-if="isEdit">
        <RiCamera2Fill size="16" class="text-white " />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IonImg } from "@ionic/vue";
import { RiCamera2Fill, RiUser3Line } from "@remixicon/vue";

defineProps(['imgProfile', 'className', 'isEdit', 'sizeIcon'])
</script>
