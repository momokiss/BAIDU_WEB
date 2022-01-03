
<script setup>
import {
	onMounted,
	onBeforeUnmount,
	onUnmounted,
	ref,
	reactive,
	computed,
} from "vue"
import { DateTime } from "luxon"

/**
 * UI
 */
import {
	Dropdown,
	DropdownItem,
	DropdownDivider,
} from "@/components/ui/Dropdown"
import Badge from "@/components/ui/Badge"
import Tooltip from "@/components/ui/Tooltip"

/**
 * Local
 */
import ParticipantsModal from "@/components/local/modals/ParticipantsModal"
import LiquidityModal from "@/components/local/modals/position/LiquidityModal"
import BetModal from "@/components/local/modals/position/BetModal"
import EventActions from "@/components/local/EventActions"

/**
 * Services
 */
import {
	toClipboard,
	getCurrencyIcon,
	capitalizeFirstLetter,
	pluralize,
} from "@/services/utils/global"
import { juster, analytics, currentNetwork } from "@/services/sdk"
import { abbreviateNumber } from "@/services/utils/amounts"
import { supportedMarkets, verifiedMakers } from "@/services/config"
import { toReadableDuration } from "@/services/utils/date"

/**
 * Composable
 */
import { useCountdown } from "@/composable/date"
import { useMarket } from "@/composable/market"

/**
 * Store
 */
import { useMarketStore } from "@/store/market"
import { useAccountStore } from "@/store/account"
import { useNotificationsStore } from "@/store/notifications"

// eslint-disable-next-line no-undef
const props = defineProps({ event: { type: Object } })

/** Stores */
const notificationsStore = useNotificationsStore()
const accountStore = useAccountStore()
const marketStore = useMarketStore()

const { updateWithdrawals } = useMarket()

const card = ref(null)
const openContextMenu = ref(false)

/** Bet modal */
const showBetModal = ref(false)
const preselectedSide = ref("Rise")

/** Liquidity modal */
const showLiquidityModal = ref(false)

/** Participants modal */
const showParticipantsModal = ref(false)

const subscription = ref({})

const symbol = computed(() => props.event.currencyPair.symbol)

/** Countdown setup: Time to start */
const startDt = computed(() => new Date(props.event?.betsCloseTime).getTime())
const { status: startStatus, stop: destroyStartCountdown } =
	useCountdown(startDt)

/** Countdown setup: Time to finish */
const finishDt = computed(() =>
	DateTime.fromISO(props.event.betsCloseTime)
		.plus({ second: props.event.measurePeriod })
		.toJSDate()
		.getTime(),
)
const { stop: destroyFinishCountdown } = useCountdown(finishDt)

const timing = computed(() => {
	const eventDt = DateTime.fromISO(props.event.betsCloseTime).setLocale("en")

	const endDt = eventDt.plus(props.event.measurePeriod * 1000)

	return {
		start: {
			time: eventDt.toLocaleString({
				hour: "numeric",
				minute: "numeric",
			}),
			day: eventDt.toLocaleString({
				day: "numeric",
			}),
			month: eventDt.toLocaleString({ month: "short" }),
		},
		end: {
			time: endDt.toLocaleString({
				hour: "numeric",
				minute: "numeric",
			}),
			day: endDt.toLocaleString({
				day: "numeric",
			}),
			month: endDt.toLocaleString({ month: "short" }),
		},
		showDay: eventDt.ordinal < endDt.ordinal,
	}
})

const liquidityLevel = computed(() => {
	if (props.event.totalLiquidityProvided >= 7000)
		return { text: "Ultra", icon: "liquidity_ultra" }
	else if (props.event.totalLiquidityProvided >= 3000)
		return { text: "High", icon: "liquidity_high" }
	else if (props.event.totalLiquidityProvided >= 1000)
		return { text: "Medium", icon: "liquidity_medium" }
	else if (props.event.totalLiquidityProvided < 1000)
		return { text: "Low", icon: "liquidity_low" }
	else return { text: "Low", icon: "liquidity_low" }
})

const participantsAvatars = computed(() => {
	let avatars = [
		...props.event.bets.map((bet) => bet.userId),
		...props.event.deposits.map((deposit) => deposit.userId),
	]

	/** remove duplicates */
	avatars = [...new Set(avatars)]

	return avatars
})

const userTVL = computed(() => {
	let tvl = 0

	tvl += props.event.deposits
		.filter((deposit) => deposit.userId == accountStore.pkh)
		.reduce((a, { amountBelow }) => a + amountBelow, 0)
	tvl += props.event.bets
		.filter((bet) => bet.userId == accountStore.pkh)
		.reduce((a, { amount }) => a + amount, 0)

	return tvl
})

/** Win & Withdraw */
const hasWonBet = computed(() => {
	if (!props.event) return

	return !!props.event.bets
		.filter((bet) => bet.userId == accountStore.pkh)
		.filter((bet) => bet.side == props.event.winnerBets).length
})
const positionForWithdraw = computed(() => {
	return accountStore.wonPositions.find(
		(position) => position.event.id == props.event.id,
	)
})

/** Join to the event & Liquidity */
const handleBet = (target) => {
	preselectedSide.value = capitalizeFirstLetter(target)

	/** disable Bet / Liquidity right after betsCloseTime */
	if (
		startStatus.value == "Finished" ||
		props.event.totalLiquidityProvided == 0
	)
		return

	analytics.log("showBetModal", { where: "event_card" })

	showBetModal.value = true
}

/** Withdraw */
const isWithdrawing = ref(false)
const handleWithdraw = () => {
	isWithdrawing.value = true

	analytics.log("clickWithdraw", { where: "event_card" })

	juster.sdk
		.withdraw(props.event.id, accountStore.pkh)
		.then((op) => {
			/** Pending transaction label */
			accountStore.pendingTransaction.awaiting = true

			op.confirmation()
				.then((result) => {
					accountStore.pendingTransaction.awaiting = false
					isWithdrawing.value = false

					/** rm won position from store */
					accountStore.positionsForWithdrawal =
						accountStore.positionsForWithdrawal.filter(
							(position) => position.event.id != props.event.id,
						)

					updateWithdrawals()

					if (!result.completed) {
						// todo: handle it?
					}
				})
				.catch(() => {
					accountStore.pendingTransaction.awaiting = false
					isWithdrawing.value = false
				})

			notificationsStore.create({
				notification: {
					type: "success",
					title: "Withdrawal request sent",
					description:
						"Processing takes about 10-30 seconds. Funds will appear in your wallet soon",
					autoDestroy: true,
				},
			})

			analytics.log("onWithdraw", {
				eventId: props.event.id,
			})
		})
		.catch(() => {
			accountStore.pendingTransaction.awaiting = false
			isWithdrawing.value = false
		})
}

const handleParticipants = () => {
	showParticipantsModal.value = true

	analytics.log("showParticipantsModal", { where: "event_card" })
}

const copy = (target) => {
	if (target == "id") {
		notificationsStore.create({
			notification: {
				type: "success",
				title: "Event ID copied to clipboard",
				description: "Use Ctrl+V to paste",
				autoDestroy: true,
			},
		})

		toClipboard(props.event.id)
	}
	if (target == "url") {
		notificationsStore.create({
			notification: {
				type: "success",
				title: "Event URL copied to clipboard",
				description: "Use Ctrl+V to paste",
				autoDestroy: true,
			},
		})

		toClipboard(location)
	}
}

/** Context menu */
const contextMenuStyles = reactive({
	top: 0,
	left: 0,
})
const contextMenuHandler = (e) => {
	e.preventDefault()

	analytics.log("showContextMenu")

	contextMenuStyles.top = `${e.clientY}px`
	contextMenuStyles.left = `${e.clientX}px`

	openContextMenu.value = !openContextMenu.value
}

onMounted(async () => {
	if (card.value)
		card.value.addEventListener("contextmenu", contextMenuHandler)

	if (props.event.status === "FINISHED") return

	/** Subscription, TODO: refactor */
	subscription.value = await juster.gql
		.subscription({
			event: [
				{
					where: { id: { _eq: props.event.id } },
				},
				{
					id: true,
					poolAboveEq: true,
					poolBelow: true,
					totalLiquidityShares: true,
					totalValueLocked: true,