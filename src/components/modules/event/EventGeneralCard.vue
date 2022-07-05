
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

const timing = computed(() => {
	const eventDt = DateTime.fromISO(props.event.betsCloseTime).setLocale("en")

	const endDt = eventDt.plus(props.event.measurePeriod * 1000)

	return {
		start: {
			time: eventDt.toLocaleString({
				hour: "numeric",
				minute: "numeric",
			}),
			date: eventDt.toLocaleString({
				day: "numeric",
				month: "short",
			}),
			day: eventDt.toFormat("cccc"),
		},
		end: {
			time: endDt.toLocaleString({
				hour: "numeric",
				minute: "numeric",
			}),
			date: endDt.toLocaleString({
				day: "numeric",
				month: "short",
			}),
			day: endDt.toFormat("cccc"),
		},
		showDay: eventDt.ordinal < endDt.ordinal,
	}
})

const priceDynamics = computed(() => {
	const startRate = props.event.startRate * 100
	const closedRate = props.event.closedRate * 100

	const percent =
		props.event.status == "FINISHED"
			? (100 * Math.abs(closedRate - startRate)) /
			((closedRate + startRate) / 2)
			: (100 * Math.abs(props.price.rate - startRate)) /
			((props.price.rate + startRate) / 2)

	const diff =
		props.event.status == "FINISHED"
			? closedRate - startRate
			: props.price.rate - startRate

	return { diff, percent }
})

const endDiff = computed(() =>
	DateTime.fromISO(props.event.betsCloseTime)
		.plus({
			second: props.event.measurePeriod,
		})
		.diff(DateTime.fromISO(props.event.betsCloseTime), ["hours"])
		.toObject(),
)
</script>

<template>
	<div :class="$style.wrapper">
		<div :class="$style.header">
			<div :class="$style.title">
				<img v-if="event.winnerBets == 'ABOVE_EQ'" :src="require('@/assets/icons/higher_won.svg')"
					alt="won_side_icon" />
				<img v-else-if="event.winnerBets == 'BELOW'" :src="require('@/assets/icons/lower_won.svg')"
					alt="won_side_icon" />
				<Icon v-else name="sides" size="16" />
				{{
						supportedMarkets[symbol] && supportedMarkets[symbol].target
				}}
				<span>price event</span>
			</div>

			<div :class="$style.users">
				<Tooltip position="bottom" side="right">
					<div @click="emit('openParticipants')" :class="$style.participants">
						<img v-for="participantAvatar in participantsAvatars.slice(
							0,
							3,
						)" :key="participantAvatar" :src="`https://services.tzkt.io/v1/avatars/${participantAvatar}`"
							:class="[$style.user_avatar, $style.participant]" alt="avatar" />
						<div v-if="participantsAvatars.length > 3" :class="[
							$style.participant,
							$style.more_participants,
						]">
							+{{ participantsAvatars.length - 3 }}
						</div>
					</div>

					<template v-slot:content>Participants ({{
							participantsAvatars.length
					}})</template>
				</Tooltip>

				<Tooltip position="bottom" side="right">
					<div :class="$style.creator">
						<template v-if="
							verifiedMakers[currentNetwork].includes(
								event.creatorId,
							)
						">
							<Icon name="logo_symbol" size="24" />
							<Icon name="verified" size="16" :class="$style.verified_icon" />
						</template>

						<template v-else>
							<img :src="`https://services.tzkt.io/v1/avatars/${event.creatorId}`" :class="$style.user_avatar"
								alt="avatar" />
						</template>
					</div>

					<template v-slot:content>{{
							verifiedMakers[currentNetwork].includes(event.creatorId)
								? "Recurring event from Juster"
								: "Custom event from user"
					}}</template>
				</Tooltip>
			</div>