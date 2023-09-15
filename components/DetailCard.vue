<template>
  <div
    class="absolute bg-white w-96 text-black rounded shadow bottom-0 left-1/2 -translate-x-1/2 py-4 px-4 flex flex-row">
    <div class="flex-1">
      <p class="text-sm font-bold leading-none">
        <span class="mr-2">{{
          targetedPosition.coordinates.radar.formatted
        }}</span
        ><span
          ><CopyButton :text="targetedPosition.coordinates.radar.formatted"
        /></span>
      </p>

      <p v-if="targetedReverseGeocode">{{ targetedReverseGeocode }}</p>
    </div>

    <div class="flex flex-col text-center pt-4">
      <UButton class="mb-1" block disabled>Route</UButton>
      <UButton block @click="isLocModalOpen = true">Loc String</UButton>
    </div>

    <div class="absolute top-1 right-1" @click="onClose">
      <UButton
        icon="i-heroicons-x-mark"
        size="2xs"
        color="primary"
        square
        variant="ghost" />
    </div>

    <UModal v-model="isLocModalOpen" ref="locStringModalEl">
      <div class="p-6">
        <p class="font-bold text-sm mb-3">Location String</p>
        <UInput v-model="targetedPosition.loc" icon="i-heroicons-clipboard-document" size="xl" autofocus ref="locStringInputEl"  @focus="$event.target.select()"  />
      </div>
      <div class="absolute top-1 right-1" @click="isLocModalOpen = false">
        <UButton
          icon="i-heroicons-x-mark"
          size="2xs"
          color="primary"
          square
          variant="ghost" />
      </div>
    </UModal>
  </div>
</template>

<script setup>
import CopyButton from "@/components/CopyButton";
import { useStore } from "@/store";
import { storeToRefs } from "pinia";

const locStringModalEl = ref(null);
const locStringInputEl = ref(null);

const isLocModalOpen = ref(false);
const store = useStore();
const { targetedPosition, targetedReverseGeocode } = storeToRefs(store);


watch(isLocModalOpen, (newVal) => {

  console.log(isLocModalOpen);
  console.log('locStringModalEl');
  console.log(locStringModalEl);
  if (newVal) {

    console.log(locStringInputEl.value);

    //locStringInputEl.input.select()

   // console.log(locStringInputEl.value.input);

    // locStringInputEl.value.input.focus();
  // locStringInputEl.value.select();
  } 

})


const onClose = () => {
  targetedPosition.value = null;
};
</script>

<style scoped></style>
