<template>
  <section class="h-full overflow-auto" v-on:scroll="onScroll($event)">
    <template v-if="isLoading || isLoading_search">
      <PageLoader classCustom="h-[100vh] fixed inset-0" />
    </template>
    <template v-else-if="isError">
      <E404Error />
    </template>
    <EmptyError
      v-else-if="filteredData && filteredData.length === 0"
      :nameIcons="emptyIcon"
      :heading="emptyHeading"
      :subHeading="emptySubHeading"
    />
    <template v-else>
      <div class="grid grid-cols-2 gap-1 w-11/12 m-auto mt-4 -z-40">
        <div v-for="(item, index) in filteredData" :key="index">
          <CardAccessHome
            :data="item"
            :index="index + 1"
            v-if="toCard == 'Nounu'"
          />
          <CardParentHome :data="item" :index="index + 1" v-else />
        </div>
      </div>

      <!-- Bloc de pagination -->
      <div
        v-if="pagination && pagination.page < pagination.totalPages"
        class="flex justify-center items-center my-8"
      >
        <button
          @click="handlePageChange(pagination.page + 1)"
          class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors duration-300 flex items-center gap-2"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            <div
              class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
            ></div>
            Chargement...
          </template>
          <template v-else>
            Voir plus
            <i class="ri-arrow-down-line"></i>
          </template>
        </button>
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import PageLoader from "@/components/loaders/pageLoader.vue";
import E404Error from "@/components/errors/e404.error.vue";
import EmptyError from "@/components/errors/empty.error.vue";
import CardAccessHome from "../home/partials/cardAccessHome.vue";
import CardParentHome from "../home/partials/cardParentHome.vue";
import { useScrollStore } from "@/stores/scrollStore";

const { onScroll } = useScrollStore();

const props = defineProps({
  isLoading: Boolean,
  isError: Boolean,
  filteredData: Array<any>,
  pagination: Object,
  emptyIcon: String,
  emptyHeading: String,
  emptySubHeading: String,
  toCard: String,
  isLoading_search: Boolean,
});

const emit = defineEmits(["pageChange"]);

// Fonction pour gérer le changement de page
const handlePageChange = (page: number) => {
  emit("pageChange", page);
};

// Fonction pour générer les numéros de page à afficher
const getPageNumbers = () => {
  if (!props.pagination) return [];

  const { currentPage, totalPages } = props.pagination;
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    // Afficher toutes les pages si le nombre total est inférieur à maxPagesToShow
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Calculer les pages à afficher
  let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
};
</script>
