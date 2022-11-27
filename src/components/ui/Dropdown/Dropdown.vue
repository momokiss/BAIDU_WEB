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

      isOpen.value = false

      context.emit("onClose")
    }

    const dropdownStyles = reactive({
      top: `initial`,
      right: 0,
      bottom: `initial`,
    })

    let removeOutside
    watch(isOpen, () => {
      if (!isOpen.value) {
        removeOutside()

        document.removeEventListener("keydown", onKeydown)
      } else {
        document.addEventListener("keydown", onKeydown)

        const triggerHeight =
          trigger.value.getBoundingClientRect().height

        if (side.value =