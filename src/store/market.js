import { defineStore } from "pinia"
// eslint-disable-next-line no-unused-vars
import { cloneDeep } from "lodash"

export const useMarketStore = defineStore({
  id: "market",

  state() {
    return {
      isMarketsLoaded: false,

      events: [],

      markets: 