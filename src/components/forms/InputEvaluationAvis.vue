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
      <div class="contact-fields">
        <InputForm
          :id="`nom-${index}`"
          label="Nom complet"
          v-model="contact.nom"
          placeholder="Marie Curie"
           :name="`evaluation_precedentes.${index}.nom`"
          :error="errors"
          class="field"
        />

        <PhoneForm
          :id="`phone-${index}`"
          label="Téléphone"
          v-model="contact.phone"
          :name="`evaluation_precedentes.${index}.phone`"
          :error="errors"
          class="field"
        />

        <InputForm
          :id="`note-${index}`"
          label="Note (1-5)"
          v-model="contact.note"
          type="number"
          min="1"
          max="5"
          :name="`evaluation_precedentes.${index}.note`"
          :error="errors"
          class="field"
        />

        <InputForm
          :id="`commentaire-${index}`"
          label="Commentaire"
          v-model="contact.commentaire"
          placeholder="Observations importantes..."
          :name="`evaluation_precedentes.${index}.commentaire`"
          :error="errors"
          class="field commentaire"
        />
      </div>

      
    <!-- Error -->
    <span
      class="text-red-400 text-sm font-bold font-love mt-1"
      v-if="errors?.path == name"
    >
      {{ errors?.message }}
    </span>

      <button
        v-if="index > 0"
        @click="removeContact(index)"
        class="remove-button"
        title="Supprimer ce contact"
      >
        ×
      </button>
    </div>

    <div class="flex">
    <button @click="addContact"  class="add-more-button w-full px-6 py-3 bg-secondary text-white rounded-lg  transition-colors duration-200">Ajouter un autre avis</button>
   </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import InputForm from "./inputForm.vue";
import PhoneForm from "./phoneForm.vue";

interface Contact {
  nom: string;
  phone: string;
  note: string;
  commentaire: string;
}

interface ContactError {
  nom?: string;
  phone?: string;
  note?: string;
  commentaire?: string;
}

const props = defineProps({
  modelValue: {
    type: Array as () => Contact[],
    default: () => [],
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  LabelSub: {
    type: String,
    default: "",
  },
  errors: {
    type: Object,
    default: {path: '', message: ''},
  },
  maxContacts: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["update:modelValue"]);

const contacts = ref<Contact[]>([...props.modelValue]);

const addContact = () => {
  if (contacts.value.length < props.maxContacts) {
    contacts.value.push({
      nom: "",
      phone: "",
      note: "",
      commentaire: "",
    });
    emitUpdate();
  }
};

const removeContact = (index: number) => {
  contacts.value.splice(index, 1);
  emitUpdate();
};

const emitUpdate = () => {
  emit("update:modelValue", contacts.value);
};

watch(contacts.value, emitUpdate, { deep: true });
</script>

<style scoped>
.contact-references {
  border: 1px solid #e0e0e0;
  padding: 1rem;
  border-radius: 12px;
  background: #f8f9fa;
}

.contact-item {
  position: relative;
  margin-bottom: 1rem;
  padding: 1.5rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: white;
  transition: box-shadow 0.2s;
}

.contact-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contact-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.field {
  margin-bottom: 0;
}

.commentaire {
  grid-column: 1 / -1;
}

.remove-button {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  transition: background 0.2s;
}

.add-button:hover {
  background: #218838;
}

.add-button::before {
  content: "＋";
  font-size: 1.2rem;
}
</style>
