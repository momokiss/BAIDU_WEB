
<script setup>
import { computed } from "vue"

/**
 * Store
 */
import { useAccountStore } from "@/store/account"

/**
 * Services
 */
import { abbreviateNumber, numberWithSymbol } from "@/services/utils/amounts"

/**
 * UI
 */
import Tooltip from "@/components/ui/Tooltip"

const props = defineProps({
  event: {
    type: Object,
    default: {},
  },
  userDeposits: {
    type: Array,
    default: [],
  },
  userBets: {
    type: Array,
    default: [],
  },
  position: {
    type: Object,
  },
})

const accountStore = useAccountStore()

const bvl = computed(() =>
  props.userBets.reduce((acc, { amount }) => (acc += amount), 0),
)
const dvl = computed(() => {
  return props.userDeposits.reduce(
    (acc, { amountAboveEq }) => (acc += amountAboveEq),
    0,
  )
})

const returnOnBets = computed(() => {
  let reward = 0

  if (props.event.status == "FINISHED") {
    reward = props.userBets.reduce((acc, { side, reward }) => {
      return side == props.event.winnerBets ? (acc += reward) : acc
    }, 0)
  } else {
    reward = props.userBets.reduce((acc, { reward }) => (acc += reward), 0)
  }

  return reward
})

const potentialProfit = computed(() =>
  props.userBets.reduce(
    (acc, { amount, reward }) => (acc += reward - amount),
    0,
  ),
)

const profitOnFinish = computed(() => {
  if (!props.position) return 0

  const liquidity = Math.max(
    props.position.liquidityProvidedAboveEq,
    props.position.liquidityProvidedBelow,
  )

  const profit = props.position.value - bvl.value - liquidity

  if (isNaN(profit)) return 0

  return profit
})

const hasHedge = computed(() => {
  const hasRiseBet = props.userBets.some((bet) => bet.side == "ABOVE_EQ")
  const hasFallBet = props.userBets.some((bet) => bet.side == "BELOW")

  return hasRiseBet && hasFallBet
})
</script>

<template>
  <div :class="$style.wrapper">
    <!-- TVL -->
    <div :class="$style.sector">
      <div :class="$style.base">
        <div :class="$style.name">Total Value Locked</div>

        <div :class="$style.amount">
          {{ abbreviateNumber(dvl + bvl) }}
          <span>ꜩ</span>
        </div>
      </div>

      <Tooltip>
        <div :class="$style.icon">
          <Icon name="wallet" size="20" />
        </div>

        <template #content> Your Bets + Liquidity </template>
      </Tooltip>
    </div>

    <!-- Returning -->
    <div :class="$style.sector">
      <div :class="$style.base">
        <div :class="$style.name">Returning</div>

        <div v-if="
          ['NEW', 'STARTED'].includes(event.status) &&
          dvl + bvl > 0
        " :class="$style.amount">
          TBD
        </div>
        <div v-else-if="!position || !position.value" :class="$style.amount">
          0 <span>ꜩ</span>
        </div>
        <div v-else :class="$style.amount">
          {{
              position
                ? numberWithSymbol(position.value.toFixed(2), ",")
                : 0
          }}
          <span>ꜩ</span>
        </div>
      </div>

      <Tooltip>
        <div :class="$style.icon">
          <Icon name="walletadd" size="20" />
        </div>

        <template #content>
          The withdrawal amount may be different from this calculation
        </template>
      </Tooltip>
    </div>

    <!-- Profit -->
    <div :class="$style.sector">
      <div :class="$style.base">
        <div :class="$style.name">
          {{
              event.status == "FINISHED"
                ? "Profit"
                : "Potential Profit"
          }}
        </div>

        <div v-if="hasHedge && event.status !== 'FINISHED'" :class="$style.amount">
          TBD
        </div>

        <div v-else-if="['NEW', 'STARTED'].includes(event.status)" :class="$style.amount">
          {{ potentialProfit.toFixed(2) }} <span>ꜩ</span>
        </div>

        <div v-else-if="event.status == 'FINISHED'" :class="$style.amount">
          {{ profitOnFinish.toFixed(2) }} <span>ꜩ</span>
        </div>

        <div v-else :class="$style.amount">0 <span>ꜩ</span></div>
      </div>

      <Tooltip v-if="hasHedge && event.status !== 'FINISHED'">
        <div :class="[$style.icon, hasHedge && $style.yellow]">
          <Icon name="warning" size="20" />
        </div>

        <template #content>Your bets are aimed both ways.<br /><span>The final profit will be calculated at the end of
            the
            event</span></template>
      </Tooltip>
      <div v-else :class="[
        $style.icon,
        returnOnBets - bvl > 0 &&
        event.status == 'FINISHED' &&
        $style.green,
      ]">
        <Icon name="money" size="20" />
      </div>
    </div>
  </div>

  <div :class="$style.hint">
    <Icon name="help" size="14" />
    <span>Returning & Profit</span> is depends on the current winning side.
    Exact calculations will be indicated at the end of the event
  </div>
</template>