<template>
  <div class="contact-references flex flex-col font-love gap-4">
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
    <div v-for="(contact, index) in contacts" :key="index" class="contact-item">
    
      <div class="flex flex-col gap-4">
        <InputForm
        :id="`references.${index}.fullname`"
        label="Nom complet"
        v-model="contact.fullname"
        placeholder="Jean Dupont"
        :name="`references.${index}.fullname`"
        :error="errors"
      />

      <PhoneForm
        :id="`references.${index}.phone`"
        label="Téléphone"
        v-model="contact.phone"
        :name="`references.${index}.phone`"
        :error="errors"
      />
      </div>

      <button
        v-if="index > 0"
        @click="removeContact(index)"
        class="remove-button"
      >
        ×
      </button>
    </div>

    <!-- Error -->
    <span
      class="text-red-400 text-sm font-bold font-love mt-1"
      v-if="errors?.path == name"
    >
      {{ errors?.message }}
    </span>

   <div class="flex">
    <button @click="addContact"  class="add-more-button w-full px-6 py-3 bg-secondary text-white rounded-lg  transition-colors duration-200">Ajouter un contact</button>
   </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";

import InputForm from "./inputForm.vue";
import PhoneForm from "./phoneForm.vue";

interface Contact {
  fullname: string;
  phone: string;
}

interface ContactError {
  fullname?: string;
  phone?: string;
}

const props = defineProps({
  modelValue: {
    type: Array as () => Contact[],
    default: () => [],
  },
  label: {
    type: String,
    default: "",
  },
  LabelSub: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  error: {
    type: Array as () => ContactError[],
    default: () => [],
  },
  errors: {
    type: Object,
    default: {path: '', message: ''},
  },
});

const emit = defineEmits(["update:modelValue"]);

const contacts = ref<Contact[]>([...props.modelValue]);

// Ajouter un nouveau contact
const addContact = () => {
  contacts.value.push({ fullname: "", phone: "" });
  emitUpdate();
};

// Supprimer un contact
const removeContact = (index: number) => {
  contacts.value.splice(index, 1);
  emitUpdate();
};

// Émettre les mises à jour
const emitUpdate = () => {
  emit("update:modelValue", contacts.value);
};

// Surveiller les changements
watch(contacts.value, emitUpdate, { deep: true });
</script>

<style scoped>
.contact-references {
  border: 1px solid #eee;
  padding: 1rem;
  border-radius: 8px;
}

.contact-item {
  position: relative;
  margin-bottom: 0.5rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.remove-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.add-button {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.add-button:hover {
  background: #3aa876;
}
</style>
