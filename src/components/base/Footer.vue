<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { computed, onBeforeUnmount, onMounted, reactive } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import { DateTime } from "luxon"

/**
 * Services
 */
import { juster, switchNetwork, currentNetwork } from "@/services/sdk"
import { capitalizeFirstLetter } from "../../services/utils/global"

/**
 * Constants
 */
// eslint-disable-next-line no-unused-vars
import { Networks } from "@/services/constants"

/**
 * Store
 */
import { useMarketStore } from "@/store/market"
const marketStore = useMarketStore()

/**
 * UI
 */
// import Button from "@/components/ui/Button"
// import Tooltip from "@/components/ui/Tooltip"
// import { Dropdown, DropdownItem, DropdownTitle } from "@/components/ui/Dropdown"

// eslint-disable-next-line no-unused-vars
const router = useRouter()

/** Watch for DipDup, Quotes, Network */
let checkInterval = null

const initCurrentDt = DateTime.now()

const STATUSES = {
	LOADING: "Loading..",
	GOOD: "Good",
	DELAYED: "Delayed",
}

const status = reactive({
	dipdup: STATUSES.LOADING,
	network: STATUSES.LOADING,
	quotes: STATUSES.LOADING,
})

// eslint-disable-next-line vue/return-in-computed-property
const statusBlock = computed(() => {
	if (
		status.dipdup === STATUSES.GOOD &&
		status.network === STATUSES.GOOD &&
		status.quotes == STATUSES.GOOD
	) {
		return { text: "All systems online", color: "green" }
	} else if (
		status.dipdup === STATUSES.DELAYED &&
		status.network === STATUSES.DELAYED &&
		status.quotes == STATUSES.DELAYED
	) {
		return { text: "All systems delayed", color: "red" }
	} else if (
		status.dipdup !== STATUSES.GOOD ||
		status.network !== STATUSES.GOOD ||
		status.quotes !== STATUSES.GOOD
	) {
		return { text: "Some systems delayed", color: "yellow" }
	}
})

const checkDipdup = async () => {
	const urlToCheck =
		currentNetwork.value == "mainnet"
			? "https://juster.dipdup.net/api/rest/dipdupHead?name=https://api.tzkt.io"
			: "https://api.ithacanet.juster.fi/api/rest/dipdupHead?name=https://api.ithacanet.tzkt.io"
	const {
		data: { dipdupHeadByPk },
	} = await axios.get(urlToCheck)

	const dipdupDt = DateTime.fromISO(dipdupHeadByPk.timestamp)
	const dipdupDiff = initCurrentDt
		.diff(dipdupDt, ["minutes", "seconds"])
		.toObject()

	if (dipdupDiff.minutes >= 1) {
		status.dipdup = STATUSES.DELAYED
	} else {
		status.dipdup = STATUSES.GOOD
	}
}

const checkNetwork = async () => {
	const { data } = await axios.get(
		`https://rpc.tzkt.io/${currentNetwork.value == "mainnet" ? "mainnet" : "ithacanet"
		}/chains/main/blocks/head/header`,
	)

	const networkDt = DateTime.fromISO(data.timestamp)
	const networkDiff = initCurrentDt
		.diff(networkDt, ["minutes", "seconds"])
		.toObject()

	if (networkDiff.minutes >= 1) {
		status.network = STATUSES.DELAYED
	} else {
		status.network = STATUSES.GOOD
	}
}

const checkQuotes = () => {
	const quotesDiff = initCurrentDt
		.diff(
			DateTime.fromISO(
				marketStore.markets["XTZ-USD"].quotes[0].timestamp,
			),
			["minutes"],
		)
		.toObject()

	if (quotesDiff.minutes >= 3) {
		status.quotes = STATUSES.DELAYED
	} else {
		status.quotes = STATUSES.GOOD
	}
}

const handleSwitch = (network) => {
	juster.sdk._provider.client.clearActiveAccount().then(async () => {
		switchNetwork(network)
	})
}

marketStore.$subscribe((mutation, state) => {
	if (state.markets["XTZ-USD"].quotes.length) {
