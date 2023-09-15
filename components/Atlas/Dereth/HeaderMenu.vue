<template>
  <header
    class="bg-slate-300 dark:bg-slate-800 p-2.5 border-b border-slate-500 dark:border-slate-900"
  >
    <div class="flex items-center">
      <div class="flex-none items-center">
        <span
          class="text-slate-600 leading-none ml-1.5 block dark:text-slate-500"
          @click="toggleSidebar()"
          ><font-awesome-icon
            :icon="icons.faSquareCaretLeft"
            size="lg"
            v-if="atlasStore.sidebarVisible" /><font-awesome-icon
            :icon="icons.faSquareCaretRight"
            size="lg"
            v-if="!atlasStore.sidebarVisible"
        /></span>

        <!-- <span v-if="atlasStore.hoveredPosition">{{ atlasStore.hoveredPosition.coordinates.radar.formatted }}</span> -->
      </div>
      <div class="flex-auto flex justify-end leading-none items-center">
        <span
          class="block py-2 leading-none px-2.5 mr-2 text-sm text-slate-900 focus:outline-none bg-slate-100 rounded-lg hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700"
        >
          <font-awesome-icon :icon="icons.faCrosshairs" size="lg" />
        </span>

        <span
          class="block py-2 leading-none px-2.5 mr-2 text-sm text-slate-900 focus:outline-none bg-slate-100 rounded-lg hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700"
          @click="toggleLandblockGrid()"
          :class="{
            'bg-slate-700': atlasStore.options.dereth.landblockGrid,
            'text-white': atlasStore.options.dereth.landblockGrid,
          }"
        >
          <font-awesome-icon :icon="icons.faBorderAll" size="lg" />
        </span>

        <!-- <span
              class="block py-2 leading-none px-2.5 mr-2 text-sm text-slate-900 focus:outline-none bg-slate-300 rounded-lg hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700"
            >
              <font-awesome-icon :icon="icons.faLayerGroup" size="lg" />
            </span> -->

        <span
          class="block py-2 mr-2 leading-none px-2.5 text-sm text-slate-900 focus:outline-none bg-slate-100 rounded-lg hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700"
        >
          <font-awesome-icon :icon="icons.faShareFromSquare" size="lg" />
        </span>

        <div class="relative inline-block text-left">
          <Popover class="relative">
            <PopoverButton
              class="block py-2 mr-2 leading-none px-2.5 text-sm text-slate-900 focus:outline-none bg-slate-100 rounded-lg hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700"
              ><font-awesome-icon :icon="icons.faLayerGroup" size="lg"
                /></PopoverButton
            >

            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-out"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <PopoverPanel
                class="absolute right-0 mt-5 origin-top-right bg-white border border-gray-200 divide-gray-100 rounded-md shadow-lg outline-none"
              >
                <div class="py-1">
                  <span
                    class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
                    v-for="(option, key) in atlasStore.options.dereth.layers"
                  >
                    <SwitchGroup>
                      <div class="flex items-center">
                        <SwitchLabel
                          >{{ key }}
                        </SwitchLabel>
                        <Switch
                          v-model="atlasStore.options.dereth.layers[key]"
                          :class="atlasStore.options.dereth.layers[key] ? 'bg-blue-600' : 'bg-gray-200'"
                          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <span
                            :class="atlasStore.options.dereth.layers[key] ? 'translate-x-6' : 'translate-x-1'"
                            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                          />
                        </Switch>
                      </div>
                    </SwitchGroup>
                  </span>
                </div>
              </PopoverPanel>
            </transition>
          </Popover>
        </div>

        <!-- <div class="relative inline-block text-left">





            
          <Menu>
            <span class="rounded-md shadow-sm">
              <MenuButton
                class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 text-slate-900 bg-slate-100 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2 leading-none text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <span
                  ><font-awesome-icon :icon="icons.faLayerGroup" size="lg"
                /></span>
                <svg
                  class="w-5 h-5 ml-2 -mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </MenuButton>
            </span>

            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-out"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems
                class="absolute right-0 w-56 mt-5 origin-top-right bg-white border border-gray-200 divide-gray-100 rounded-md shadow-lg outline-none"
              >
                <div class="py-1">
                  <MenuItem v-slot="{ active }" v-for="option in layerOptions">
                    <span
                      class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
                    >
                      <SwitchGroup>
                        <div class="flex items-center">
                          <SwitchLabel class="mr-4"
                            >{{ option.label }} </SwitchLabel
                          >
                          <Switch
                            v-model="enabled"
                            :class="enabled ? 'bg-blue-600' : 'bg-gray-200'"
                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <span
                              :class="
                                enabled ? 'translate-x-6' : 'translate-x-1'
                              "
                              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                            />
                          </Switch>
                        </div>
                      </SwitchGroup>
                    </span>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div> -->
        <!-- <Menu>
          <MenuButton class="text-slate-900 bg-slate-100 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2 leading-none text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">  <font-awesome-icon :icon="icons.faLayerGroup" size="lg" />
          <svg
            class="w-4 h-4 ml-2 text-sm"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg></MenuButton>
          <MenuItems>
            <MenuItem v-slot="{ active }">
              <a :class="{ 'bg-blue-500': active }" href="/account-settings">
                Account settings
              </a>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <a :class="{ 'bg-blue-500': active }" href="/account-settings">
                Documentation
              </a>
            </MenuItem>
            <MenuItem disabled>
              <span class="opacity-75">Invite a friend (coming soon!)</span>
            </MenuItem>
          </MenuItems>
        </Menu> -->

        <!-- <button
          id="dropdownDefaultButton"
          data-dropdown-toggle="dropdown"
          data-dropdown-offset-skidding="-55"
          data-dropdown-offset-distance="18"
          data-dropdown-placement="bottom"
          class="text-slate-900 bg-slate-100 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2 leading-none text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          <font-awesome-icon :icon="icons.faLayerGroup" size="lg" />
          <svg
            class="w-4 h-4 ml-2 text-sm"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        Dropdown menu
        <div
          id="dropdown"
          class="z-50000 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            class="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >Landscape Objects</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >Inaccessible Regions</a
              >
            </li>
          </ul>
        </div> -->

        <!-- <span class="mr-5 inline-block leading-none text-slate-600">
              <font-awesome-icon :icon="icons.faLayerGroup" size="" />
            </span>
            <span class="mr-2 inline-block leading-none text-slate-600">
              <font-awesome-icon :icon="icons.faShareFromSquare" size="" />
            </span> -->
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";

import {
  faSquareCaretLeft,
  faSquareCaretRight,
} from "@fortawesome/free-regular-svg-icons";

import {
  faLayerGroup,
  faBorderAll,
  faShareFromSquare,
  faMagnifyingGlass,
  faCrosshairs,
} from "@fortawesome/free-solid-svg-icons";

const icons = ref({
  faLayerGroup,
  faBorderAll,
  faShareFromSquare,
  faMagnifyingGlass,
  faSquareCaretLeft,
  faSquareCaretRight,
  faCrosshairs,
});

import { useAtlasStore } from "@/store/atlas";
const atlasStore = useAtlasStore();

const toggleLandblockGrid = () => {
  console.log("toggleLandblockGrid");
  atlasStore.options.dereth.landblockGrid = !atlasStore.options.dereth.landblockGrid;
  console.log(atlasStore.options.dereth.landblockGrid);
};

const toggleSidebar = () => {
  atlasStore.sidebarVisible = !atlasStore.sidebarVisible;
};

import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverPanel,
  Switch,
  SwitchGroup,
  SwitchLabel,
} from "@headlessui/vue";

const enabled = ref(false);

const layerOptions = ref([
  {
    label: "Landscape Objects",
  },
  {
    label: "Inaccessible Terrain",
  },
  {
    label: "Development Regions",
  },
]);
</script>

<style scoped>
header {
  flex: 0 0 44px;

  z-index: 100;
}
</style>
