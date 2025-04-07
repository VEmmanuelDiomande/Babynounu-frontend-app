<template>
  <IonPage>
    <HeaderMenuLayout
      :searchFunc="handleSearch"
      Title="Rechercher"
      PlaceholderSearch="Rechercher..."
      :searchDate="true"
      :countScroll="isCountScroll"
      :hasFilter="true"
    >
      <template v-slot:ContentSearch>
        <div class="grid grid-cols-2 gap-1 w-11/12 m-auto mt-2 mb-1 font-love z-50">
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

      <template v-slot:ContentSearchUp>
        <input
          type="text"
          placeholder="Rechercher..."
          class="h-11 outline-none font-love text-base w-full bg-transparent border-5 active:outline-none"
          v-model="useNounuStore().searchValueData"
          @keyup.enter="handleSearch"
        />
      </template>
    </HeaderMenuLayout>

    <IonContent>
      <!-- Nounus Searched content -->
      <NounuSearch v-show="isMenuSearchActived === 0" toCard="Nounu" />

      <!-- Parent content -->
      <ParentSearch v-show="isMenuSearchActived === 1" toCard="Parent" />
    </IonContent>

    <FilterModal>
      <template v-slot:content>
        <FilterContentModal />
      </template>
    </FilterModal>
  </IonPage>

  
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { IonPage, IonContent } from "@ionic/vue";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import { useSearchHook } from "@/hooks/searchHooks/search.hook";
import { useNounuStore } from "@/stores/nounu.store";
import { ScrollUtils } from "@/utils/scroll.utils";
import NounuSearch from "./nounuSearch.vue";
import ParentSearch from "./parentSearch.vue";
import { useParentStore } from "@/stores/parent.store";
import FilterModal from "@/components/modals/FilterModal.vue";
import FilterContentModal from "@/components/modals/FilterContentModal.vue";
import { useScrollStore } from "@/stores/scrollStore";

const { state } = useSearchHook();
const {  countScroll: countScrollHeader} = useScrollStore();
const isMenuSearchActived = ref(0);

const isCountScroll = computed(() => useScrollStore().countScroll);

const toggleActiveMenu = (index: number) => {
  isMenuSearchActived.value = index;
  state.verticalMenu.forEach((menu, i) => {
    menu.actived = i === index;
  });
};

const handleSearch = () => {
  if (isMenuSearchActived.value === 0) {
    useNounuStore().searchNounu(useNounuStore().searchValueData);
  } else {
    useParentStore().searchParent(useNounuStore().searchValueData);
  }
};
</script>