<template>
  <div id="search" class="mb-4">
    <atlas-search-form />

    <!-- <div class="relative">

        <atlas-search-results v-if="atlasStore.searchResults.length > 0"/>

                
    </div> -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AtlasSearchForm from '@/components/Atlas/Dereth/Search/Form.vue';
// import AtlasSearchResults from '@/components/Atlas/Dereth/Search/Results.vue';

import { useAtlasStore } from "@/store/atlas";
const atlasStore = useAtlasStore();

</script>

<style scoped>

#search { position: relative; overflow: visible; }
</style>