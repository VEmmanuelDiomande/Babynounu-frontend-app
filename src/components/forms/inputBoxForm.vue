<template>
  <div class="flex flex-col gap-2 z-50 font-love">
    <div class="flex flex-col gap-1 w-full">
      <label
        class="text-label font-love font-semibold text-zinc-800 rounded-md z-50"
        :for="'id_input_' + name"
      >
        {{ label }}
      </label>
      <span class="text-sm font-love font-normal text-zinc-500" v-if="LabelSub">
        {{ LabelSub }}
      </span>
    </div>

    <div class="flex flex-wrap gap-1">
      <!-- Affichage des tags sélectionnés -->
      <div
        v-for="(selected, index) in selectedValues"
        :key="index"
        @click="removeTag(selected)"
        class="flex items-center gap-2 bg-primary text-white px-2 py-1 rounded-full cursor-pointer hover:bg-primary-dark text-sm font-semibold"
      >
        <span class="text-sm">{{ selected[optionName] }}</span>
        <span class="font-semibold">&times;</span>
      </div>
    </div>

    <!-- Champ de recherche -->
    <input
      v-if="totalPages > 1"
      v-model="searchQuery"
      :disabled="totalPages <= 1"
      type="text"
      placeholder="Rechercher..."
      class="w-full border-[1px] text-sm font-semibold rounded-xl h-14 px-4 text-zinc-700 font-love placeholder:text-zinc-500 placeholder:font-love border-zinc-300/70 bg-white/90 font-ligth outline-none focus:border-2 focus:border-primary"
      :class="
        totalPages <= 1 ? 'cursor-not-allowed opacity-55 bg-slate-300' : ''
      "
    />

    <div class="flex flex-wrap gap-2">
      <!-- Options à sélectionner -->
      <label
        v-for="(option, index) in paginatedOptions"
        :key="option[optionName]"
        class="cursor-pointer px-2 py-1 rounded-lg border border-zinc-300 shadow-xs transition text-sm"
        :class="
          selectedValues.some(
            (_option) => _option[optionName] === option[optionName]
          )
            ? 'bg-slate-300 text-white'
            : 'bg-white'
        "
        @click.stop="toggleSelection(option)"
      >
        <span class="text-zinc-700 text-sm">{{ option[optionName] }}</span>
      </label>
    </div>

    <!-- Pagination -->
    <div
      class="flex justify-center text-sm font-bold opacity-75 items-center gap-2 mt-2"
      v-if="totalPages > 1"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded-lg"
        :class="{ 'opacity-50': currentPage === 1 }"
      >
        <IcIcons name="RiArrowLeftSLine" :size="20" />
      </button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border rounded-lg"
        :class="{ 'opacity-50': currentPage === totalPages }"
      >
      <IcIcons name="RiArrowRightSLine" :size="20" />
      </button>
    </div>

    <span
      class="text-red-400 text-sm font-bold mt-1"
      v-if="error?.path === name"
    >
      {{ error?.message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch } from "vue";
import IcIcons from "../icons/IcIcons.vue";

interface Option {
  [key: string]: any;
}

const props = defineProps({
  label: { type: String, required: true },
  options: { type: Array as () => Option[], required: true },
  modelValue: { type: Array as () => Option[], default: () => [] },
  optionName: { type: String, required: true },
  LabelSub: { type: String, default: "" },
  name: { type: String, required: true },
  error: {
    type: Object as () => { path: string; message: string } | null,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectedValues = ref<Option[]>(props.modelValue);
const searchQuery = ref<string>("");
const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(10);

// Watch for changes in modelValue and update selectedValues accordingly
watch(
  () => props.modelValue,
  (newValue) => {
    selectedValues.value = newValue;
  },
  { deep: true }
);

const filteredOptions = computed(() => {
  return props.options?.filter((option) =>
    option[props.optionName]
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredOptions.value?.length / itemsPerPage.value);
});

const paginatedOptions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredOptions.value?.slice(start, end);
});

const toggleSelection = (value: Option) => {
  const isSelected = selectedValues.value?.some(
    (_option) => _option[props.optionName] === value[props.optionName]
  );

  if (isSelected) {
    selectedValues.value = selectedValues.value?.filter(
      (item) => item[props.optionName] !== value[props.optionName]
    );
  } else {
    selectedValues.value.push(value);
  }

  emit("update:modelValue", [...new Set(selectedValues.value)]);
};

const removeTag = (value: Option) => {
  selectedValues.value = selectedValues.value?.filter(
    (item) => item[props.optionName] !== value[props.optionName]
  );
  emit("update:modelValue", selectedValues.value);
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>
