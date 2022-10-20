
<script>
import {
	defineComponent,
	ref,
	computed,
	watch,
	reactive,
	onMounted,
	onBeforeUnmount,
} from "vue"
import { useRoute } from "vue-router"
import { useMeta } from "vue-meta"
import { DateTime } from "luxon"
import { cloneDeep } from "lodash"

/**
 * API
 */
import { fetchEventsByMarket } from "@/api/events"

/**
 * Local
 */
import Market from "./Market"
import { EventCard, EventCardLoading } from "@/components/local/EventCard"

/**
 * Store
 */
import { useMarketStore } from "@/store/market"

/**
 * UI
 */
import Button from "@/components/ui/Button"
import Pagination from "@/components/ui/Pagination"
import Breadcrumbs from "@/components/ui/Breadcrumbs"

/**
 * Services
 */
import { analytics } from "@/services/sdk"

export default defineComponent({
	name: "MarketBase",

	setup() {
		const header = ref(null)
		const breadcrumbs = reactive([
			{
				name: "All Markets",
				path: "/markets",
			},
		])

		const currentPage = ref(1)

		/** Market */
		const route = useRoute()
		const marketStore = useMarketStore()

		const market = computed(() => {