
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