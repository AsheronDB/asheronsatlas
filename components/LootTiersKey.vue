<template>
  <div class="absolute py-4 px-8 rounded top-1/2 right-0 -translate-y-1/2 shadow bg-slate-700 border border-slate-800 text-white">
    
    <h2 class="font-bold text-sm mb-2">Loot Tiers</h2>

    <ul>
      <li v-for="tier in tiers">
         <span class="inline-block w-3 h-3 mr-3 border border-slate-800 rounded-sm" :style="{ 'background-color': tier.properties.color }"></span><span class="font-bold text-sm">Tier {{  tier.properties.tier }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>

import lootTiers from "@/assets/loottiers.geo.json";

const tiers = ref(lootTiers.features);

</script>
