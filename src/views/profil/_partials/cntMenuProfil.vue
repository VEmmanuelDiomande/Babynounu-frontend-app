<template>
  <!-- Menu -->
  <section
    class="sticky top-0 z-40 bg-white font-love w-full"
    v-if="filteredMenuItems?.length > 0 && menuCount  > 0"
  >
 
    <div
      class="grid overflow-auto no-scrollbar border-b-[1px] border-zinc-500/20 w-full"
      :class="`${
        menuCount == 4
          ? 'grid-cols-4'
          : menuCount == 3
          ? 'grid-cols-3'
          : menuCount == 2
          ? 'grid-cols-2'
          : menuCount == 2 ? 
          'grid-cols-2'
          : 'grid-cols-1'
      }`"
    >
      <div
        v-for="MP in filteredMenuItems"
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
import { onMounted, reactive, ref, computed } from "vue";

// Déclaration des props et emits
const props = defineProps(["MenuActive", "Data", "isOwner"]);
const emit = defineEmits(["update:menu-active"]);

// Données du menu
const MenuProfil = reactive([
  {
    id: 1,
    name: "Profil",
    icon: "RiUser3Line",
    isActived: false,
  },
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
    id: 2,
    name: "Galeries",
    icon: "RiGalleryLine",
    isActived: true,
  },
  {
    id: 3,
    name: "Offres",
    icon: "RiGalleryLine",
    isActived: true,
  },
  {
    id: 4,
    name: "Demandes",
    icon: "RiGalleryLine",
    isActived: true,
  },
  {
    id: 5,
    name: "Postulés",
    icon: "RiFileListLine",
    isActived: true,
  },
  {
    id: 6,
    name: "A Propos",
    icon: "RiInformationLine",
    isActived: false,
  },
  {
    id: 6,
    name: "A Propos",
    icon: "RiInformationLine",
    isActived: true,
  },
]);

// Version optimisée du filtrage
const filteredMenuItems = computed(() => {
  return MenuProfil.filter((MP) => {
    return props.Data.includes(MP.id) && MP.isActived == props.isOwner; // Condition pour la galerie
  });
});

const menuCount = ref(0);

const _menuCount = () => {
  menuCount.value = filteredMenuItems.value.length;
  return menuCount.value;
};

onMounted(() => {
  _menuCount();
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
