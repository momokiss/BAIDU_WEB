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
          quotes: [],
          historyPrice: 0,
        },
      },
    }
  },
  actions: {
    setMarket({ target, symbol }) {
      this.markets[target] = { ...this.markets[target], ...symbol }
    },

    setQuotes({ target, quotes }) {
      this.markets[target].quotes = [...quotes]
    },
    clearQuotes() {
      Object.keys(this.markets).forEach(symbol => {
        this.markets[symbol].quotes =