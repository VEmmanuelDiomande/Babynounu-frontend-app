<template>
    <div class="flex flex-col gap-8">
      <div class="flex justify-center">
        <HeadingText text="Tarification : Budget estimé" size="medium" />
      </div>
  
      <div class="flex flex-col gap-4">
        <InputForm
        label="Prix minimum"
        type="number"
        LabelSub="Indiquez le budget minimum que vous souhaitez pour une prestataire."
        name="price_min"
        placeholder="25.000 Fcfa"
        :modelValue="useProfilStore().state.PricingParentProfilValue.price_min"
        @update:modelValue="
          useProfilStore().state.PricingParentProfilValue.price_min =
            $event.target.value
        "
        :error="useProfilStore().state.in_error"
      />

      <InputForm
        label="Prix maximum"
        LabelSub="Indiquez le budget maximum que vous souhaitez pour une prestataire."
        type="number"
        name="price_max"
        placeholder="125.000 Fcfa"
        :modelValue="useProfilStore().state.PricingParentProfilValue.price_max"
        @update:modelValue="
          useProfilStore().state.PricingParentProfilValue.price_max =
            $event.target.value
        "
        :error="useProfilStore().state.in_error"
      />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import InputForm from "@/components/forms/inputForm.vue";
  import HeadingText from "@/components/texts/headingText.vue";
import { useProfilStore } from "@/stores/authProfilStore";
  import { reactive } from "vue";
  
 
  </script>
  