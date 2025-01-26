<template>
    <div class="flex flex-col gap-6">
      <div class="font-love flex flex-col gap-1">
      <textarea
        @input="
          (event) => {
            $emit('update:modelValue', event);
            handleInput()
          }
        "
        ref="textarea"
        rows="1"
        :value="modelValue"
        class="resize-none w-full p-2 border-[1px] rounded "
        placeholder="Tapez votre texte ici..."
        :maxlength="sizeText"
        style="min-height: 100px;"
      ></textarea>
      <div class="text-sm text-gray-500 mt-1">
        {{ text.length }}/{{ sizeText }} caractères
      </div>

      
    </div>
    <IonText class="" >
        <p class="text-base font-love" > {{ info }} </p>
      </IonText>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { IonText } from '@ionic/vue';
import { ref, onMounted } from 'vue';

defineProps(['content', 'info', 'sizeText', 'modelValue'])
  
  const text = ref('');
  const textarea = ref<HTMLTextAreaElement | null>(null);
  
  const adjustTextareaHeight = () => {
    if (textarea.value) {
      textarea.value.style.height = '45px';
      textarea.value.style.height = textarea.value.scrollHeight + 'px';
    }
  };
  
  const handleInput = () => {
    adjustTextareaHeight();
  };
  
  onMounted(() => {
    adjustTextareaHeight();
  });
  </script>
  
  <style scoped>
  textarea {
    overflow-y: hidden;
    height: '80px';
  }
  </style>
  