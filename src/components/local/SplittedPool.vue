
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