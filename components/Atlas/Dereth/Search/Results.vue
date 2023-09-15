<template>
  <div id="search-results" class="absolute top-0 left-0 right-0 bottom-0 z-50 overflow-hidden flex-auto flex flex-col">
    
    <div class="rounded-lg bg-slate-50 border border-slate-400 drop-shadow dark:bg-slate-500 p-2 text-slate-500 dark:text-white overflow-auto ">
      <p class="text-sm text-slate-400 pt-1.5 px-3 pb-1 cursor-default">
        {{ atlasStore.searchResults.length }} results
      </p>
      <ul class="">
        <li
          v-for="(result, index) in atlasStore.searchResults"
          @click="onResultClick(result)"
          class="flex flex-row rounded block hover:bg-slate-200 pl-1 py-1 pr-3 cursor-default"
        >

        <div class="w-10 flex-none">

           <img src="@/assets/img/map/icons/Lifestone_Portal_Icon.png" class="w-9">

            </div>
            

            <div class="flex-auto">

                 <span class="block text-sm font-bold text-slate-500 leading-snug">{{
            result.properties.name
          }}</span>

            <span
            v-if="
              result.properties.position &&
              result.properties.position.isOutdoors
            "
            class="block text-xs text-slate-400"
            >{{ result.properties.position.coordinates.radar.formatted }}</span
          >



            </div>

 

        



        
        </li>
      </ul>
      </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAtlasStore } from "@/store/atlas";
const atlasStore = useAtlasStore();

const onResultClick = (result) => {
  atlasStore.getLocation(result.properties.id);
  atlasStore.searchResults = [];
};
</script>
<style scoped>
#search-results {
  /* position: absolute;
  top: 0;
  left: 0;
  right: 0; */
}
</style>
