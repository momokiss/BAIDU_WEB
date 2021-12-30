
<script setup>
import { computed } from "vue"

import { f } from "@/services/utils/amounts"

/**
 * UI
 */
import Button from "@/components/ui/Button"
import Spin from "@/components/ui/Spin"

/**
 * Store
 */
import { useAccountStore } from "@/store/account"
const accountStore = useAccountStore()

const props = defineProps({
  primary: Boolean,
  event: Object,
  isWon: Boolean,
  positionForWithdraw: Object,
  disabled: Boolean,
  isWithdrawing: Boolean,
})
const emit = defineEmits(["onBet", "onWithdraw"])

const ratio = computed(() => {
  if (!props.event.poolBelow || !props.event.poolAboveEq) return 0

  return {
    rise: props.event.poolBelow / props.event.poolAboveEq,
    fall: props.event.poolAboveEq / props.event.poolBelow,