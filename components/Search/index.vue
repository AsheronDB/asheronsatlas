<template>
  <div class="absolute top-0 left-0 bottom-0 w-80 flex flex-col"><SearchBox /><SearchResults v-if="searchResults" /></div>
</template>

<script setup>
import SearchBox from "@/components/Search/SearchBox";
import SearchResults from "@/components/Search/SearchResults";
import { storeToRefs } from 'pinia'
import { useStore } from '@/store';
const store = useStore()
const { searchResults } = storeToRefs(store);
</script>
