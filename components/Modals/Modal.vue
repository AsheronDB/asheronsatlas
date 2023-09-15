<template>
  <div id="modal" class="flex items-center justify-center" v-show="isVisible">
    <div class="content"><slot></slot></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const isVisible = ref(true);

</script>

<style scoped>
#modal {
  background-color: rgba(0, 0, 0, 0.5);

  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
}
</style>
