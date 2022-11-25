<script>
import { defineComponent, ref, reactive, watch, nextTick, toRefs } from "vue"

/**
 * Composable
 */
import { useOnOutsidePress } from "@/composable/onOutside"

export default defineComponent({
  name: "Dropdown",
  props: {
    forceOpen: Boolean,
    side: {
      type: String,
      default: "bottom",
    },
  },
  emits: ["onClose"],

  setup(props, context) {
    const { side, forceOpen } = toRefs(props)

    const trigger = ref(null)
    const dropdown = ref(null)
    const isOpen = ref(false)

    watch(forceOpen, () => {
      isOpen.value = forceOpen.value
    })

    const toggleDropdown = (event) => {
      event.stopPropagation()

      isOpen.value = !isOpen.value
    }
    const close = (event) => {
      if (event) event.stopPropagation()

      i