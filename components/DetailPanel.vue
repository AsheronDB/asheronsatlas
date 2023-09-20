<template>
  <div class="flex-1 bg-white shadow rounded overflow-hidden flex flex-col">

    <header class="flex-0 bg-gray-200 p-4">
      <p v-if="selectedDataType === SELECTED_DATA_TYPES.COORDS" class="text-xs leading-none mb-1 text-gray-500 font-bold">Coordinates</p>
      <p v-if="selectedDataType === SELECTED_DATA_TYPES.OBJ_CELL_ID" class="text-xs leading-none mb-1 text-gray-500 font-bold">Landblock</p>
      <h2 class="font-bold">{{ selectedData }}</h2>

    </header>
    <div  class="flex-1 p-4">

    

    </div>
<!-- 
    <footer  class="flex-0 bg-gray-200 p-4">
      <h2>Footurr</h2>
    </footer> -->
  </div>
</template>

<script setup>
import { SELECTED_DATA_TYPES } from "~/common/constants";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
const store = useStore();
const { selectedData, selectedDataType } = storeToRefs(store);
</script>
