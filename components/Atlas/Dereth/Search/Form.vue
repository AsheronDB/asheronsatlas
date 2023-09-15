<template>
  <form @submit.prevent="onSearch">
    <label
      for="default-search"
      class="mb-2 text-sm font-medium text-slate-900 sr-only dark:text-white"
      >Search</label
    >
    <div class="relative">
      <div
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400"
      >
        <font-awesome-icon :icon="icons.faMagnifyingGlass" size="" />
      </div>

      <input
        type="search"
        id="default-search"
        class="block w-full p-2 pl-9 text-sm border border-slate-300 rounded-lg bg-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search"
        v-model="atlasStore.searchQuery"
        novalidate
      />
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAtlasStore } from "@/store/atlas";
const atlasStore = useAtlasStore();

import {
  radarToPos,
  locToPos,
  isValidLocString,
  isValidRadarCoords,
} from "@asherondb/ac-position";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const icons = ref({
  faMagnifyingGlass,
});

// const searchInput = ref('');

watch(
  () => atlasStore.searchQuery,
  (newVal) => {
    if (newVal == "") {

    
      atlasStore.selectedLocation = null;
      atlasStore.searchResults = [];
      // Clear selectedLocation store
      // Clear search
    }
  }
);

const onSearch = () => {
  if (isValidRadarCoords(atlasStore.searchQuery)) {
    console.log('is valid radar');
    const position = radarToPos(atlasStore.searchQuery);
    atlasStore.targetedPosition = position;
    atlasStore.reverseGeocode(
      `${position.coordinates.global.x},${position.coordinates.global.y}`
    );
    atlasStore.selectedLocation = null;
  } else if (isValidLocString(atlasStore.searchQuery)) {
    const position = locToPos(atlasStore.searchQuery);

    if (position.isOutdoors) {
      atlasStore.targetedPosition = position;
    }

    // Check for just landblock or landblock + cell
    // Enable landblock grid

  } else {
    atlasStore.searchLocations(atlasStore.searchQuery);
  }
};
</script>
