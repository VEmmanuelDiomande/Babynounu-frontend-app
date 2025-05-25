<style>
.blocks {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

ion-modal {
  --height: auto;
  --border-radius: 2rem 2rem 0px 0px;
}
</style>

<template>
  <ion-modal ref="modal" trigger="open-modal" :initial-breakpoint="1" :breakpoints="[0, 1]">
    <div class="block rounded-3xl h-full pt-8 px-4">
      <span class="font-anton text-lg">
        Ajouter une nouvelle localisation
      </span>

      <div class="flex flex-col mt-4">
        <!-- <SelectForm
          label="ville / commune"
          placeholder="Yopougon"
          :options="options"
          option-name="test"
          @update:modelValue="
            state.in_standard.name = $event.target.value
          "
        /> -->
        <InputForm
          type="number"
          label="Tarif"
          placeholder="1000 F"
          :modelValue="state.in_standard.price"
          @update:modelValue="
            state.in_standard.price = $event.target.value
          "
        />
      </div>
    </div>

    <IonFooter class="shadow-sm p-4">
      <div class="flex gap-1 shadow-sm">
        <AuthButton title="Ajouter"   :actions="() => AddNewPlace('Standard', state.in_standard, dismiss)" />
      </div>
    </IonFooter>
  </ion-modal>
</template>

<script lang="ts" setup>
import AuthButton from "@/components/buttons/authButton.vue";
import InputForm from "@/components/forms/inputForm.vue";
import SelectForm from "@/components/forms/selectForm.vue";
import { useCreateAgencyHook } from "@/hooks/agencyHooks/createAgencyHook";
// import IcIcons from "@/components/icons/IcIcons.vue";
import { IonFooter, IonModal } from "@ionic/vue";
import { ref } from 'vue';

const modal = ref();

const dismiss = () => modal.value.$el.dismiss();

const options:any = ref(["Yopougon", "Dakar"]);
const { state, AddNewPlace } = useCreateAgencyHook();
</script>
