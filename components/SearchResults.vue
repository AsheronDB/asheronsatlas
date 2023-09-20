<template>
  <div class="flex-1 bg-blue-500">{{ searchResults }}</div>
</template>

<script setup>
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
const store = useStore();
const { searchResults } = storeToRefs(store);
</script>
