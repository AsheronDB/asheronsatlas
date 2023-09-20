<template>
  <div class="h-screen relative" id="atlas">
    <div id="map" class="h-full z-30">
      <ClientOnly>
        <DerethMap />
      </ClientOnly>
    </div>

    <div id="overlay" class="absolute inset-2.5 z-50 pointer-events-none">
    

      <div class="h-full flex flex-row z-50">
        <div class="w-80 flex flex-col">
          <SearchBox class="pointer-events-auto z-50 mb-2.5" />
          <Sidebar class="pointer-events-auto z-40" />
        </div>
        <div class="flex-1">
          <ControlBar class="pointer-events-auto" />
        </div>
      </div>

      <Transition name="fast-fade"
        ><DetailCard class="pointer-events-auto z-50" v-if="targetedPosition"
      /></Transition>
      <Transition name="fast-fade">
        <LootTiersKey
          class="pointer-events-auto z-50"
          v-if="options.dereth.layers.lootTiers"
      /></Transition>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

import DerethMap from "@/components/Atlas/Dereth/Map";

import Sidebar from "@/components/Sidebar";
import SearchBox from "@/components/SearchBox";
import DetailCard from "@/components/DetailCard";
import ControlBar from "@/components/ControlBar";
import LootTiersKey from "@/components/LootTiersKey";

const route = useRoute();
const store = useStore();
const { options, targetedPosition } = storeToRefs(store);

watch(route, (newVal) => {
  console.log("index route watcher");
  console.log(newVal);
});

definePageMeta({
  middleware: ["location-path"],
  name: "home",
  layout: "fill",
  key: "homepage",
  keepalive: true,
});
</script>

<style scoped></style>
