<script setup>
</script>

<template>
  <div :class="$style.wrapper">
    <div v-for="index in 5" :key="index" :class="$style.user">
      <div :class="$style.position" />

      <div :class="$style.avatar" />

      <div :class=