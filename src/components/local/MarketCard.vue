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
     