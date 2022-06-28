
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

			if (countdownStatus.value !== 'In progress') return { text: 'Acceptance of bets is closed', disabled: true }
			if (sendingLiquidity.value) return { text: 'Awaiting confirmation..', disabled: true }

			if (amount.value > accountStore.balance) return { text: 'Insufficient funds', disabled: true }

			if (!amount.value) return { text: 'Select the liquidity amount', disabled: true }
			if (amount.value) return { text: 'Provide liquidity', disabled: false }
		})

		const showHint = reactive({
			confirmationDelay: false,
			aborted: false,
		})

		const handleProvideLiquidity = () => {
			if (buttonState.value.disabled) return

			sendingLiquidity.value = true

			setTimeout(() => {
				showHint.confirmationDelay = true
			}, 5000)

			juster.sdk
				.provideLiquidity(
					event.value.id,
					new BigNumber(event.value.poolAboveEq),
					new BigNumber(event.value.poolBelow),
					new BigNumber(slippage.value / 100),
					new BigNumber(amount.value)
				)
				.then((op) => {
					/** Pending transaction label */
					accountStore.pendingTransaction.awaiting = true

					op.confirmation()
						.then((result) => {
							accountStore.pendingTransaction.awaiting = false

							if (!result.completed) {
								// todo: handle it?
							}
						})
						// eslint-disable-next-line no-unused-vars
						.catch((err) => {
							accountStore.pendingTransaction.awaiting = false
						})

					sendingLiquidity.value = false
					showHint.confirmationDelay = false
					showHint.aborted = false

					/** slow notification to get attention */
					setTimeout(() => {
						notificationsStore.create({
							notification: {
								type: 'success',
								title: 'Your liquidity has been accepted',
								description: 'We need to process your bet, it will take 15-30 seconds',
								autoDestroy: true,
							},
						})
					}, 700)

					/** analytics */
					analytics.log('onLiquidity', {
						eventId: event.value.id,
						amount: amount.value,
						tts: DateTime.fromISO(event.value.betsCloseTime).ts - DateTime.now().ts,
					})

					context.emit('onClose')
				})
				.catch((err) => {
					sendingLiquidity.value = false
					showHint.confirmationDelay = false

					if (err.title == 'Aborted') showHint.aborted = true
				})
		}

		/** Login */
		const handleLogin = async () => {
			await juster.sdk.sync()
			juster.sdk.getPkh().then((pkh) => {
				accountStore.setPkh(pkh)
			})

			context.emit('onClose')
		}

		return {
			accountStore,
			countdownText,
			countdownStatus,
			amountInput,
			amount,
			slippage,
			sendingLiquidity,
			liquidityRatio,
			shares,
			showHint,
			handleProvideLiquidity,
			handleLogin,
			buttonState,
			verifiedMakers,
			currentNetwork,
		}
	},

	emits: ['onClose'],
	components: {
		Modal,
		// eslint-disable-next-line vue/no-reserved-component-names
		Input,
		Stat,
		// eslint-disable-next-line vue/no-reserved-component-names
		Button,
		Spin,
		Banner,
		PositionDirection,
		SplittedPool,
		SlippageSelector,
	},
})
</script>

<template>
	<Modal :show="show" width="500" closable @onClose="$emit('onClose')">
		<template v-if="accountStore.isLoggined">
			<div :class="$style.title">Providing liquidity</div>

			<Banner v-if="currentNetwork !== 'mainnet'" icon="hammer" color="yellow" size="small" center