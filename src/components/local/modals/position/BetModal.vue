
<script>
import { defineComponent, ref, reactive, computed, toRefs, watch, nextTick } from 'vue'
import BigNumber from 'bignumber.js'
import { estimateFeeMultiplier } from '@juster-finance/sdk'
import { DateTime } from 'luxon'

/**
 * Services
 */
import { juster, analytics, currentNetwork } from '@/services/sdk'
import { verifiedMakers } from '@/services/config'

/**
 * Local
 */
import SplittedPool from '@/components/local/SplittedPool'
import SlippageSelector from '@/components/local/SlippageSelector'

import PositionDirection from './PositionDirection'

/**
 * UI
 */
import Spin from '@/components/ui/Spin'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Banner from '@/components/ui/Banner'

/**
 * Store
 */
import { useAccountStore } from '@/store/account'
import { useNotificationsStore } from '@/store/notifications'

/**
 * Composable
 */
import { useCountdown } from '@/composable/date'

export default defineComponent({
	name: 'BetModal',
	props: {
		show: Boolean,
		event: Object,
		preselectedSide: { type: String, default: 'Rise' },
	},
	emits: ['onClose', 'onBet'],

	setup(props, context) {
		const { event, show, preselectedSide } = toRefs(props)

		const accountStore = useAccountStore()
		const notificationsStore = useNotificationsStore()

		const amountInput = ref(null)

		/** Countdown setup */
		const eventStartTime = computed(() => new Date(event.value?.betsCloseTime).getTime())
		const { countdownText, status: countdownStatus, stop } = useCountdown(eventStartTime)

		/** User inputs */
		const side = ref(preselectedSide.value)
		const amount = reactive({ value: 0, error: '' })
		const slippage = ref(2.5)

		const sendingBet = ref(false)

		/**
		 * Ratio
		 */
		const ratio = computed(() => {
			return {
				rise: event.value.poolBelow / (event.value.poolAboveEq + amount.value),
				fall: event.value.poolAboveEq / (event.value.poolBelow + amount.value),
			}
		})
		const ratioBeforeBet = computed(() => {
			return {
				rise: event.value.poolBelow / event.value.poolAboveEq,
				fall: event.value.poolAboveEq / event.value.poolBelow,
			}
		})
		const ratioAfterBet = computed(
			() =>
				(side.value == 'Rise' &&
					(event.value.poolBelow - winDelta.value) / (event.value.poolAboveEq + amount.value)) ||
				(side.value == 'Fall' &&
					(event.value.poolAboveEq - winDelta.value) / (event.value.poolBelow + amount.value))
		)

		const fee = computed(() =>
			estimateFeeMultiplier(
				{
					betsCloseTime: new Date(event.value.betsCloseTime),
					createdTime: new Date(event.value.createdTime),
					liquidityPercent: event.value.liquidityPercent,
				},
				new Date()
			)
		)

		/** Reward */
		const winDelta = computed(() => {
			const selectedRatio = side.value == 'Rise' ? ratio.value.rise : ratio.value.fall

			return amount.value * selectedRatio * (1 - fee.value)
		})
		const reward = computed(() => winDelta.value + amount.value)
		const minReward = computed(() => winDelta.value * (1 - slippage.value / 100) + amount.value)

		// eslint-disable-next-line vue/return-in-computed-property
		const rewardText = computed(() => {
			if (!amount.value) {
				return 0
			}

			if (amount.value) {
				if (minReward.value == reward.value) {
					return reward.value.toFixed(2)
				} else {
					return `${minReward.value.toFixed(2)} - ${reward.value.toFixed(2)}`
				}
			}
		})

		const selectTab = (tab) => {
			side.value = tab
		}

		const onKeydown = (e) => {
			if (e.code == 'Enter') {
				e.preventDefault()
				handleBet()
			}
		}

		watch(show, () => {
			if (!show.value) {
				side.value = null

				amount.value = 0

				stop()

				document.removeEventListener('keydown', onKeydown)

				showHint.confirmationDelay = false
				showHint.aborted = false