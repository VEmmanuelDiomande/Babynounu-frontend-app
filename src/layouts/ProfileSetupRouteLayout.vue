<template>
  <div class="min-h-screen py-8 flex flex-col bg-white">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
</script>
