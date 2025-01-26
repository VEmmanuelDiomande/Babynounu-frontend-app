<template>
  <IonPage id="main-content">
    <IonContent>
      <section class="h-screen">
        <!-- Header -->
        <div
          class="h-[45%] flex flex-col gap-2 items-center text-center w-10/12 pt-8 m-auto"
        >
          <img src="/images/logos/bn_logo.png" class="h-24 w-24" alt="" />
          <div class="flex flex-col font-love gap-1">
            <span class="font-anton text-lg">Baby nounus</span>
            <span class="text-ng w-11/12 m-auto"
              >Confiez votre enfant à des professionnels qualifiés et
              engagés.</span
            >
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-col gap-6 w-11/12 m-auto font-love">
          <div class="flex flex-col gap-2">
            <span class="text-lg font-extrabold"> Continuez avec </span>
            <span class="font-love text-ng"
              >Que recherchez-vous principalement sur Baby Nounus ?</span
            >
          </div>

          <div class="flex flex-col gap-4 font-love">
            <div v-for="(item, index) in DestionationToStart" :key="index">
              <div
                @click="Redirect(item.path)"
                class="border-2 flex gap-4 p-4 rounded-xl text-zinc-700"
              >
                <div class="w-14 h-14">
                  <img v-lazy="item.icon" alt="" />
                </div>

                <div class="flex flex-col gap-2 w-10/12">
                  <span class="text-ng text-primary font-bold">
                    {{ item.name }}
                  </span>
                  <span class="text-sm">{{ item.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import MainSideBar from "@/components/headers/sidebars/MainSideBar.vue";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import { StorageUtils } from "@/utils/store.utils";
import { IonContent, IonPage } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";

const DestionationToStart = [
{
    name: "Parents",

    path: "/home",
    icon: "/images/starter/icon_job_start.png",
    description:
      "Vous êtes parent et recherchez une nounou ou une ménagère ?",
  },
  {
    name: "Nounu/Ménagère",
    path: "/home/nounu",
    icon: "/images/starter/icon_famille_start.png",
    description: "Vous êtes une nounou ou une ménagère à la recherche d'un emploi ? ",
  },
  
];

const router = useRouter();
const Redirect = async (path: string) => {
  await Promise.all([StorageUtils().removeStore("nPageType"), StorageUtils().setStore("nPageType", path)]);
  location.assign(path);
};
</script>
<style scoped></style>
