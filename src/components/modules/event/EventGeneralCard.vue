
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
		</div>

		<div :class="$style.card">
			<div :class="$style.card__header">
				<div :class="[
					$style.card__status,
					event.status == 'NEW' && $style.green,
					event.status == 'STARTED' && $style.yellow,
					event.status == 'FINISHED' && $style.gray,
					event.status == 'CANCELED' && $style.gray,
				]">
					<template v-if="
						(startStatus == 'In progress') &
						(event.status == 'NEW')
					">
						<Icon name="event_new" size="14" /> New
					</template>
					<template v-else-if="
						startStatus == 'Finished' && event.status == 'NEW'
					">
						<Icon name="event_new" size="14" /> Starting
					</template>
					<template v-else-if="
						startStatus == 'Finished' &&
						event.status == 'STARTED'
					">
						<Icon name="event_active" size="14" /> Running
					</template>
					<template v-else-if="
						startStatus == 'Finished' &&
						event.status == 'FINISHED'
					">
						<Icon name="event_finished" size="14" /> Finished
					</template>
					<template v-else-if="event.status == 'CANCELED'">
						<Icon name="stop" size="14" /> Canceled
					</template>
				</div>

				<div :class="$style.card__duration">
					{{
							toReadableDuration({
								seconds: event.measurePeriod,
								asObject: true,
							}).val
					}}
					<span>
						{{
								pluralize(
									toReadableDuration({
										seconds: event.measurePeriod,
										asObject: true,
									}).val,
									toReadableDuration({
										seconds: event.measurePeriod,
										asObject: true,
									}).text,
								)
						}}
					</span>
				</div>
			</div>

			<div :class="[
				$style.card__bottom,
				event.bets.length >= 6 && $style.highdemand_radius,
			]">
				<div :class="[
					$style.card__side,
					$style.left,
					['STARTED', 'FINISHED'].includes(event.status) &&
					$style.opacity,
				]">
					<div :class="$style.card__time">
						{{ timing.start.time
						}}<span>, {{ timing.start.date }}</span>
					</div>
					<div :class="$style.card__day">{{ timing.start.day }}</div>
				</div>

				<div :class="[
					$style.card__side,
					$style.right,
					event.status == 'FINISHED' && $style.opacity,
				]">
					<div :class="$style.card__time">
						<span>{{ timing.end.date }}, </span>
						{{ timing.end.time }}
					</div>
					<div :class="$style.card__day">{{ timing.end.day }}</div>
				</div>

				<Icon name="arrowright" size="14" :class="$style.card__arrow_icon" />
			</div>

			<div v-if="event.bets.length >= 6" :class="$style.card__highdemand">
				<span>High-demand Event</span>
				<span>{{ event.bets.length }} bets&nbsp;&nbsp;•&nbsp;&nbsp;{{
						numberWithSymbol(event.totalValueLocked.toFixed(0), ",")
				}}
					liquidity</span>
			</div>
		</div>

		<div :class="$style.params">
			<!-- First Param -->
			<!-- *New/Starting* -->
			<div v-if="
				['In progress', 'Finished'].includes(startStatus) &&
				event.status == 'NEW'
			" :class="$style.param">
				<span>
					<Icon name="time" size="12" />Start
				</span>

				<span v-if="startStatus == 'In progress'">
					<!-- in X days -->
					<template v-if="endDiff.hours > 24">
						{{
								DateTime.fromISO(event.betsCloseTime)
									.setLocale("en")
									.toRelative()
						}}
					</template>
					<!-- 00:00:00 -->
					<template v-else>
						{{ startCountdown }}
					</template>
				</span>
				<span v-else-if="startStatus == 'Finished'">Soon</span>
			</div>

			<!-- *Active* -->
			<div v-else-if="
				startStatus == 'Finished' && event.status == 'STARTED'
			" :class="$style.param">
				<span>
					<Icon name="time" size="12" />Finish
				</span>

				<span v-if="finishStatus == 'In progress'">
					<!-- in X days -->
					<template v-if="endDiff.hours > 24">
						{{
								DateTime.fromISO(event.betsCloseTime)
									.setLocale("en")
									.plus({ second: event.measurePeriod })
									.toRelative()
						}}
					</template>
					<!-- 00:00:00 -->
					<template v-else>
						{{ finishCountdown }}
					</template>
				</span>
				<span v-else-if="finishStatus == 'Finished'">Soon</span>
			</div>

			<!-- *Finished* -->
			<div v-else-if="
				startStatus == 'Finished' && event.status == 'FINISHED'
			" :class="$style.param">
				<span>
					<Icon name="time" size="12" />Won Side
				</span>

				<span :class="
					priceDynamics.diff > 0
						? $style.green_icon
						: $style.red_icon
				">
					<Icon name="higher" size="12" />{{
							event.winnerBets == "ABOVE_EQ" ? "Up" : "Down"
					}}
				</span>
			</div>

			<!-- *Canceled* -->
			<div v-else-if="event.status == 'CANCELED'" :class="$style.param">
				<span>
					<Icon name="time" size="12" />Won Side
				</span>

				<span>Draw</span>
			</div>

			<!-- Second Param -->
			<!-- *New/Starting* -->
			<Tooltip v-if="
				['In progress', 'Finished'].includes(startStatus) &&
				event.status == 'NEW'
			" position="top" side="left" :button="{
	icon: 'book',
	text: 'Learn More',
	url: '/docs',
}">
				<div :class="$style.param">
					<span>
						<Icon name="sides" size="12" />Target Dynamics
					</span>

					<span>
						<Icon :name="
							(event.targetDynamics == 1 && 'checkcircle') ||
							([1.05, 0.95].includes(event.targetDynamics) &&
								'warning') ||
							'warning'
						" size="12" :style="{
	fill: `var(--${(event.targetDynamics == 1 && 'green') ||
		([1.05, 0.95].includes(
			event.targetDynamics,
		) &&
			'yellow') ||
		'red'
		})`,
}" />

						{{ event.targetDynamics * 100 - 100 }}%
					</span>
				</div>

				<template #content>Price change that separates betting pools
				</template>
			</Tooltip>

			<!-- *Active/Finished* -->
			<div v-if="
				startStatus == 'Finished' &&
				['STARTED', 'FINISHED'].includes(event.status)
			" :class="$style.param">
				<span>
					<img v-if="event.winnerBets == 'ABOVE_EQ'" :src="require('@/assets/icons/higher_won.svg')"
						alt="won_side_icon" />
					<img v-else-if="event.winnerBets == 'BELOW'" :src="require('@/assets/icons/lower_won.svg')"
						alt="won_side_icon" />
					<Icon v-else name="sides" size="12" />
					Price Dynamics
				</span>

				<span v-if="priceDynamics.diff" :class="
					priceDynamics.diff > 0
						? $style.green_full
						: $style.red_full
				">
					<Icon name="carret" size="12" />{{
							Math.abs(priceDynamics.diff).toFixed(2)
					}}
					({{ priceDynamics.percent.toFixed(2) }}%)
				</span>
				<span v-else> 0.00 (0.00%) </span>
			</div>