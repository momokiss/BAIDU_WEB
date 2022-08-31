
<script>
import { defineComponent, reactive } from "vue"
import { useMeta } from "vue-meta"

/**
 * Store
 */
import { useMarketStore } from "@/store/market"

/**
 * Services
 */
import { numberWithSymbol } from "@/services/utils/amounts"

export default defineComponent({
  name: "SymbolsBase",

  setup() {
    const marketStore = useMarketStore()

    const sort = reactive({
      liquidity: "desc",
      perfomance: "desc",