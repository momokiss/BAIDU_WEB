<!-- eslint-disable vue/no-unused-components -->
<script>
import { defineComponent, toRefs, onMounted, computed, watch, ref } from "vue"
import * as d3 from "d3"

/**
 * UI
 */
import Button from "@/components/ui/Button"

/**
 * Local
 */
import MarketStatus from "./MarketStatus"

/**
 * Services
 */
import { numberWithSymbol, calcChange } from "@/services/utils/amounts"
import { supportedMarkets } from "@/services/config"
import { prepareQuotesForD3 } from "@/services/utils/quotes"

/**
 * Store
 */
import { useMarketStore } from "@/store/market"

export default defineComponent({
  name: "MarketCard",
  props: {
    market: Object,
  },

  setup(props) {
    const { market } = toRefs(props)
    const marketStore = useMarketStore()

    const quotes = computed(() => {
      return marketStore.markets[market.value.symbol]?.quotes
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

      if (!market.value.historyPrice) return { text: "Loading" }

      const { diff, percent, isIncreased } = calcChange(
        quotes.value[0].price,
        market.value.historyPrice,
      )
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      color.value = isIncreased ? "green" : "red"

      return {
        text: `${numberWithSymbol(
          diff.toFixed(2),
          ",",
        )}, ${percent