<template>
  <div class=" w-full flex flex-col flex-0">
    <SearchBox />
  </div>
</template>

<script setup>
import SearchBox from "@/components/Search/SearchBox";
import { storeToRefs } from "pinia";
import { useStore } from "@/store";
const store = useStore();
</script>
