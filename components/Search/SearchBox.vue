<template>
  <div class="flex-0"><UInput size="lg" disabled placeholder="Search..." v-model="searchTerm" /></div>
</template>

<script setup>
const searchTerm = ref("");
</script>
