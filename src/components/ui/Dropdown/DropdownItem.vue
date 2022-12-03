<script>
import { defineComponent } from "vue"

export default defineComponent({
  name: "DropdownItem",
  props: {
    disabled: Boolean,
  },
})
</script>

<template>
  <div :class="[$style.wrapper, disabled && $style.disabled]">
    <slot />
  </di