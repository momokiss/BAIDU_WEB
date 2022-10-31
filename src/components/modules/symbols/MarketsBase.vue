<script setup>
import { reactive, onMounted } from "vue"
import { useMeta } from "vue-meta"

/**
 * Local
 */
import Market from "./Market"

/**
 * UI
 */
import Breadcrumbs from "@/components/ui/Breadcrumbs"

/**
 * Store
 */
import { useMarketStore } from "@/store/market"

/**
 * Services
 */
import { analytics } from "@/services/sdk"

const breadcrumbs = reactive([
  {
    name: "All Markets",
    path: "/markets",
  },
])

const marketStore = useMarketStore()

onMounted(() => {
  analytics.log("onPage", { name: "Markets" })
})

/** Meta */
useMeta({
  title: "All Markets",
  description:
    "Available markets for events, for providing liquidity and accepting bets from users",
})
</script>

<template>
  <div :class="$style.wrapper">
    <metainfo>
      <template v-slot:title="{ content }">{{ content }} • Juster</template>
    </metainfo>

    <Breadcrumbs :crumbs="breadcrumbs" :class="$style.breadcrumbs" />

    <h1 :class="$style.title">Available Markets</h1>
    <div :class="$style.description">
      List of all currency pairs available for betting
 