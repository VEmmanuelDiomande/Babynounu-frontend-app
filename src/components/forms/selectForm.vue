<template>
 
 <div class="flex flex-col gap-2 w-full relative">
  <div class="flex flex-col gap-1">
      <label
        class="text-label font-love font-semibold text-zinc-800 rounded-md z-50 py-1"
        :for="'id_input_' + name"
        >{{ label }}</label
      >
      <span class="text-sm font-love font-normal text-zinc-500" > {{ LabelSub }} </span>
    </div>
    <select
     
      :name="name"
      class="w-full border-[1px] text-zinc-700 font-love placeholder:text-zinc-500 placeholder:font-normal text-base border-zinc-300/40 bg-white/90 rounded-lg py-4 px-4 font-ligth outline-none focus:border-2 focus:border-primary"
      :id="'id_input_' + name"
      :placeholder="placeholder"
      :value="modelValue"
        @input="
          (event) => {
            $emit('update:modelValue', event);
          }
        "
        
    >
    <option value=""> {{ placeholder }} </option>
      <option
        :value="option[optionName]"
        v-for="(option, index) in options"
        :key="index"
      >
        {{ option[optionName] }}
      </option>
    </select>
    <span class="text-red-400 text-sm font-bold" v-if="error?.path == name">
      {{ error?.message }}
    </span>


  </div>
</template>

<script setup lang="ts" >
import { IonItem, IonSelect, IonSelectOption } from "@ionic/vue";
import { ref, defineProps } from 'vue';

const props = defineProps([
  "label",
  "type",
  "name",
  "placeholder",
  "error",
  "disabled",
  "options",
  "optionName",
  "modelValue",
  "LabelSub"
]);


// Variable locale pour suivre la sélection
const selectedValue = ref(props.modelValue);


</script>

<style></style>
