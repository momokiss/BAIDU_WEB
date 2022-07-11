
<script>
import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  ref,
  onUnmounted,
} from "vue"
import { useRouter } from "vue-router"
import { useMeta } from "vue-meta"
import { cloneDeep } from "lodash"

/**
 * Local
 */
import RatingCard from "./RatingCard"
import RatingCardLoading from "./RatingCardLoading"
import MyPositionCard from "./MyPositionCard"
import MarketCard from "@/components/local/MarketCard"
import { EventCard, EventCardLoading } from "@/components/local/EventCard"

/**
 * UI
 */
import Button from "@/components/ui/Button"

/**
 * API
 */
import { fetchTopEvents } from "@/api/events"
import { fetchTopBettors, fetchTopLiquidityProviders } from "@/api/users"

/**
 * Subscriptions
 */
import { eventSub } from "@/graphql/subscriptions/event"

/**
 * Store
 */
import { useMarketStore } from "@/store/market"
import { useAccountStore } from "@/store/account"

/**
 * Services
 */
import { juster, analytics } from "@/services/sdk"

export default defineComponent({
  name: "ExploreBase",

  setup() {
    const router = useRouter()

    const marketStore = useMarketStore()
    const accountStore = useAccountStore()

    const subToMyPositions = ref({})
    const myPositions = ref([])

    /** Ranking */
    const isTopProvidersLoading = ref(true)
    const isTopBettorsLoading = ref(true)
    const topProviders = ref([])
    const topBettors = ref([])

    const handleViewTopEvents = () => {
      router.push("/events/top")
    }

    onMounted(async () => {
      analytics.log("onPage", { name: "Explore" })

      /**
       * Block: My Positions
       */
      subToMyPositions.value = await juster.gql
        .subscription({
          position: [
            {
              where: {
                userId: { _eq: accountStore.pkh },
                event: { status: { _in: ["NEW", "STARTED"] } },
              },
            },
            {
              id: true,
              value: true,
              event: eventSub,
            },
          ],
        })
        .subscribe({
          next: ({ position: positions }) => {
            myPositions.value = positions
          },
          error: console.error,
        })

      /**
       * Block: Top Events & Providers
       */
      const topEvents = await fetchTopEvents({ limit: 3 })
      marketStore.events = cloneDeep(topEvents).sort(
        (a, b) => b.bets.length - a.bets.length,
      )

      const rawTopProviders = await fetchTopLiquidityProviders()
      const rawTopBettors = await fetchTopBettors()

      topProviders.value = rawTopProviders.map((el) => {
        return { address: el.address, value: el.totalProviderReward }
      })
      isTopProvidersLoading.value = false

      topBettors.value = rawTopBettors.map((el) => {
        return { address: el.address, value: el.totalBetsCount }
      })
      isTopBettorsLoading.value = false
    })
    onBeforeUnmount(() => {
      marketStore.events = []
    })

    onUnmounted(() => {
      if (
        subToMyPositions.value.hasOwnProperty("_state") &&
        !subToMyPositions.value?.closed
      ) {
        subToMyPositions.value.unsubscribe()
      }
    })

    /** Meta */
    useMeta({
      title: "Explore",
      description:
        "Juster is an on-chain smart contract platform allowing users to take part in an automated betting market by creating events, providing liquidity to them, and making bets.",
    })

    return {
      marketStore,
      myPositions,
      topProviders,
      topBettors,
      isTopBettorsLoading,
      isTopProvidersLoading,
      handleViewTopEvents,
    }
  },

  components: {
    RatingCard,