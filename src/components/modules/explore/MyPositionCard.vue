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
      time: eventDt.toLocaleString({
        hour: "numeric",
        minute: "numeric",
      }),
      day: eventDt.toLocaleString({
        day: "numeric",
      }),
      month: eventDt.toLocaleString({ month: "short" }),
    },
    end: {
      time: endDt.toLocaleString({
        hour: "numeric",
        minute: "numeric",
      }),
      day: endDt.toLocaleString({
        day: "numeric",
      }),
      month: endDt.toLocaleString({ month: "short" }),
    },
    showDay: eventDt.ordinal < endDt.ordinal,
  }
})

const value = computed(() => {
  const bets = props.event.bets.reduce((acc, curr) => {
    if (curr.userId == accountStore.pkh) {
      return (acc += curr.amount)
    } else {
      return acc
    }
  }, 0)
  const liquidity = props.event.deposits.reduce((acc, curr) => {
    if (curr.userId == accountStore.pkh) {
      return (acc += curr.amountAboveEq)
    } else {
      return acc
    }
  }, 0)

  return abbreviat