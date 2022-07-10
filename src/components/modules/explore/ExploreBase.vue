
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
