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
 * St