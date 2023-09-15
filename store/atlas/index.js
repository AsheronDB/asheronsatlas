// store/filters.js
import { defineStore } from "pinia";

import state from "./state";
import actions from "./actions";
import getters from "./getters";

export const useAtlasStore = defineStore("atlas", {
  state,
  actions,
  getters
});