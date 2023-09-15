<template>
  <div class="h-screen" id="atlas">
    <ClientOnly>
      <DerethMap />
    </ClientOnly>
  </div>
</template>

<script setup>
import DerethMap from "@/components/Atlas/Dereth/Map";

definePageMeta({
  layout: "fill",
});
</script>

<style scoped></style>
