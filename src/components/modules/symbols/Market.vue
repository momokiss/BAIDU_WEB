<script>
import { defineComponent, ref, toRefs, computed } from "vue"

/**
 * UI
 */
import Button from "@/components/ui/Button"

/**
 * Services
 */
import {
  numberWithSymbol,
  calcChange,
  abbreviateNumber,
} from "@/services/utils/amounts"
import { supportedMarkets } from "@/services/config"

/**
 * Store
 */
import { useMarketStore } from "@/store/market"

export default defineComponent({
  name: "Market",
  props: { market: Object },

  setup(props, context) {
    const { market } = toRefs(props)

    const marketStore = useMarketStore()
    const quotes = computed(() => {
      return marketStore.markets[market.value.symbol].quotes
    })

    const price = computed(() => {
      return {
        integer: numberWithSymbol(
          quotes.value[0].price.toString().split(".")[0],
          ",",
        ),
        fraction: quotes.value[0].price.toString().split(".")[1],
      }
    })

    const color = ref("grey")
    const change = computed(() => {
      if (!quotes.value) return

      if (!market.value.historyPrice) return "Loading"

      const { diff, percent, isIncreased } = calcChange(
        quotes.value[0].price,
        market.value.historyPrice,
      )
      color.value = isIncreased ? "green" : "red"

      return `${numberWithSymbol(
        diff.toFixed(2),
        " ",
      )}, ${percent.toFixed(2)}%, 1W`
    })

    const handleJoin = () => {
      context.emit("onJoin")
    }

    return {
      market,
      quotes,
      change,
      color,
      price,
      supportedMarkets,
      handleJoin,
      abbreviateNumber,
    }
  },

  components: { Button },
})
</script>

<template>
  <router-link :to="`/markets/${market.symbol}`" :class="$style.wrapper">
    <div :class="$style.base">
      <div :class="$style.name">
        {{ market.symbol }},
        <span>{{ supportedMarkets[market.symbol].description }}</span>
      </div>

      <h1 v-if="quotes.length" :class="$style.price">
        $ {{ price.integer
        }}<span>.{{ price.fraction.slice(0, 2) }}</span>
      </h1>

      <div :class="[$