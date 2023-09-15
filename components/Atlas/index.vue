<template>
  <div id="dereth-atlas">
    <header>df</header>
    <div id="content">
      <div id="panel">Left panel</div>

      <div id="map">
        <dereth-map />
      </div>
    </div>
  </div>
</template>

<script setup>
import DerethMap from "@/components/DerethMap";
</script>

<style scoped>
#atlas {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
