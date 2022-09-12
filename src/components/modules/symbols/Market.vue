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

  setup(p