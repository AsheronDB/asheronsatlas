<template>
  <Listbox v-model="selectedPerson">
    <div class="relative">
      <ListboxButton
        class="relative w-full py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
        >{{ selectedPerson.name }}</ListboxButton
      >
      <div class="absolute w-full mt-1 bg-white rounded-md shadow-lg">
        <ListboxOptions
          class="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 space-y-px pl-px focus:outline-none sm:text-sm sm:leading-5"
    
        >
          <ListboxOption
            v-for="person in people"
            :key="person.id"
            :value="person"
            :disabled="person.unavailable"
          >
            {{ person.name }}
          </ListboxOption>
        </ListboxOptions>
      </div>
    </div>
  </Listbox>
</template>

<script setup>
import { ref } from "vue";

import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

const people = [
  { id: 1, name: "Durward Reynolds", unavailable: false },
  { id: 2, name: "Kenton Towne", unavailable: false },
  { id: 3, name: "Therese Wunsch", unavailable: false },
  { id: 4, name: "Benedict Kessler", unavailable: true },
  { id: 5, name: "Katelyn Rohan", unavailable: false },
];
const selectedPerson = ref(people[0]);
</script>
