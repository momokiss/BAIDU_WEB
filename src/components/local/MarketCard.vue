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
        )}, ${percent.toFixed(2)}%, 1W`,
        trend: isIncreased ? "rise" : "fall",
      }
    })

    const draw = () => {
      const margin = { top: 20, right: 20, bottom: 20, left: 0 },
        width = 500 - margin.left - margin.right,
        height = 140 - margin.top - margin.bottom

      d3.select(`#chart_${market.value.id} > *`).remove()

      const svg = d3
        .select(`#chart_${market.value.id}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

      const data = prepareQuotesForD3({ quotes: quotes.value })

      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([0, width])

      const y = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => +d.value),
          d3.max(data, (d) => +d.value),
        ])
        .range([height, 0])

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr(
          "stroke",
          change.value.trend == "rise" ? "#1aa168" : "#e05c43",
        )
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x((d) => x(d.date))
            .y((d) => y(d.value)),
        )

      svg.append("circle")
        .attr("cx", x(data[data.length - 1].date))
        .attr("cy", y(data[data.length - 1].value))
        .attr("r", 2)
        .attr("fill", "#fff")

      /** animated circle */
      svg.append("circle")
        .attr("id", "animated_circle")
        .attr("cx", x(data[data.length - 1].date))
        .attr("cy", y(data[data.length - 1].value))
        .attr("fill", "rgba(255,255,255,0.07)")
        .attr("stroke", "rgba(255,255,255, 0.5)")
        .attr("stroke-width", "2px")

      svg.select("#animated_circle")
        .html(`<animate id="ac1" attributeType="SVG" attributeName="r" begin="1s;ac1.end+2s" dur="1.5s" from="1%" to="10%" />
              <animate id="ac2" attributeType="CSS" attributeName="stroke-width" begin="1s;ac2.end+2s"  dur="1.5s" from="2px" to="0px" />
              <animate id="ac3" attributeType="CSS" attributeName="opacity" begin="1s;ac3.end+2s"  dur="1.5s" from="1" to="0" />`)
    }

    onMounted(() => {
      if (quotes.value.length) {
        draw()
      }
    })

    watch(change, () => {
      if (change.value.text == "Loading") return

      draw()
    })

    /**
     * Select quote on hover
     */
    let selectedQuote = ref({})