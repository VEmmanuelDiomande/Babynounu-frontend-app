<template>
  <div class="flex max-w-[80%] pb-4 transition-all duration-300 ml-4">
    <div
      class="py-2 px-3 rounded-[18px] bg-white rounded-bl-[4px] flex items-center shadow-xs"
    >
      <!-- Animation -->
      <div class="flex items-center">
        <span class="text-xs text-gray-500 mr-1">
          {{
            typingUsers.length > 1
              ? "Plusieurs personnes écrivent..."
              : `${typingUsers[0]?.name || 'Quelqu\'un'} écrit...`
          }}
        </span>
        <div class="flex space-x-1">
          <div
            class="w-2 h-2 bg-primary rounded-full animate-typing"
            style="animation-delay: 0ms"
          ></div>
          <div
            class="w-2 h-2 bg-primary rounded-full animate-typing"
            style="animation-delay: 150ms"
          ></div>
          <div
            class="w-2 h-2 bg-primary rounded-full animate-typing"
            style="animation-delay: 300ms"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  typingUsers: {
    type: Array<any>,
    required: true
  }
});
</script>

<style scoped>
@keyframes typing {
  0% {
    transform: translateY(0px);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-5px);
    opacity: 1;
  }
  100% {
    transform: translateY(0px);
    opacity: 0.4;
  }
}

.animate-typing {
  animation: typing 1s infinite;
}
</style>