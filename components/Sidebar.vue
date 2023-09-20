<template>
  <div class=" flex-1 flex flex-col">
    <Transition name="fast-fade"><DetailPanel v-if="selectedData" /></Transition>
    <Transition name="fast-fade"> <SearchResults v-if="searchResults.length > 0" /></Transition>
  </div>
</template>

<script setup>
import SearchResults from "@/components/SearchResults";
import DetailPanel from "@/components/DetailPanel";
import { storeToRefs } from "pinia";
import { useStore } from "@/store";
const store = useStore();
const { searchResults, selectedData } = storeToRefs(store);
</script>
