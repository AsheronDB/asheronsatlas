<template>
  <div class="flex flex-row justify-end">
    <Transition name="fast-fade"
      ><div v-if="hoveredPosition" class="mr-2">
        <UButton
          color="black"
          variant="ghost"
          size="lg"
          class="text-white text-sm font-bold">
          <span class="drop-shadow">
            {{ hoveredPosition.coordinates.radar.formatted }}</span
          ></UButton
        >
      </div></Transition
    >


    <div class="mr-2">
      <nuxt-link to="/@dfdfdfd">/@cdcdfd</nuxt-link>
    </div>

    <div class="mr-2">
      <nuxt-link to="/location-id/@16.5S,41.0E,6Z">/loc/@coords</nuxt-link>
    </div>

    <div class="mr-2">
      <nuxt-link to="/13.3N,46.4E/@13.3N,46.4E,4Z">/coords</nuxt-link>
    </div>

    <div class="mr-2">
      <nuxt-link to="/0x12345678">/0x12345678</nuxt-link>
    </div>

    


    <div class="mr-2">
      <nuxt-link to="/@16.5S,41.0E,6Z">@coords</nuxt-link>
    </div>

    <div class="mr-2">
      <nuxt-link to="/">Home Test</nuxt-link>
    </div>

    <div class="mr-2">
      <UButton
        size="lg"
        class="shadow border-0"
        color="white"
        @click.self="
          options.dereth.landblockGrid = !options.dereth.landblockGrid
        "
        ><UToggle v-model="options.dereth.landblockGrid" /> Landblock
        Grid</UButton
      >
    </div>
    <div class="mr-1">
      <UDropdown :items="layerItems" :popper="{ placement: 'bottom-end' }">
        <UButton
          icon="i-heroicons-map"
          color="white"
          class="shadow border-0"
          size="lg"
          label="Layers"
          trailing-icon="i-heroicons-chevron-down-20-solid" />

        <template #item="{ item }">
          <UToggle v-model="options.dereth.layers[item.label]" />
          <span class="truncate">{{ item.label }}</span>
        </template>
      </UDropdown>
    </div>
    <div>
      <UButton
        size="lg"
        color="white"
        class="text-white"
        variant="link"
        to="https://github.com/AsheronDB/asheronsatlas"
        target="_blank"
        icon="i-fa6-brands-github"></UButton>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@/store";
import { storeToRefs } from "pinia";

const store = useStore();
const { options, hoveredPosition } = storeToRefs(store);

const layerItems = computed(() =>
  Object.entries(options.value.dereth.layers).map((layer) => {
    console.log(layer);
    return [
      {
        label: layer[0],
        click: (event) => {
          event.preventDefault();
          options.value.dereth.layers[layer[0]] =
            !options.value.dereth.layers[layer[0]];
        },
      },
    ];
  })
);

// const items = [
//   [{
//     label: 'Profile',
//     avatar: {
//       src: 'https://avatars.githubusercontent.com/u/739984?v=4'
//     }
//   }], [{
//     label: 'Edit',
//     icon: 'i-heroicons-pencil-square-20-solid',
//     shortcuts: ['E'],
//     click: () => {
//       console.log('Edit')
//     }
//   }, {
//     label: 'Duplicate',
//     icon: 'i-heroicons-document-duplicate-20-solid',
//     shortcuts: ['D'],
//     disabled: true
//   }], [{
//     label: 'Archive',
//     icon: 'i-heroicons-archive-box-20-solid'
//   }, {
//     label: 'Move',
//     icon: 'i-heroicons-arrow-right-circle-20-solid'
//   }], [{
//     label: 'Delete',
//     icon: 'i-heroicons-trash-20-solid',
//     shortcuts: ['⌘', 'D']
//   }]
// ]
</script>
