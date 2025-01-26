<template>

  <RouterLink to="/chat/1" >
    <div class="flex flex-col gap-4 w-full  m-auto divide-y-[1px] px-4 font-love mb-8 text-zinc-800">
      <div v-for="(Message, index) in Messages">
        <div class="mt-4 flex flex-row gap-4">
          <!-- Avatar -->
          <div class="size-14 rounded-full bg-slate-200">
            <img
      class="flex w-full h-full rounded-full object-cover"
     v-lazy="'https://i.pravatar.cc/' + (index+1) + '00'"
    />
          </div>

          <!-- Content -->
          <div class="w-[calc(100%-70px)] flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="font-bold text-ng"> {{ Message.name }} </span>
              <span class="text-sm text-zinc-800 font-medium"> {{  dayjs(Message.createdAt).fromNow() }} </span>
            </div>

            <!-- Lu and recent message -->
            <div class="flex gap-2 items-center w-full">
              <IcIcons name="RiCheckDoubleLine" :class="Message.viewed ? 'text-secondary' : 'text-gray-400'" />
              <span class="truncate w-full">{{ Message.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
 
   

</template>

<script lang="ts" setup>
defineProps(["Messages"]);
import IcIcons from "@/components/icons/IcIcons.vue";
import { IonButtons, IonMenuButton } from "@ionic/vue";
import dayjs from "dayjs";
</script>
