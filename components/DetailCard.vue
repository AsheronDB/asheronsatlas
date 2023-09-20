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
      <UButton class="mb-1" block @click="isShareModalOpen = true">Share</UButton>
      <!-- <UButton class="mb-1" block disabled>Route</UButton> -->
      <UButton block @click="isLocModalOpen = true">Loc</UButton>
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
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Location String
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isLocModalOpen = false" />
          </div>
        </template>
        <UInput
          v-model="targetedPosition.loc"
          icon="i-heroicons-clipboard-document"
          size="xl"
          autofocus
          readonly
          ref="locStringInputEl"
          @focus="$event.target.select();" />
      </UCard>
    </UModal>

    <UModal v-model="isShareModalOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Share
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isShareModalOpen = false" />
          </div>
        </template>
        <UInput
          v-model="targetedPermalink"
          icon="i-heroicons-clipboard-document"
          size="xl"
          autofocus
          readonly
          ref="locStringInputEl"
          @focus="$event.target.select();"
     />
      </UCard>
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
const isShareModalOpen = ref(false);
const store = useStore();
const { targetedPosition, targetedReverseGeocode, targetedZoom } = storeToRefs(store);

const targetedPermalink = computed(() => {
  const radar = targetedPosition.value.coordinates.radar.formatted.split(', ').join(',');
  
  let path = `@${radar}`;
  if (targetedZoom.value) path += `,${targetedZoom.value}Z`;
  const url = `https://asheronsatlas.com/${radar}/${path}`;
  return url; 
});

watch(isLocModalOpen, (newVal) => {
  console.log(isLocModalOpen);
  console.log("locStringModalEl");
  console.log(locStringModalEl);
  if (newVal) {
    console.log(locStringInputEl.value);

    //locStringInputEl.input.select()

    // console.log(locStringInputEl.value.input);

    // locStringInputEl.value.input.focus();
    // locStringInputEl.value.select();
  }
});

const onClose = () => {
  targetedPosition.value = null;
};
</script>

<style scoped></style>
