<template>
  <IonPage>
    <HeaderMenuLayout
      :searchNounu="searchNounu"
      Title="Rechercher"
      PlaceholderSearch="Rechercher..."
      :countScroll="countScroll"
    >
      <template v-slot:ContentSearch>
        <div class="grid grid-cols-3 gap-1 w-11/12 m-auto mt-2 mb-1">
          <div v-for="(menu, index) in state.verticalMenu" :key="index">
            <div
              @click="toggleActiveMenu(index)"
              class="h-8 flex items-center justify-center rounded-xl"
              :class="menu.actived ? 'border-b-1 bg-primary' : 'border-[1px]'"
            >
              <span
                class="text-sm font-bold"
                :class="menu.actived ? 'text-white' : 'text-primary'"
                >{{ menu.name }}</span
              >
            </div>
          </div>
        </div>
      </template>
    </HeaderMenuLayout>

    <IonContent :scroll-events="true" @ionScroll="onScroll($event)">
      <template v-if="LoadingNounus">
        <PageLoader />
      </template>
      <template v-else-if="ISErrorNounus">
        <div class="w-full flex justify-center items-center text-red-500">
          Une erreur est survenue lors du chargement des données.
        </div>
      </template>
      <template v-else>
        <div class="grid grid-cols-2 gap-1 w-11/12 m-auto mt-4 -z-40">
          <div v-for="(nounu, index) in filteredNounus" :key="index">
            <CardAccessHome :data="nounu" :index="index + 1" />
          </div>
        </div>
      </template>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import { useSearchHook } from "@/hooks/searchHooks/search.hook";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import { IonContent, IonPage, IonSpinner } from "@ionic/vue";
import CardAccessHome from "../home/partials/cardAccessHome.vue";
import { useNounuHook } from "@/hooks/nounuHooks/nounu.hooks";
import { computed, onMounted, ref, watch } from "vue";
import { ScrollUtils } from "@/utils/scroll.utils";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useQuery } from "@tanstack/vue-query";
import { useNounuStore } from "@/stores/nounu.store";
import PageLoader from "@/components/loaders/pageLoader.vue";

const { state } = useSearchHook();
const { state: stateNounu } = useNounuHook();

const { countScroll, onScroll } = ScrollUtils();

// Ecrire une fonction qui permet de modifier la valeur de actived l'élément actif dans state.verticalMenu
const toggleActiveMenu = (index: number) => {
  state.verticalMenu.forEach((menu, i) => {
    menu.actived = i === index;
  });
};

defineProps(["Type"]);

const ListNounus = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.NOUNU_ALL);

const {
  data: DataNounus,
  error: ErrorNounus,
  isLoading: LoadingNounus,
  isError: ISErrorNounus,
} = useQuery({
  queryKey: ["ListNounus"],
  queryFn: ListNounus,
});

// Délai avant actualisation des résultats de recherche
let searchTimeout: NodeJS.Timeout;

watch(
  () => useNounuStore().searchValueData,
  (newSearchValue) => {
    if (searchTimeout) clearTimeout(searchTimeout); // Annuler l'ancien délai

    searchTimeout = setTimeout(() => {
      searchNounu(newSearchValue);
    }, 500); // Délai de 500ms avant de lancer la recherche
  }
);

// Recherche de nounu
const searchNounu = (searchValue: string) => {
  useNounuStore().DataNounus = [];
  const filteredData = useNounuStore().DataHiddenNounus.filter((nounu: any) => {
    const name = nounu.fullname.toLowerCase();
    return name.includes(searchValue.toLowerCase());
  });
  useNounuStore().DataNounus = filteredData;
};

// Utilisation de computed pour filtrer les nounus selon la recherche
const filteredNounus = computed(() => {
  const searchValue = useNounuStore().searchValueData?.toLowerCase() || "";
  return useNounuStore().DataHiddenNounus.filter((nounu: any) =>
    nounu.fullname.toLowerCase().includes(searchValue)
  );
});

onMounted(() => {
  useNounuStore().DataHiddenNounus = DataNounus;
});
</script>

<style scoped>
/* Vous pouvez personnaliser ici le style du loader ou d'autres éléments */
</style>
