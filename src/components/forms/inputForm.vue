
<template>
  <div class="flex flex-col gap-1 w-full relative">
    <div class="flex flex-col gap-1 w-full">
      <label
        class="text-label font-love font-semibold text-zinc-800 rounded-md z-50"
        :for="'id_input_' + name"
        >{{ label }}</label
      >
      <span class="text-sm font-love font-normal text-zinc-500" v-if="LabelSub">
        {{ LabelSub }}
      </span>
    </div>

    <div class="flex w-full relative">
      <input
        :id="id"
        :type="_type"
        :value="modelValue"
        @input="onInput"
        :placeholder="placeholder"
        class="w-full text-sm font-semibold border-[1px] rounded-xl h-14 px-4 text-zinc-700 font-love placeholder:text-zinc-500 placeholder:font-love border-zinc-300/70 bg-white/90  font-ligth outline-none focus:border-2 focus:border-primary"
        :name="name"
      />
    </div>
    <IcIcons
      @click="togglePasswordVisibility"
      class="absolute right-2 top-11"
      v-if="type == 'password'"
      :name="_type == 'password' ? 'RiEyeLine' : 'RiEyeCloseLine'"
      :size="20"
    />
    <div class="flex items-center gap-1 text-primary" v-if="info.length">
      <IcIcons :name="'RiInformation2Line'" :size="20" />
      <span class="text-xs font-love font-bold">
        {{ info }}
      </span>
    </div>
    <span
      class="text-red-400 text-sm font-bold font-love mt-1"
      v-if="error?.path == name"
    >
      {{ error?.message }}
    </span>

  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import IcIcons from "../icons/IcIcons.vue";

// Définir les props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    // required: true,
  },
  id: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  label: {
    type: String,
    default: "",
  },
  LabelSub: {
    type: String,
    default: "",
  },
  info: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  error: {
    type: Object,
    default: () => ({ path: "", message: "" }),
  },
});

const _type = ref(props.type);

const togglePasswordVisibility = () => {
  if (_type.value == "password") {
    _type.value = "text";
  } else {
    _type.value = "password";
  }
};

// Définir les emits
const emit = defineEmits(["update:modelValue"]);

// Gérer l'événement input
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

