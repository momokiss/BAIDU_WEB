
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
			return Object.keys(marketStore.markets)
				.map((item) => marketStore.markets[item])
				.find((item) => item.symbol == route.params.name)
		})
		const price = computed(
			() => marketStore.markets[market.value?.symbol]?.quotes[0]?.price,
		)

		const selectedTab = ref("Available")
		const selectTab = (tab) => {
			currentPage.value = 1
			selectedTab.value = tab
		}

		const events = computed(() => marketStore.events)

		const getEvents = async ({ status }) => {
			marketStore.events = []

			let allEvents = await fetchEventsByMarket({
				id: market.value.id,
				status,
			})

			marketStore.events = cloneDeep(allEvents).sort(
				(a, b) => new Date(b.createdTime) - new Date(a.createdTime),
			)
		}

		if (market.value) {
			breadcrumbs.push({
				name: market.value.symbol,
				path: `/markets/${market.value.symbol}`,
			})

			getEvents({ status: "NEW" })
		}
		watch(market, () => {
			if (!market.value) return

			breadcrumbs.push({
				name: market.value.symbol,
				path: `/markets/${market.value.symbol}`,
			})

			getEvents({ status: "NEW" })
		})
		watch(selectedTab, () => {
			if (selectedTab.value == "Available") {
				getEvents({ status: "NEW" })
			}
			if (selectedTab.value == "Closed") {
				getEvents({ status: "STARTED" })
			}
			if (selectedTab.value == "Finished") {
				getEvents({ status: "FINISHED" })
			}
		})

		const handleScrollToEvents = () => {
			document.getElementById("app").scrollTo({
				top: header.value.getBoundingClientRect().top - 90,
				behavior: "smooth",
			})
		}

		/** Meta */
		const { meta } = useMeta({
			title: `Market`,
			description:
				"Available markets for events, for providing liquidity and accepting bets from users",
		})

		if (price.value) {
			meta.title = `${market.value.symbol} • ${price.value.toFixed(2)}`
		}

		watch(market, () => {
			if (!market.value) return
			meta.title = `${market.value.symbol}`
		})
		watch(
			() => marketStore.markets,
			() => {
				if (price.value)
					meta.title = `${market.value.symbol}, ${price.value.toFixed(
						2,
					)}`
			},
			{ deep: true },
		)

		onMounted(() => {
			analytics.log("onPage", { name: "Market" })
		})

		onBeforeUnmount(() => {
			marketStore.events = []
		})

		return {
			header,
			breadcrumbs,
			currentPage,
			DateTime,
			market,
			events,
			selectedTab,
			selectTab,
			handleScrollToEvents,
		}
	},

	components: {
		Market,
		Breadcrumbs,
		EventCard,
		EventCardLoading,
		Pagination,
		Button,
	},
})
</script>

<template>
	<div v-if="market" :class="$style.wrapper">
		<metainfo>
			<template v-slot:title="{ content }">{{ content }} • Juster</template>
		</metainfo>

		<Breadcrumbs :crumbs="breadcrumbs" :class="$style.breadcrumbs" />

		<Market :market="market" @onJoin="handleScrollToEvents" />

		<div ref="header" :class="$style.header">
			<div :class="$style.left">
				<div :class="$style.day">