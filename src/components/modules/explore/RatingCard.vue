
<script setup>
/**
 * Utils
 */
import { abbreviateNumber } from "@/services/utils/amounts"

const props = defineProps({
  users: { type: Array, default: [] },
  suffix: { type: String },
})

const shorten = (address) => {
  return [
    address.slice(0, 5),
    address.slice(address.length - 4, address.length),
  ]
}
</script>

<template>
  <div :class="$style.wrapper">
    <router-link v-for="(user, index) in users" :key="user.address" :to="`/profile/${user.address}`"
      :class="$style.user">
      <div :class="$style.position">
        <Icon v-if="index === 0" name="crown" size="14" />
        {{ index + 1 }}
      </div>

      <img :src="`https://services.tzkt.io/v1/avatars/${user.address}`" :class="$style.avatar" alt="avatar" />

      <div :class="$style.username">
        {{ shorten(user.address)[0] }}<span>...</span>{{ shorten(user.address)[1] }}
      </div>

      <div :class="$style.amount">
        <span>{{ abbreviateNumber(user.value) }}</span>
        {{ suffix }}
      </div>