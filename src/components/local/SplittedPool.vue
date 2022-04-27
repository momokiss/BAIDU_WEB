
<script>
import { defineComponent, computed, toRefs, watch, ref } from "vue"

export default defineComponent({
  name: "SplittedPool",
  props: {
    event: Object,
    amount: [Number, String],
    winDelta: Number,
    side: String,
  },

  setup(props) {
    const { event, amount, winDelta, side } = toRefs(props)

    const userAmount = computed(() => (amount.value ? amount.value : 0))

    // eslint-disable-next-line vue/return-in-computed-property
    const abovePercent = computed(() => {
      if (!userAmount.value || side.value == "Liquidity") {
        if (!event.value.poolAboveEq && !event.value.poolBelow) return 0

        return (
          (event.value.poolAboveEq * 100) /
          (event.value.poolAboveEq + event.value.poolBelow)
        )
      } else {
        if (side.value == "Rise") {
          const below = event.value.poolBelow - winDelta.value
          const above = event.value.poolAboveEq + userAmount.value

          return (above * 100) / (above + below)
        }
        if (side.value == "Fall") {
          const below = event.value.poolBelow + userAmount.value
          const above = event.value.poolAboveEq - winDelta.value

          return (above * 100) / (above + below)
        }
      }
    })
    const aboveAmount = computed(() => {
      if (side.value == "Rise")
        return event.value.poolAboveEq + userAmount.value

      if (side.value == "Fall")
        return event.value.poolAboveEq - winDelta.value

      if (side.value == "Liquidity") {
        const maxPool = Math.max(
          event.value.poolAboveEq,
          event.value.poolBelow,
        )
        const newAboveEq =
          event.value.poolAboveEq +
          (event.value.poolAboveEq / maxPool) * userAmount.value

        return newAboveEq
      }

      return 0
    })

    // eslint-disable-next-line vue/return-in-computed-property
    const belowPercent = computed(() => {
      if (!userAmount.value || side.value == "Liquidity") {
        if (!event.value.poolAboveEq && !event.value.poolBelow) return 0

        return (
          (event.value.poolBelow * 100) /
          (event.value.poolAboveEq + event.value.poolBelow)
        )
      } else {
        if (side.value == "Rise") {
          const below = event.value.poolBelow - winDelta.value
          const above = event.value.poolAboveEq + userAmount.value

          return (below * 100) / (above + below)
        }
        if (side.value == "Fall") {
          const below = event.value.poolBelow + userAmount.value
          const above = event.value.poolAboveEq - winDelta.value

          return (below * 100) / (above + below)
        }
      }
    })
    const belowAmount = computed(() => {
      if (side.value == "Rise")
        return event.value.poolBelow - winDelta.value
      if (side.value == "Fall")
        return event.value.poolBelow + userAmount.value

      if (side.value == "Liquidity") {
        const maxPool = Math.max(
          event.value.poolAboveEq,
          event.value.poolBelow,
        )
        const newBelow =
          event.value.poolBelow +
          (event.value.poolBelow / maxPool) * userAmount.value

        return newBelow
      }

      return 0
    })

    return { abovePercent, aboveAmount, belowPercent, belowAmount }
  },
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.head">
      <div :class="$style.left">
        <div :class="$style.name">
          Rise
          <span>{{
              abovePercent % 1 == 0
                ? abovePercent
                : abovePercent.toFixed(2)
          }}%</span>
        </div>

        <div :class="$style.dot" />

        <div :class="$style.size">
          <Icon name="money" size="12" />
          {{ aboveAmount.toFixed(0) }}
          <span>ꜩ</span>
        </div>
      </div>

      <div :class="$style.right">
        <div :class="$style.size">
          <Icon name="money" size="12" />
          {{ belowAmount.toFixed(0) }}
          <span>ꜩ</span>
        </div>

        <div :class="$style.dot" />

        <div :class="$style.name">
          Fall
          <span>{{
              belowPercent % 1 == 0
                ? belowPercent
                : belowPercent.toFixed(2)
          }}%</span>
        </div>
      </div>
    </div>
