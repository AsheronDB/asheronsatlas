<template>
  <div
    id="infobox"
    class="bg-slate-50 rounded-lg flex flex-col overflow-hidden z-10"
    :class="{ 'opacity-25': atlasStore.searchResults.length > 0 }">
    <!-- {{ selectedLocationId }}
    {{ selectedLocation }} -->
    <header class="p-5 border-b border-slate-200 flex-initial">
      <p
        class="text-xs font-bold text-slate-500 capitalize mb-0.5"
        v-if="selectedLocation.properties.category">
        {{ selectedLocation.properties.category }}
      </p>
      <h3 class="font-bold leading-tight">
        {{ selectedLocation.properties.name }}
      </h3>
      <p
        class="pt-1 text-xs text-slate-400"
        v-if="
          selectedLocation.properties.reverseGeocode &&
          selectedLocation.properties.reverseGeocode.length > 0
        ">
        {{ selectedLocation.properties.reverseGeocode.join(", ") }}
        <!-- Auberean, Dereth, Northern Osteth, Olthoi North<br/>
        Auberean, Knorr, Knorr Lyceum<br/>
        Bur, Kor-Gursha -->
      </p>
      <p class="pt-2" v-if="selectedLocation.properties.position">
        <span
          class="inline text-xs bg-white font-bold text-slate-400 border rounded-md inline py-1 px-2 border-slate-300"
          >{{
            selectedLocation.properties.position.coordinates.radar.formatted
          }}</span
        >
      </p>
    </header>

    <div class="body flex-auto overflow-auto p-4">
      <p>
        {{ selectedLocation.properties }}
      </p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <!-- 

          <Disclosure>
    <DisclosureButton class="py-2">
      Is team pricing available?
    </DisclosureButton>
    <DisclosurePanel class="text-gray-500">
      Yes! You can purchase a license that you can share with your entire team.
    </DisclosurePanel>
  </Disclosure> -->

      <!-- <Accordion flush>
           <accordion-panel>
          <accordion-header  class="text-sm font-bold text-slate-500">CoD Description</accordion-header>
          <accordion-content>
            <div>
              <p class="mb-2 text-slate-500 dark:text-slate-400">
               Original dungeon where early adventurers used to meet to perch Olthoi - it used to be the only place to kill an Olthoi Noble. Now it contains a portal to Deeper Catacombs and has significantly more difficult inhabitants.
              </p>
              <p class="text-slate-500 dark:text-slate-400">
                Check out the
                <a
                  href="https://flowbite.com/figma/"
                  class="text-blue-600 dark:text-blue-500 hover:underline"
                  >Figma design system</a
                >
                based on the utility classes from Tailwind CSS and components
                from Flowbite.
              </p>
            </div>
          </accordion-content>
        </accordion-panel>

        <accordion-panel>
          <accordion-header class="text-sm font-bold text-slate-500">AC Explorer Notes</accordion-header>
          <accordion-content>
            <div>
    
        <ul class="text-xs text-slate-500">
          <li class="mb-2">
            Olthois All Around<span class="block italic pt-0.5">Savage</span>
          </li>
          <li class="mb-2">
            There are only a few soldiers and workers b4 the noble. YES A NOBLE
            IS HERE. Its easy to use the walls such that you fight nmo more than
            2 olthoi atta time. If you have 250 jump you can still pech at the
            start by playing super mario of an olthois head<span
              class="block italic pt-0.5"
              >Sarec 6/14/2000</span
            >
          </li>
          <li>
            But Archers, dont get all excited. Perching here is pointless now
            because this dungeon has been ruined by a slower spawn rate. So the
            amount of time youd spend perching, compared to the chance of
            actually seeing an Olthoi is totally pointless.<span
              class="block italic pt-0.5"
              >T-Bird (HG) 9/1/2000</span
            >
          </li>

          <li class="mb-2">
            Olthois All Around<span class="block italic pt-0.5">Savage</span>
          </li>
          <li class="mb-1.5">
            There are only a few soldiers and workers b4 the noble. YES A NOBLE
            IS HERE. Its easy to use the walls such that you fight nmo more than
            2 olthoi atta time. If you have 250 jump you can still pech at the
            start by playing super mario of an olthois head<span
              class="block italic pt-0.5"
              >Sarec 6/14/2000</span
            >
          </li>
          <li>
            But Archers, dont get all excited. Perching here is pointless now
            because this dungeon has been ruined by a slower spawn rate. So the
            amount of time youd spend perching, compared to the chance of
            actually seeing an Olthoi is totally pointless.<span
              class="block italic pt-0.5"
              >T-Bird (HG) 9/1/2000</span
            >
          </li>

          <li class="mb-1.5">
            Olthois All Around<span class="block italic pt-0.5">Savage</span>
          </li>
          <li class="mb-1.5">
            There are only a few soldiers and workers b4 the noble. YES A NOBLE
            IS HERE. Its easy to use the walls such that you fight nmo more than
            2 olthoi atta time. If you have 250 jump you can still pech at the
            start by playing super mario of an olthois head<span
              class="block italic pt-0.5"
              >Sarec 6/14/2000</span
            >
          </li>
          <li>
            But Archers, dont get all excited. Perching here is pointless now
            because this dungeon has been ruined by a slower spawn rate. So the
            amount of time youd spend perching, compared to the chance of
            actually seeing an Olthoi is totally pointless.<span
              class="block italic pt-0.5"
              >T-Bird (HG) 9/1/2000</span
            >
          </li>
        </ul>
            </div>
          </accordion-content>
        </accordion-panel>
    
     
      </Accordion> -->
    </div>

    <footer
      class="flex-initial flex flex-row border-t border-slate-200 py-3 px-3">
      <button
        type="button"
        class="py-2.5 px-5 mr-2 text-sm flex-auto font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700">
        Go To
      </button>
      <button
        type="button"
        class="flex-auto py-2.5 px-5 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700">
        Route
      </button>
    </footer>
    <!-- 
    {{ selectedLocation.properties }}

    <div>
      Buttons:<br />
      Jump to Location<br />
      Route from Here<br />
    </div> -->
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAtlasStore } from "@/store/atlas";
const atlasStore = useAtlasStore();
const { selectedLocationId, selectedLocation } = storeToRefs(atlasStore);

// import {
//   Accordion,
//   AccordionPanel,
//   AccordionHeader,
//   AccordionContent,
// } from "flowbite-vue";
</script>

<style scoped>
#infobox {
  max-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
