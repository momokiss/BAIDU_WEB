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
        block.value && style.block,
        hasCorrectSize && style[size.value],
        disabled.value && style.disabled,
        icon.value && style.icon,
        border.value && style.border,
      ]
    }

    return { getStyles, hasSlot }
  },
})
</script>

<template>
  <button :class="[...getStyles(), loading && $style.loading]">
    <slot v-if="!icon" />
    <Icon v-else :name="icon" size="16" />
  </button>
</template>

<style module>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  border-radius: 7px;

  color: var(--text-primary);
  font-weight: 600;
  white-space: nowrap;

  transition: all 0.2s ease;
}

.wrapper span {
  color: var(--text-tertiary);
}

.wrapper.loading {
  opacity: 0.5;
  pointer-events: none;
}

.wrapper.block {
  width: 100%;
  justify-content: center;
}

/** SIZES */
.wrapper.large {
  height: 44px;
  font-size: 14px;
}

.wrapper.large.icon {
  padding: 0 14px;
}

.wrapper.medium {
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
}

.wr