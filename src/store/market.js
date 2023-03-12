import { defineStore } from "pinia"
// eslint-disable-next-line no-unused-vars
import { cloneDeep } from "lodash"

export const useMarketStore = defineStore({
  id: "market",

  state() {
    return {
      isMarketsLoaded: false,

      events: [],

      markets: {
        "BTC-USD": {
          events: [],
          quotes: [],
          historyPrice: 0,
        },
        "ETH-USD": {
          events: [],
          quotes: [],
          historyPrice: 0,
        },
        "XTZ-USD": {
          events: [],
          quote