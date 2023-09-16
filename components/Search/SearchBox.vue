<template>
  <div class="flex-0 shadow">
    <UInput
      icon="i-heroicons-magnifying-glass-20-solid"
      size="lg"
      autofocus
      color="white"
      disabled
      placeholder="Search"
      v-model="searchQuery"
      :trailing="false" />
  </div>
</template>

<script setup>

import { useStore } from "@/store";
import { storeToRefs } from "pinia";
const store = useStore();
const { searchQuery } = storeToRefs(store);

</script>
