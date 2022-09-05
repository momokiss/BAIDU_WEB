
<script>
import { defineComponent, ref, onMounted, computed, watch } from "vue"
import { useRouter } from "vue-router"
import { useMeta } from "vue-meta"

/**
 * UI
 */
import Button from "@/components/ui/Button"
import Tooltip from "@/components/ui/Tooltip"
import Pagination from "@/components/ui/Pagination"

/**
 * Local
 */
import { EventCard } from "@/components/local/EventCard"

/**
 * Services
 */
import { currentNetwork, fetchBalance } from "@/services/sdk"
import { toClipboard } from "@/services/utils/global"
import { abbreviateNumber } from "@/services/utils/amounts"

/**
 * API
 */
import { fetchUser } from "@/api/users"
import { fetchAllUserPositions } from "@/api/positions"

/**
 * Store
 */
import { useAccountStore } from "@/store/account"
import { useNotificationsStore } from "@/store/notifications"

export default defineComponent({
	name: "ProfileBase",

	setup() {
		const router = useRouter()

		const accountStore = useAccountStore()
		const notificationsStore = useNotificationsStore()

		const isMyProfile = computed(
			() => !router.currentRoute.value.params.address,
		)

		const user = ref(null)
		const balance = ref(0)
		const address = computed(() =>
			isMyProfile.value
				? accountStore.pkh
				: router.currentRoute.value.params.address,
		)

		const events = ref([])

		/** pagination */
		const selectedPageForEvents = ref(1)
		const paginatedEvents = computed(() =>
			events.value.slice(
				(selectedPageForEvents.value - 1) * 6,
				selectedPageForEvents.value * 6,
			),
		)

		/** Balance */
		const getUserBalance = async () => {
			balance.value = await fetchBalance(address.value)
		}

		if (!isMyProfile.value) {
			getUserBalance()
		} else {
			accountStore.updateBalance()
		}

		const isProfileLoaded = ref(false)

		const getUserData = async () => {
			user.value = await fetchUser({ address: address.value })

			isProfileLoaded.value = true

			const positions = await fetchAllUserPositions({
				address: address.value,
			})
			events.value = positions
				.filter((position) => position.value)
				.map((position) => position.event)
		}

		onMounted(() => {
			if (
				address.value.length !== 36 ||
				(!isMyProfile.value && accountStore.pkh == address.value)
			) {
				router.push("/profile")
				return
			}

			getUserData()
		})

		watch(router.currentRoute, () => {
			getUserData()
		})

		const handleCopyAddress = () => {
			toClipboard(address.value)

			notificationsStore.create({
				notification: {
					type: "success",
					title: "Copied to clipboard",
					description: "You have copied the user's address",
					autoDestroy: true,
				},
			})
		}

		const handleBack = () => {
			router.back()
		}

		/** Meta */
		const { meta } = useMeta({
			title: `My profile`,
		})

		return {
			handleCopyAddress,
			handleBack,
			isProfileLoaded,
			accountStore,
			user,
			balance,
			isMyProfile,
			address,
			events,
			selectedPageForEvents,
			paginatedEvents,
			abbreviateNumber,
			currentNetwork,
		}
	},

	components: { Button, Tooltip, EventCard, Pagination },
})
</script>

<template>
	<div v-if="user && isProfileLoaded" :class="$style.wrapper">
		<metainfo>
			<template v-slot:title="{ content }">{{ content }} • Juster</template>
		</metainfo>

		<h2 :class="$style.profile_title">
			{{ isMyProfile ? "My profile" : `User account` }}
		</h2>

		<div :class="$style.header">
			<div :class="$style.profile">
				<div :class="$style.avatar">
					<Tooltip>
						<img :src="`https://services.tzkt.io/v1/avatars/${address}`" :class="$style.image" alt="avatar" />

						<template v-slot:content>This avatar is supported by TzKT.io</template>
					</Tooltip>
				</div>

				<div @click="handleCopyAddress" :class="$style.username">
					{{
							`${address.slice(0, 8)}..${address.slice(
								address.length - 3,
								address.length,
							)}`
					}}
					<Icon name="copy" size="14" />
				</div>
				<div :class="$style.status">
					{{ isMyProfile ? accountStore.balance : balance }}
					ꜩ
				</div>

				<div :class="$style.progress">
					<div :class="$style.head">
						<div :class="$style.tier">Tier 1</div>

						<div :class="$style.exp">Exp 0</div>
					</div>

					<div :class="$style.line" />
				</div>

				<div :class="$style.badges">
					<img src="@/assets/badge.png" :class="$style.badge" alt="badge" />
					<img src="@/assets/badge.png" :class="$style.badge" alt="badge" />
					<img src="@/assets/badge.png" :class="$style.badge" alt="badge" />
					<img src="@/assets/badge.png" :class="$style.badge" alt="badge" />
				</div>
			</div>

			<div :class="$style.statistics">
				<h3 :class="$style.title">Statistics</h3>

				<div :class="$style.block">
					<div :class="$style.stat">
						<div :class="$style.key">Liquidity provided</div>
						<div :class="$style.value">
							{{ abbreviateNumber(user.totalLiquidityProvided) }}
							<span>ꜩ</span>
						</div>
					</div>
					<div :class="$style.stat">
						<div :class="$style.key">Net return</div>
						<div :class="$style.value">
							{{ abbreviateNumber(user.totalProviderReward) }}
							<span>ꜩ</span>
						</div>
					</div>
					<div :class="$style.stat">
						<div :class="$style.key">Fees collected</div>
						<div :class="$style.value">
							{{ user.totalFeesCollected.toFixed(0) }}
							<span>ꜩ</span>
						</div>
					</div>
				</div>

				<div :class="$style.divider" />

				<div :class="$style.block">
					<div :class="$style.stat">
						<div :class="$style.key">Bets value</div>
						<div :class="$style.value">
							{{ user.totalBetsAmount }}
							<span>ꜩ</span>
						</div>
					</div>
					<div v-if="user.totalWithdrawn" :class="$style.stat">
						<div :class="$style.key">Withdrawn</div>
						<div :class="$style.value">
							{{ abbreviateNumber(user.totalWithdrawn) }}
							<span>ꜩ</span>
						</div>
					</div>
					<div :class="$style.stat">
						<div :class="$style.key">Bets</div>
						<div :class="$style.value">
							{{ user.totalBetsCount }}
						</div>
					</div>
					<div :class="$style.stat">
						<div :class="$style.key">Favorite Market</div>
						<div :class="$style.value">TBD</div>
					</div>