



<template>
    <div class="flex flex-col gap-2 z-50 font-love">
      <div class="flex flex-col gap-1 w-full ">
        <label
          class="text-label font-love font-semibold text-zinc-800 rounded-md z-50"
          :for="'id_input_' + name"
          >{{ label }}</label
        >
        <span class="text-sm font-love font-normal text-zinc-500" v-if="LabelSub">
          {{ LabelSub }}
        </span>
      </div>
  
      <div class="flex flex-wrap gap-2">
        <!-- Affichage des tags sélectionnés -->
        <div
          v-for="(selected, index) in selectedValues"
          :key="index"
          @click="removeTag(selected)"
          class="flex items-center gap-2 bg-primary text-white px-2 py-1 rounded-full cursor-pointer hover:bg-primary-dark"
          
        >
          <span class="text-sm" >{{ selected[optionName] }}</span>
          <span class="font-semibold">&times;</span>
        </div>
      </div>
  
      <div class="flex flex-wrap gap-2 ">
        <!-- Options à sélectionner -->
        <label
          v-for="(option) in options"
          :key="option[optionName]"
          class="cursor-pointer px-2 py-1 rounded-lg border border-zinc-300 bg-white shadow-xs hover:bg-zinc-100 transition"
          @click="toggleSelection(option)"
        >
         
          <span class="text-zinc-700 text-sm">{{ option[optionName] }}</span>
        </label>
      </div>
  
      <span
        class="text-red-400 text-sm font-bold mt-1"
        v-if="error?.path == name"
      >
        {{ error?.message }}
      </span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, ref } from "vue";
  
  const props = defineProps({
    label: { type: String, required: true },
    options: { type: Array as () => any[], required: true },
    modelValue: { type: Array as () => string[], default: () => [] },
    optionName: { type: String, required: true },
    LabelSub: { type: String, default: "" },
    name: { type: String, required: true },
    error: { type: Object, default: null },
  });
  
  const emit = defineEmits(["update:modelValue"]);
  
  const selectedValues = ref<any[]>(props.modelValue);
  
  const toggleSelection = (value: string) => {
    if (selectedValues.value.includes(value)) {
      selectedValues.value = selectedValues.value.filter((item) => item !== value);
    } else {
      selectedValues.value.push(value);
    }
    emit(
      "update:modelValue",
      Array.from(new Set(selectedValues.value)).filter(
        (item, index, self) => self.indexOf(item) === index
      )
    );
  };
  // .map((item) => item.id)
  
  const removeTag = (value: string) => {
    selectedValues.value = selectedValues.value.filter((item) => item !== value);
    emit("update:modelValue", selectedValues.value);
  };
  </script>
  
  
  