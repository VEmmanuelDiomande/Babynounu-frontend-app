<template>
  
  
  <ion-menu contentId="main-content"  >
    
    <ion-content class="ion-padding bg-white"  >
      <div
        class="flex flex-col justify-between h-full w-10/12 m-auto font-love"
        
      >

        <div class="h-[25%] border-b-[1px] flex flex-col gap-4 py-4">
          <ProfileAvatar :img-profile="USER_PROFIL.value?.image?.originalUrl" className="size-14" />

          <div class="flex flex-col gap-[2px]">
            <span class="font-bold text-lg"> {{ USER_PROFIL.value?.fullname }} </span>
            <span class="font-semibold text-sm "> {{ USER_PROFIL.value?.preferences?.adress[0]?.name }} </span>
            <span class="font-meduim text-sm " v-if="USER_PROFIL.value?.age"> {{ USER_PROFIL.value?.age }} ans | {{ USER_PROFIL.value?.annees_experience }} Expérience </span>
          </div>

          <div class="flex gap-2 hidden">
            <div
              class=""
              v-for="(ca, index) in state.countStatsProfile"
              :key="index"
            >
              <div class="flex gap-1 items-center">
                <span class="text-sm font-semibold">
                  {{ ca.count }}
                </span>
                <span class="text-sm text-gray-600"> {{ ca.name }} </span>
              </div>
            </div>
          </div>
        </div>

        <!--  -->
        <div
          class="h-[50%] w-full py-8 border-b-[1px] flex flex-col gap-8 overflow-auto no-scrollbar"
        >
          <div v-for="(i, index) in state.menuSideBar" :key="index">
            <RouterLink
              :to="{name: i.link}"
              class="flex items-center gap-4"
              :class="i.actived ? '' : 'opacity-50'"
            >
              <IcIcons
                :name="i.icon"
                class="text-zinc-800/60 font-light text-xl size-8"
              />
              <span class="text-lg font-bold font-love text-zinc-800/80">{{
                i.name
              }}</span>
            </RouterLink>
          </div>
        </div>

        <!--  -->
        <div class="h-[25%] w-full py-8 flex justify-center text-zinc-800 ">
          <div class="flex flex-col items-center w-full gap-2">
            <span class="font-bold text-lg ">Invitez vos amies</span>
            <span class="text-sm font-medium text-center opacity-90 "
              >Invitez vos amies à rejoindre Baby Nounu. Agrandissons ensemble
              notre communauté.</span
            >
            <AuthButton @click="Logout" title="Se deconnecter" class="" />
            <RouterLink to="/auth/sign">
              <AuthButton title="Se connecter" class="hidden" />
            </RouterLink>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import ProfileAvatar from "@/components/avatars/profileAvatar.vue";
import AuthButton from "@/components/buttons/authButton.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { useSidebarHook } from "@/hooks/menuHooks/useSidebar.hook";
import { BASE_URL_CENTER } from "@/routes/_requests/index.request";
// import { useSidebarStore } from '@/stores/sidebar.store';
import { IonContent, IonMenu } from "@ionic/vue";
import { onMounted } from "vue";

const { state, Logout, GetUserConnect, USER_PROFIL } = useSidebarHook();

onMounted(() => {
  GetUserConnect()
  })
</script>
