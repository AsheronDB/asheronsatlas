<template>
<div class="flex flex-row justify-end">
  <UButton size="lg" class="shadow border-0" color="white" @click.self="options.dereth.landblockGrid = !options.dereth.landblockGrid"><UToggle v-model="options.dereth.landblockGrid" /> Landblock Grid</UButton>

</div>
</template>

<script setup>
import { useStore } from "@/store";
import { storeToRefs } from "pinia";



const store = useStore();
const { options } = storeToRefs(store);
</script>