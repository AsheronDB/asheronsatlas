// store/filters.js
import { defineStore } from "pinia";

import state from "./state";
import actions from "./actions";
import getters from "./getters";

export const useStore = defineStore("store", {
  state,
  actions,
  getters
});