<template>
    <div id="app">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script setup>

useHead({
  title: "Asheron's Atlas",
  bodyAttrs: {
    class: 'light'
  },
})
</script>

<style>
@import url("leaflet/dist/leaflet.css");
</style>