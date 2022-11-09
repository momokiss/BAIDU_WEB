<script>
import { defineComponent, toRefs, computed, useCssModule } from "vue"

export default defineComponent({
  name: "Button",
  props: {
    size: {
      type: String,
      default: "medium",
    },
    type: {
      type: String,
      default: "primary",
    },
    block: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
    icon: {
      type: String,
    },
  },

  setup(props, context) {
    const style = useCssModule()
    const { type, size, block, disabled, border, icon } = toRefs(props)

    const hasSlot = computed(() => !!context.slots.default)

    const getStyles = () => {
      const hasCorrectSize = [
        "large",
        "medium",
        "small",
        "mini",
      ].includes(size.value)

      return [
        style.wrapper,
        style[type.value],
        block.value && styl