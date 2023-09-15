<template>
  <div id="title-bar" class="bg-slate-800 dark:bg-slate-900 flex flex-row">

    <div class="flex-1 mr-auto"></div>

    <div class="flex justify-items-center items-center flex-column  text-center">
      <span
        class="title py-2 text-slate-400 font-bold dark:text-slate-500 text-sm block"
        >Asheron's Atlas</span
      >
    </div>
    
    <div
      class="title-bar-btns flex-1 ml-auto flex flex-column items-center justify-end"
      v-if="atlasStore.isWindows"
    >
      <span
        class="min-btn transition text-xs text-slate-500 px-4 py-2 hover:text-white hover:bg-slate-700"
        @click="onMinimize"
        >&#xE921;</span
      >
      <span
        class="max-btn transition text-xs  text-slate-500 px-4 py-2 hover:text-white hover:bg-slate-700"
        @click="onMaximize"
        v-if="!atlasStore.options.window.maximized"
      >
        &#xE922;
      </span>
      <span
        class="max-btn transition text-xs px-4  py-2 text-slate-500 hover:text-white hover:bg-slate-700"
        @click="onMaximize"
        v-if="atlasStore.options.window.maximized"
      >
        &#xE923;
      </span>
      <span
        class="close-btn transition text-sm px-4 py-2 text-slate-500 hover:text-white hover:bg-rose-500"
        @click="onClose"
        >&#xE8BB;</span
      >
    </div>
    <div v-else class="flex-1 ml-auto"> </div>
  </div>
</template>

<script setup>
import { useAtlasStore } from "@/store/atlas";
const atlasStore = useAtlasStore();

const onClose = () => {
  window.ipcRenderer.send("close");
};

const onMinimize = () => {
  window.ipcRenderer.send("minimize");
};

const onMaximize = () => {
  window.ipcRenderer.send("maximize");
};
</script>

<style scoped>
#title-bar {
  flex: 0 0 auto;
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

.title-bar-btns {

}
.title-bar-btns span {
  font-family: "Segoe MDL2 Assets";
    -webkit-user-select: auto;
  -webkit-app-region: no-drag;
}
/* 
button {
  font-family: "Segoe MDL2 Assets";
  background: none;
  border: 0;
  padding: 7px 18px;
  font-size: 10px;
  color: #fff;
  transition: background-color 0.08s linear;
} */
</style>
