
<script>
import {
  defineComponent,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  computed,
  ref,
  watch,
  toRefs,
} from "vue"

/**
 * Composable
 */
import { useOnOutsidePress } from "@/composable/onOutside"

export default defineComponent({
  name: "Modal",
  props: {
    show: {
      type: Boolean,
    },
    width: {
      type: String,
    },
    closable: {
      type: Boolean,
    },
    closeOutside: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["onClose"],

  setup(props, context) {
    let removeOutside
    const modal = ref(null)

    const { width, show, closeOutside } = toRefs(props)

    watch(show, () => {
      if (!show.value) {
        if (removeOutside) removeOutside()
      } else {
        if (!closeOutside.value) return

        nextTick(() => {
          removeOutside = useOnOutsidePress(modal, handleClose)
        })
      }
    })

    onBeforeMount(() => {
      document.addEventListener("keydown", onKeydown)
    })

    onBeforeUnmount(() => {
      document.removeEventListener("keydown", onKeydown)
    })

    const calcModalStyles = computed(() => {
      const styles = {
        width: width.value ? `${width.value}px` : `400px`,
      }

      return styles
    })

    const handleClose = () => {
      context.emit("onClose")
    }

    const onKeydown = (event) => {
      if (event.key == "Escape" && show.value) handleClose()
    }

    return { modal, calcModalStyles, handleClose, onKeydown }
  },
})
</script>

<template>
  <teleport to="#modal">
    <transition name="popup">
      <div v-if="show" :class="$style.wrapper">
        <div ref="modal" :class="$style.modal" :style="calcModalStyles">
          <slot />

          <Icon name="close" size="16" @click="handleClose" v-if="closable" :class="$style.close_icon" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style module>
.wrapper {