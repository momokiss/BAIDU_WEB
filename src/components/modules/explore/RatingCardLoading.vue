<script setup>
</script>

<template>
  <div :class="$style.wrapper">
    <div v-for="index in 5" :key="index" :class="$style.user">
      <div :class="$style.position" />

      <div :class="$style.avatar" />

      <div :class="$style.address" />

      <div :class="$style.amount" />
    </div>
  </div>
</template>

<style module>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border);
  min-height: 42px;

  padding: 8px 24px 8px 8px;
}

@keyframes mig {
  0% {
    background: #2d2d2d;
  }

  50% {
    background: #55555