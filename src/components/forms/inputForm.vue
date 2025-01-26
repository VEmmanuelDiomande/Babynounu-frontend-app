<script setup lang="ts">
import { IonInput, IonItem } from "@ionic/vue";
import { ref, onMounted } from "vue";
import IcIcons from "../icons/IcIcons.vue";

const props = defineProps([
  "label",
  "type",
  "name",
  "placeholder",
  "error",
  "disabled",
  "isSlected",
  "info",
  "data",
  "dataName",
  "modelValue",
  "LabelSub"
]);
const isType = ref();
const TextValue = ref("");
const IsArrayTextValue: any = ref([]);
const emit = defineEmits(["update:modelValue"]);

onMounted(() => {
  isType.value = props.type;
});

const AddToInput = (value: any) => {
  if (IsArrayTextValue.value.includes(value)) {
    // Si l'élément est déjà présent, on le retire
    IsArrayTextValue.value = IsArrayTextValue.value.filter(
      (_value: any) => _value !== value
    );
  } else {
    // Sinon, on l'ajoute
    IsArrayTextValue.value.push(value);
  }

  TextValue.value = IsArrayTextValue.value.join("|");
  emit("update:modelValue", TextValue.value);
};
</script>

<template>
  <div class="flex flex-col gap-1 w-full relative">
    <div class="flex flex-col mb-1 gap-1">
      <label
        class="text-label font-love font-semibold text-zinc-800 rounded-md z-50 py-1"
        :for="'id_input_' + name"
        >{{ label }}</label
      >
      <span class="text-sm font-love font-normal text-zinc-500" v-if="LabelSub" > {{ LabelSub }} </span>
    </div>
    <div class="flex w-full relative">

      <input
        :type="isType"
        class="w-full border-[1px] text-zinc-700 font-love placeholder:text-zinc-500 placeholder:font-normal text-base border-zinc-300/40 bg-white/90 rounded-lg py-4 px-4 font-ligth outline-none focus:border-2 focus:border-primary"
        :name="name"
        :id="'id_input_' + name"
        :placeholder="placeholder"
        :disabled="disabled || dataName ? true : false"
        :value="modelValue || TextValue"
        @input="
          (event) => {
            $emit('update:modelValue', event);
          }
        "
        v-if="!dataName"
      />

      <input
        :type="isType"
        class="w-full border-[1px] text-zinc-700 font-love placeholder:text-zinc-500 placeholder:font-normal text-base border-zinc-300/70 bg-white/90 rounded-lg py-4 px-4 font-ligth outline-none focus:border-2 focus:border-primary"
        :name="name"
        :id="'id_input_' + name"
        :placeholder="placeholder"
        :disabled="disabled || dataName ? true : false"
        v-model="TextValue"
        v-if="dataName"
      />
    </div>

    <label
      :for="'id_input_' + name"
      @click="isType == 'password' ? (isType = 'text') : (isType = 'password')"
      v-if="type == 'password'"
      class="absolute right-2 top-11"
    >
      <IcIcons
        :name="isType == 'password' ? 'RiEyeLine' : 'RiEyeCloseLine'"
        :size="20"
      />
    </label>

    <div class="flex items-center gap-1 text-primary" v-if="info">
      <IcIcons :name="'RiInformation2Line'" :size="20" />
      <span class="text-xs font-love font-bold">
        {{ info }}
      </span>
    </div>

    <span class="text-red-400 text-sm font-bold" v-if="error?.path == name">
      {{ error?.message }}
    </span>

    <div class="flex flex-wrap gap-1 mt-2" v-if="data">
      <div v-for="(i, index) in data" :key="index">
        <div
          @click="AddToInput(i[dataName])"
          class="flex gap-1 px-2 py-1 border border-gray-300 font-medium bg-gray-100 rounded-xl text-sm font-love items-center"
          :class="IsArrayTextValue.includes(i[dataName]) ? 'opacity-50' : ''"
        >
          <span class="">{{ i[dataName] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
