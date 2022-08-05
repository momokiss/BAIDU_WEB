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

  return abbreviateNumber(bets + liquidity)
})
</script>

<template>
  <router-link :to="`/events/${event.id}`">
    <div :class="$style.wrapper">
      <div :class="$style.left">
        <div :class="[
          $style.event_icon,
          (event.status == 'NEW' && $style.green) ||
          (event.status == 'STARTED' && $style.yellow),
        ]">
          <Icon :name="
            (event.status == 'NEW' && 'event_new') ||
            (event.status == 'STARTED' && 'event_active')
          " size="16" />
        </div>

        <div :class="$style.info">
          <div :class="$style.title">
            <img v-if="event.winnerBets == 'ABOVE_EQ'" :src="require('@/assets/icons/higher_won.svg')"
              alt="won_side_icon" />
            <img v-else-if="event.winnerBets == 'BELOW'" :src="require('@/assets/icons/lower_won.svg')"
              alt="won_side_icon" />
            <Icon v-else name="sides" size="16" />
            {{
                supportedMarkets[symbol] &&
                supportedMarkets[symbol].description
            }}
            <span>price event</span>
          </div>

          <div :class="$style.timing">
            <div :class="$style.days">
              {{
                  `${timing.start.day} ${timing.showDay ? `- ${timing.end.day}` : ``
                  } ${timing.start.month}`
              }}
            </div>

            <div :class="$style.dot" />

            <div :class="$style.hrs">
              {{ timing.start.time }}
            