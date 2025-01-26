<template>
    <div class="flex overflow-x-auto space-x-[3px] pl-[3.70rem] scrollbar-hide ">
  <div class="flex-none">
    <img src="https://picsum.photos/80/80?random=1" alt="Image 1" class="w-[180px] h-[245px] object-cover rounded-lg ">
  </div>
  <div class="flex-none">
    <img src="https://picsum.photos/80/80?random=2" alt="Image 2" class="w-[180px] h-[245px] object-cover rounded-lg ">
  </div>
  <div class="flex-none">
    <img src="https://picsum.photos/80/80?random=3" alt="Image 3" class="w-[180px] h-[245px] object-cover rounded-lg ">
  </div>
  <!-- Ajoutez autant d'images que nécessaire -->
</div>


</template>

<script setup lang="ts">

</script>

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;  /* Internet Explorer */
    scrollbar-width: none;  /* Firefox */
  }
</style>
