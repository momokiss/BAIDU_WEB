
<script setup>
import { computed } from "vue"
import { DateTime } from "luxon"

/**
 * UI
 */
import Tooltip from "@/components/ui/Tooltip"

/**
 * Local
 */
import EventActions from "@/components/local/EventActions"

/**
 * Services
 */
import { numberWithSymbol } from "@/services/utils/amounts"
import { pluralize } from "@/services/utils/global"
import { currentNetwork } from "@/services/sdk"
import { toReadableDuration } from "@/services/utils/date"
import { supportedMarkets, verifiedMakers } from "@/services/config"

const props = defineProps({
	event: {
		type: Object,
		required: true,
	},
	startCountdown: {
		type: String,
	},
	finishCountdown: {
		type: String,
	},
	startStatus: {
		type: String,
		required: true,
	},
	finishStatus: {
		type: String,
		required: true,
	},
	price: {
		type: Object,
	},
	isWon: {
		type: Boolean,
	},
	positionForWithdraw: {
		type: Object,
	},
	isWithdrawing: {
		type: Boolean,
	},
})
const emit = defineEmits(["openParticipants", "onBet", "onWithdraw"])

const symbol = computed(() => props.event.currencyPair.symbol)

const participantsAvatars = computed(() => {
	let avatars = [
		...props.event.bets.map((bet) => bet.userId),
		...props.event.deposits.map((deposit) => deposit.userId),
	]

	/** remove duplicates */
	avatars = [...new Set(avatars)]

	return avatars
})
