<template>
 <div class="flex flex-col w-full gap-1 mt-2">
          <div v-for="(item, index) in JSON.parse(Data)">
            <div class="grid grid-cols-2 gap-x-2 gap-y-4 w-full bg-slate-100 p-4 rounded-lg">
              <div
                v-for="(inItem, inIndex) in Object.keys(item)"
                class="flex flex-col gap-2 w-full"
              >
                <div class="flex flex-row items-center gap-1">
                  <IcIcons
                    :name="GetIcon(inItem)"
                    :size="24"
                    class="text-zinc-800 hidden"
                  />
                  <span class="text-xs font-bold uppercase ">
                    {{ GetName(inItem) }}
                  </span>
                </div>

                <span class="text-sm"> {{ item[inItem] }} </span>
              </div>
            </div>
          </div>
        </div>
  </template>
  <script setup lang="ts">
  import IcIcons from "@/components/icons/IcIcons.vue";
  import Heading2Text from "@/components/texts/heading2Text.vue";
  import { useProfilHook } from "@/hooks/Profile/profil.hook";
  import { formatDate } from "@/utils/date.utils";
  
  const { GetName, GetIcon } = useProfilHook();
  
  defineProps(["MenuActive", "Data"]);
  </script>
  