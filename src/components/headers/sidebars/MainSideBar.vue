<template>
  <ion-menu contentId="main-content">
    <ion-content class="ion-padding bg-white">
      <div class="flex flex-col justify-between h-full w-10/12 m-auto font-love">
        <!-- Section profil utilisateur -->
        <div class="h-[25%] border-b-[1px] flex flex-col gap-4 py-4">
          <ProfileAvatar 
            :img-profile="USER_PROFIL.value?.image?.originalUrl" 
            className="size-14" 
          />

          <div class="flex flex-col gap-[2px]">
            <span class="font-bold text-lg">{{ USER_PROFIL.value?.fullname }}</span>
            <span class="font-semibold text-sm">{{ USER_PROFIL.value?.preferences?.adress[0]?.name || 'Adresse non définie' }}</span>
            <span 
              class="font-medium text-sm" 
              v-if="USER_PROFIL.value?.age"
            >
              {{ USER_PROFIL.value?.age }} ans | {{ USER_PROFIL.value?.annees_experience || '0' }} Expérience
            </span>
          </div>

          <!-- Statistiques du profil (actuellement masquées) -->
          <div class="flex gap-2 hidden">
            <div
              v-for="(ca, index) in state.countStatsProfile"
              :key="index"
            >
              <div class="flex gap-1 items-center">
                <span class="text-sm font-semibold">{{ ca.count }}</span>
                <span class="text-sm text-gray-600">{{ ca.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section menu de navigation -->
        <div class="h-[50%] w-full py-8 border-b-[1px] flex flex-col gap-8 overflow-auto no-scrollbar">
          <div v-for="(item, index) in state.menuSideBar" :key="index">
            <RouterLink
              :to="{ name: item.link }"
              class="flex items-center gap-4"
              :class="{ 'opacity-50': !item.actived }"
            >
              <IcIcons
                :name="item.icon"
                class="text-zinc-800/60 font-light text-xl size-8"
              />
              <span class="text-lg font-bold font-love text-zinc-800/80">
                {{ item.name }}
              </span>
            </RouterLink>
          </div>
        </div>

        <!-- Section pied de page -->
        <div class="h-[25%] w-full py-8 flex justify-center text-zinc-800">
          <div class="flex flex-col items-center w-full gap-2">
            <span class="font-bold text-lg">Invitez vos amies</span>
            <span class="text-sm font-medium text-center opacity-90">
              Invitez vos amies à rejoindre Baby Nounu. Agrandissons ensemble
              notre communauté.
            </span>
            <AuthButton 
              :actions="Logout" 
              title="Se déconnecter" 
            />
            <RouterLink to="/auth/sign" v-if="!useUserStore().isLogged">
              <AuthButton title="Se connecter" />
            </RouterLink>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { IonContent, IonMenu } from "@ionic/vue";
import { useRouter } from "vue-router";
import ProfileAvatar from "@/components/avatars/profileAvatar.vue";
import AuthButton from "@/components/buttons/authButton.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { useSidebarHook } from "@/hooks/menuHooks/useSidebar.hook";
import { useUserStore } from "@/stores/user.store";

// Récupération des données et fonctions du hook
const { state, Logout, GetUserConnect, USER_PROFIL } = useSidebarHook();
const router = useRouter();

// Initialisation des données au montage du composant
onMounted(() => {
  GetUserConnect();
});
</script>

<style scoped>
/* Masquer la barre de défilement tout en permettant le défilement */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Animation pour les liens */
.router-link-active {
  color: var(--ion-color-primary);
  font-weight: bold;
  transition: all 0.3s ease;
}
</style>
