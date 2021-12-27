<script>
import { defineComponent } from "vue"

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Page",
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.content">
      <slot />
    </div>
  </div>
</template>

<style module>
.wrapper {
  display: flex;
  flex-direction