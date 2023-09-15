<template>
  <div class="h-screen relative" id="atlas">
    <div id="map" class="h-full z-30">
      <ClientOnly>
        <DerethMap />
      </ClientOnly>
    </div>

    <div id="overlay" class="absolute inset-2.5 z-50 pointer-events-none">
      <!-- <Sidebar class="pointer-events-auto z-40" /> -->

      <div class="h-full flex flex-row z-50">
        <div class="w-80">
          <!-- <Search class="pointer-events-auto z-50" /> -->
        </div>
        <div class="flex-1">
          <ControlBar class="pointer-events-auto" />
        </div>
      </div>

      <DetailCard class="pointer-events-auto z-50" v-if="targetedPosition" />
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import { storeToRefs } from "pinia";

import DerethMap from "@/components/Atlas/Dereth/Map";

import Sidebar from "@/components/Sidebar";
import Search from "@/components/Search";
import DetailCard from "@/components/DetailCard";
import ControlBar from "@/components/ControlBar";

const store = useStore();
const { targetedPosition } = storeToRefs(store);

definePageMeta({
  layout: "fill",
});
</script>

<style scoped></style>
