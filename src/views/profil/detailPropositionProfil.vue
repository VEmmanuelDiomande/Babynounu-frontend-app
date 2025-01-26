<template>
  <IonPage>
    <DetailHeader />

    <IonContent>
      <section class="w-11/12 m-auto divide-y-[1px] flex flex-col gap-6">
        <div class="flex justify-between  gap-4 font-love pt-6">
          <div class="flex flex-col gap-1">
            <span class="text-ng">Jobs Nounus</span>
            <span class="text-xl font-bold">Jean Pierre Bim</span>
          </div>

          <div class="size-16 bg-red-200 rounded-full">
            <img
              class="flex w-full h-full rounded-full object-cover"
             v-lazy="'https://i.pravatar.cc/' + 1 + '00'"
            />
          </div>
        </div>

        <!-- Salary -->
        <div class="flex flex-col gap-2 pt-6">
          <div v-for="(item, index) in Salary">
            <div class="flex items-center gap-4">
                <div class="bg-primary/10 p-2 size-14 flex justify-center items-center rounded-full">
              <IcIcons :name="item.icon" :size="30" class="text-primary" />
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-base"> {{ item.name }} </span>
              <span class="text-ng font-bold"> {{ item.price }}</span>
            </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="flex flex-col gap-4 pt-6">
            <div class="flex justify-between">
      <span class="text-lg font-anton">A Propos du job</span>

    </div>
          <article>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
            inventore voluptates sint ab officiis alias nostrum vel magnam cum.
            Amet ea quidem molestiae, cupiditate dolores harum, sint iste
            officiis numquam possimus, ipsam veniam error vitae alias. Nihil
            magnam consequatur odit vitae sit aspernatur illo est culpa, quas
            alias ipsam minima exercitationem non repellat incidunt earum quidem
            illum quae. Accusamus tenetur molestiae ex, velit natus repudiandae
            dolor. Deleniti dicta rem, voluptas consectetur esse tempora labore
            nisi, aut quos totam dolor necessitatibus fuga numquam explicabo?
            Perspiciatis atque voluptas accusantium debitis quisquam, aspernatur
            vel ab reiciendis non repellat. Vero velit fuga voluptatem
            dignissimos.
          </article>
        </div>
      </section>
    </IonContent>

    <IonFooter class="border-t-[1px]">
      <div class="flex gap-8 w-11/12 m-auto items-center py-4">
        <div class="">
          <IcIcons name="RiBookmarkLine" :size="32"></IcIcons>
        </div>
        <button
          class="flex items-center gap-2 bg-zinc-800 w-full py-4 justify-center rounded-xl text-ng font-love uppercase font-bold text-white"
        >
          Enchanger
        </button>
      </div>
    </IonFooter>
  </IonPage>
</template>

<script setup lang="ts">
import DetailHeader from "@/components/headers/DetailHeader.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { IonContent, IonFooter, IonPage } from "@ionic/vue";
import { ref } from "vue";

const Salary = ref([
  {
    name: "Salaire",
    price: "20 000 Fcfa/mois",
    icon: "RiCoinsFill",
  },
  {
    name: "Salaire",
    price: "1500 Fcfa/jour",
    icon: "RiBriefcaseFill",
  },
]);
</script>

<style scoped></style>
