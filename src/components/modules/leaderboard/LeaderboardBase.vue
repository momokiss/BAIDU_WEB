
<script>
import { defineComponent, reactive } from "vue"
import { useMeta } from "vue-meta"

/**
 * Store
 */
import { useMarketStore } from "@/store/market"

/**
 * Services
 */
import { numberWithSymbol } from "@/services/utils/amounts"

export default defineComponent({
  name: "SymbolsBase",

  setup() {
    const marketStore = useMarketStore()

    const sort = reactive({
      liquidity: "desc",
      perfomance: "desc",
      tier: "asc",
    })
    const users = reactive([
      {
        username: "User 1",
        tier: 1,
        liquidity: 210432,
        perfomance: 34,
      },
      {
        username: "User 2",
        tier: 2,
        liquidity: 240940,
        perfomance: 65,
      },
      {
        username: "User 3",
        tier: 3,
        liquidity: 232930,
        perfomance: 23,
      },
      {
        username: "User 4",
        tier: 4,
        liquidity: 209310,
        perfomance: 12,
      },
      {
        username: "User 5",
        tier: 5,
        liquidity: 174830,
        perfomance: 94,
      },
      {
        username: "User 6",
        tier: 6,
        liquidity: 162902,
        perfomance: 74,
      },
      {
        username: "User 7",
        tier: 7,
        liquidity: 124092,
        perfomance: 9,
      },
    ])

    const sortBy = (target) => {
      switch (target) {
        case "tier":
          if (sort.tier == "asc") {
            users.sort((a, b) => b.tier - a.tier)
            sort.tier = "desc"

            break
          }
          if (sort.tier == "desc") {
            users.sort((a, b) => a.tier - b.tier)
            sort.tier = "asc"

            break
          }

          break

        case "liquidity":
          if (sort.liquidity == "asc") {
            users.sort((a, b) => b.liquidity - a.liquidity)
            sort.liquidity = "desc"

            break
          }
          if (sort.liquidity == "desc") {
            users.sort((a, b) => a.liquidity - b.liquidity)
            sort.liquidity = "asc"

            break
          }

          break

        case "perfomance":
          if (sort.perfomance == "asc") {
            users.sort((a, b) => b.perfomance - a.perfomance)
            sort.perfomance = "desc"

            break
          }
          if (sort.perfomance == "desc") {
            users.sort((a, b) => a.perfomance - b.perfomance)
            sort.perfomance = "asc"

            break
          }

          break
      }
    }

    /** Meta */
    useMeta({
      title: "Leaderboard",
      description:
        "Liquidity provider leaderboard based on perfomance & earnings",
    })

    return { marketStore, users, sort, sortBy, numberWithSymbol }
  },
})
</script>

<template>
  <div :class="$style.wrapper">
    <metainfo>
      <template v-slot:title="{ content }">{{ content }} • Juster</template>
    </metainfo>

    <h1>Leaderboard</h1>
    <div :class="$style.description">
      Liquidity provider leaderboard based on perfomance & earnings
    </div>