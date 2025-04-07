<template>
    <!-- Menu -->
    
    <section class="sticky top-0 z-40 bg-white font-love" v-if="menuCount == Data.length">
      <div
        class="grid overflow-auto no-scrollbar border-b-[1px] border-zinc-500/20 w-full"
        :class="`${menuCount == 4 ? 'grid-cols-4' : 'grid-cols-3'}`"
      > 
        <div
          v-for="MP in MenuProfil.filter((MP) => Data.includes(MP.id))"
          :key="MP.id"
          @click="handleTabClick(MP.id)"
        >
          <div
            class="px-4 py-2 flex justify-center items-center"
            :class="{
              'border-b-2 border-primary text-primary font-bold':
                MenuActive === MP.id,
            }"
          >
            <span
              class="flex flex-row justify-center w-full min-w-max text-base font-bold text-center"
              :class="MenuActive !== MP.id ? 'text-gray-400' : 'text-primary'"
              >{{ MP.name }}</span
            >
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { onMounted, reactive, ref } from "vue";
  
  // Déclaration des props et emits
  const props = defineProps(["MenuActive", "Data"]);
  const emit = defineEmits(["update:menu-active"]);

  
  // Données du menu
  const MenuProfil = reactive([
    {
      id: 1,
      name: "Profil",
      icon: "RiUser3Line",
      isActived: true,
    },
    {
      id: 2,
      name: "Galeries",
      icon: "RiGalleryLine",
      isActived: false,
    },
    {
      id: 3,
      name: "Offres",
      icon: "RiGalleryLine",
      isActived: false,
    },
    {
      id: 4,
      name: "Demandes",
      icon: "RiGalleryLine",
      isActived: false,
    },
    {
      id: 5,
      name: "Postulés",
      icon: "RiFileListLine",
      isActived: false,
      action: () => {},
    },
    {
      id: 6,
      name: "A Propos",
      icon: "RiInformationLine",
      isActived: false,
      action: () => {},
    },
  ]);

  const menuCount = ref(0)

  const _menuCount = () => {
    menuCount.value = MenuProfil.filter((MP) => props.Data.includes(MP.id)).length
    return menuCount.value;
  }

  onMounted(() => {
    _menuCount()
  });
  
  // Gestion du clic sur un onglet
  const handleTabClick = (tabId: number) => {
    emit("update:menu-active", tabId); // Émission de la nouvelle valeur de MenuActive
  };
  </script>
  
  <style scoped>
  .grid_cols4 {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .grid_cols3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
</style>