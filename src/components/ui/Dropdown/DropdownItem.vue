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
  </div>
</template>

<style module>
.wrapper {
  display: flex;
  align-items: center;

  min-width: 120px;
  height: 32px;
  p