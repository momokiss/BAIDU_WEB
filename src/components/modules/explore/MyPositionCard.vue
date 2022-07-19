<script setup>
import { computed } from "vue"
import { DateTime, Duration } from "luxon"

/**
 * UI
 */
import Badge from "@/components/ui/Badge"

/**
 * Services
 */
import { supportedMarkets } from "@/services/config"
import { toReadableDuration } from "@/services/utils/date"
import { abbreviateNumber } from "@/services/utils/amounts"

/**
 * Store
 */
import { useAccountStore } from "@/store/account"
const accountStore = useAccountStore()

const props = defineProps({
  event: { type: Object, required: true },
})

const symbol = computed(() => props.event.currencyPair.symbol)

const eventDuration = computed(() =>
  toReadableDuration({ seconds: props.event.measurePeriod }),
)

const timing = computed(() => {
  const eventDt = DateTime.fromISO(props.event.betsCloseTime).setLocale("en")

  const endDt = eventDt.plus(props.event.measurePeriod * 1000)

  return {
    start: {
      time: eventDt.