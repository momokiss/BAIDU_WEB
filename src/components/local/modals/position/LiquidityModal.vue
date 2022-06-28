
<!-- eslint-disable no-dupe-keys -->
<script>
import { defineComponent, ref, reactive, computed, toRefs, watch, nextTick } from 'vue'
import BigNumber from 'bignumber.js'
import { DateTime } from 'luxon'

/**
 * Services
 */
import { juster, currentNetwork, analytics } from '@/services/sdk'
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
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Stat from '@/components/ui/Stat'
import Button from '@/components/ui/Button'
import Spin from '@/components/ui/Spin'
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
	name: 'LiquidityModal',
	props: { show: Boolean, event: Object },
	emits: ['onClose'],

	setup(props, context) {
		const { event, show } = toRefs(props)

		const accountStore = useAccountStore()
		const notificationsStore = useNotificationsStore()

		const amountInput = ref(null)

		/** Countdown setup */
		const eventStartTime = computed(() => new Date(event.value?.betsCloseTime).getTime())
		const { countdownText, status: countdownStatus, stop } = useCountdown(eventStartTime)

		/** User inputs */
		const amount = reactive({ value: 0, error: '' })
		const slippage = ref(2.5)

		const sendingLiquidity = ref(false)

		const liquidityRatio = computed(() => {
			const abRatio = event.value.poolBelow / event.value.poolAboveEq
			const slippageMultiplier = 1 + slippage.value / 100

			return {
				min: abRatio / slippageMultiplier,
				max: abRatio * slippageMultiplier,
			}
		})
		const shares = computed(() => {
			const bigPool = Math.max(event.value.poolBelow, event.value.poolAboveEq)

			return (event.value.totalLiquidityShares * (!amount.value ? 0 : amount.value)) / bigPool
		})

		const onKeydown = (e) => {
			if (e.code == 'Enter') {
				e.preventDefault()
				handleProvideLiquidity()
			}
		}

		watch(show, () => {
			if (!show.value) {
				amount.value = 0
				sendingLiquidity.value = false

				stop()

				document.removeEventListener('keydown', onKeydown)

				showHint.confirmationDelay = false
				showHint.aborted = false
			} else {
				accountStore.updateBalance()

				document.addEventListener('keydown', onKeydown)

				/** auto-focus input */
				nextTick(() => {
					amountInput.value.$el.querySelector('input').focus()
				})
			}
		})

		watch(amount, () => {
			if (!amount.value) amount.value = ''
		})

		// eslint-disable-next-line vue/return-in-computed-property
		const buttonState = computed(() => {
			if (accountStore.pendingTransaction.awaiting) {
				return {
					text: 'Previous transaction in process',
					disabled: true,
				}
			}
