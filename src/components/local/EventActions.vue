
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
  }
})

const successfulWithdrawal = computed(() =>
  accountStore.withdrawals.find(
    (withdrawal) => withdrawal.event.id == props.event.id,
  ),
)

const btnType = computed(() => {
  if (props.isWithdrawing || accountStore.pendingTransaction.awaiting) {
    return "secondary"
  }

  if (props.isWon && props.positionForWithdraw) {
    return "success"
  } else {
    return "secondary"
  }
})
</script>

<template>
  <div :class="$style.wrapper">
    <template v-if="!isWon && !positionForWithdraw && !successfulWithdrawal">
      <div @click.prevent="emit('onBet', 'rise')" :class="[
        $style.action,
        primary && $style.primary,
        disabled && $style.disabled,
      ]">
        <div :class="$style.left">
          <Icon name="higher" size="14" :class="$style.higher_icon" />

          <span>Rise</span>
        </div>

        <div :class="$style.ratio">
          <Icon name="close" size="10" />

          <span v-if="ratio.rise">{{
              (1 + ratio.rise).toFixed(2)
          }}</span>
          <span v-else>0.00</span>
        </div>
      </div>

      <div :class="$style.divider" />

      <div @click.prevent="emit('onBet', 'fall')" :class="[
        $style.action,
        primary && $style.primary,
        disabled && $style.disabled,
      ]">
        <div :class="$style.ratio">
          <Icon name="close" size="10" />

          <span v-if="ratio.fall">{{
              (1 + ratio.fall).toFixed(2)
          }}</span>
          <span v-else>0.00</span>
        </div>

        <div :class="$style.left">
          <span>Fall</span>

          <Icon name="lower" size="14" :class="$style.lower_icon" />
        </div>
      </div>
    </template>

    <Button v-else @click.prevent="emit('onWithdraw')" :type="btnType" size="small" :disabled="
      isWithdrawing ||
      (isWon && !positionForWithdraw) ||
      !!successfulWithdrawal?.amount ||
      accountStore.pendingTransaction.awaiting
    " block>
      <template v-if="successfulWithdrawal">Successfully withdrawn
        {{ successfulWithdrawal?.amount.toFixed(2) }} ꜩ</template>

      <template v-else-if="accountStore.pendingTransaction.awaiting">
        Can`t withdraw right now
      </template>

      <template v-else-if="!isWithdrawing && positionForWithdraw">
        <Icon name="crown" size="16" />Withdraw
        {{ f(positionForWithdraw.value) }} ꜩ
      </template>

      <template v-else>
        <Spin size="12" />Awaiting confirmation..
      </template>
    </Button>
  </div>
</template>

<style module>
.wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;

  border-radius: 6px;
}

.action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;

  background: #29292b;

  padding: 0 12px;
  height: 32px;

  transition: background 0.2s ease;
}

.action.primary {
  background: #285dbf;
}

.action.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.action:hover {
  background: #313133;
}

.action.primary:hover {
  background: #1f4fa8;