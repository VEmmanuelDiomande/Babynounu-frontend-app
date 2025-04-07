<template>
  <section class="grid grid-cols-2 gap-1 w-11/12 m-auto mt-2 mb-4">
    <div @click="OpenEchange" v-if="isOwner == false">
      <ActionProfilButton
        sizeText="medium"
        icon="RiMessage3Line"
        setcolor="bg-zinc-800 text-lg"
        title="Echanger"
      />
    </div>

    <div v-if="isOwner != false" @click="OpenEditProfil">
      <ActionProfilButton
        sizeText="medium"
        icon="RiEditLine"
        setcolor="bg-zinc-800 text-lg"
        title="Editer"
      />
    </div>

    <div
      v-if="isOwner != false && useUserStore().typeProfil == 'parent'"
      @click="OpenCreatePost"
    >
      <ActionProfilButton
        sizeText="medium"
        icon="RiQuillPenAiLine"
        setcolor="bg-secondary text-lg"
        title="Poster"
      />
    </div>

    <button :disabled="isOwner == false"
      v-if="useUserStore().typeProfil == 'nounu'"
      @click="Available"
    >
      <CntAvailableProfil :status="Data.status" :isOwner="isOwner" />
    </button>
  </section>
</template>
<script lang="ts" setup>
import ActionProfilButton from "@/components/buttons/actionProfilButton.vue";
import { useProfilHook } from "@/hooks/Profile/profil.hook";
import { useUserStore } from "@/stores/user.store";
import { StorageUtils } from "@/utils/store.utils";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CntAvailableProfil from "./cntAvailableProfil.vue";

const props = defineProps(["Data", "isOwner", "type"]);

const router = useRouter();

const {
  isAbonnement: _isAbonnement,
  OpenEditProfil: _OpenEditProfil,
  OpenEchange: _OpenEchange,
  OpenToggleProfil: _OpenToggleProfil,
  Available: _Available,
} = useProfilHook();

const OpenEditProfil = () => _OpenEditProfil(props.Data, props.type);
const OpenEchange = async () =>
  _OpenEchange(
    router,
    props.Data.id,
    (await StorageUtils().getStore("nProfil_1_Id")).value
  );

  const Available = () => _Available();

const OpenCreatePost = () => {
  // Logic to open create post
  router.push({ name: "JOB_CREATE" });
};
</script>
