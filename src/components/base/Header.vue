
<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, reactive, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { NetworkType } from "@airgap/beacon-sdk"

/**
 * Services
 */
import { juster, analytics, currentNetwork } from "@/services/sdk"

/**
 * Constants
 */
import { Networks } from "@/services/constants"

/**
 * UI
 */
import {
	Dropdown,
	DropdownItem,
	DropdownDivider,
} from "@/components/ui/Dropdown"
import Tooltip from "@/components/ui/Tooltip"

/**
 * Local
 */
import ThePendingTransaction from "./ThePendingTransaction"
import RewardAlert from "@/components/local/RewardAlert"

/**
 * Modals
 */
import ConnectingModal from "@/components/local/modals/ConnectingModal"
import CustomLoginModal from "@/components/local/modals/CustomLoginModal"

/**
 * Store
 */
import { useAccountStore } from "@/store/account"
import { useNotificationsStore } from "@/store/notifications"

/**
 * Composable
 */
import { useMarket } from "@/composable/market"

const { setupUser } = useMarket()

const notificationsStore = useNotificationsStore()
const accountStore = useAccountStore()

const showConnectingModal = ref(false)

const route = useRoute()
const router = useRouter()

const links = reactive([
	{
		name: "Explore",
		url: "/",
		icon: "bolt",
		isAvailable: true,
	},
	{
		name: "Events",
		url: "/events",
		icon: "arrows",
		isAvailable: true,
	},
	{
		name: "Markets",
		url: "/markets",
		icon: "collection",
		isAvailable: true,
	},
])

const showMobileMenu = ref(false)

const isActive = (url) => {
	if (!route.name) return

	if (url.length == 1) {
		return route.path == url
	} else {
		return route.path.startsWith(url)
	}
}

const login = () => {
	juster.sdk._provider.client.getActiveAccount().then(async (account) => {
		if (!localStorage["connectingModal"]) {
			showConnectingModal.value = true

			address.value = account.address
			network.value = account.network.type
		} else {
			analytics.log("login", { address: account.address })

			accountStore.pkh = account.address
			accountStore.updateBalance()

			setupUser()
		}
	})
}

/**
 * Default Login
 */
const address = ref("")
const network = ref("")
const handleLogin = async () => {
	await juster.sdk.sync()
	login()
}

/**
 * Custom RPC Login
 */
const showCustomLoginModal = ref(false)
const handleCustomLogin = () => {
	showCustomLoginModal.value = true
}
const handleSelectCustomNode = async (node) => {
	await juster.sdk._provider.requestPermissions({
		network: {
			type: NetworkType.CUSTOM,
			name: node.value.name,
			rpcUrl: node.value.url,
		},
	})
	login()
}

const handleAgree = () => {
	showConnectingModal.value = false

	localStorage["connectingModal"] = true

	/** analytics */
	analytics.log("registration", { address: address.value })

	accountStore.pkh = address.value
	address.value = ""

	accountStore.updateBalance()

	setupUser()
}
const handleDisagree = () => {
	showConnectingModal.value = false

	address.value = ""

	juster.sdk._provider.client.clearActiveAccount().then(async () => {
		await juster.sdk._provider.client.getActiveAccount()
		accountStore.setPkh("")
		router.push("/")
	})
}

const handleOpenProfile = () => {
	router.push("/profile")

	analytics.log("openProfile")
}

const handleOpenWithdrawals = () => {
	router.push("/withdrawals")

	analytics.log("openWithdrawals")
}

const handleLogout = () => {
	juster.sdk._provider.client.clearActiveAccount().then(async () => {
		await juster.sdk._provider.client.getActiveAccount()

		analytics.log("logout", { address: accountStore.pkh })

		accountStore.setPkh("")
		router.push("/")

		accountStore.positionsForWithdrawal = []

		notificationsStore.create({
			notification: {
				type: "success",
				title: "You are signed out",
				description:
					"To work with the application, you definitely need an account :)",
				autoDestroy: true,
			},
		})
	})
}

const pkh = computed(() => accountStore.pkh)
</script>

<template>
	<header :class="$style.wrapper">
		<CustomLoginModal :show="showCustomLoginModal" @onSelectCustomNode="handleSelectCustomNode"
			@onClose="showCustomLoginModal = false" />
		<ConnectingModal :show="showConnectingModal" :address="address" @onAgree="handleAgree" @onClose="handleDisagree" />

		<!-- Mobile menu -->
		<transition name="fade">
			<div v-if="showMobileMenu" @click="showMobileMenu = false" :class="$style.mobile_menu">
				<div :class="$style.mobile_menu__title">Navigation</div>

				<div :class="$style.mobile_menu__links">
					<router-link to="/" :class="$style.mobile_menu__link">
						<div :class="$style.left">
							<Icon name="bolt" size="14" />
							<span>Explore</span>
						</div>

						<div :class="$style.mobile_menu__description">
							Top markets, ranking, etc
						</div>
					</router-link>
					<router-link to="/events" :class="$style.mobile_menu__link">
						<div :class="$style.left">
							<Icon name="arrows" size="14" />
							<span>Events</span>
						</div>

						<div :class="$style.mobile_menu__description">
							Events with filtering
						</div>
					</router-link>
					<router-link to="/markets" :class="$style.mobile_menu__link">
						<div :class="$style.left">
							<Icon name="collection" size="14" />
							<span>Markets</span>
						</div>

						<div :class="$style.mobile_menu__description">
							Currency pairs for events
						</div>
					</router-link>
				</div>
			</div>
		</transition>

		<div :class="$style.base">
			<div :class="$style.left">
				<div @click="showMobileMenu = !showMobileMenu" :class="$style.mobile_menu_icon">
					<Icon :name="showMobileMenu ? 'close' : 'menu'" size="16" />
				</div>

				<router-link to="/" :class="$style.logo">
					<Icon name="logo_symbol" size="24" />
					<img src="@/assets/icons/logo_text.svg" alt="logo" />
				</router-link>
			</div>

			<div :class="$style.links">
				<router-link v-for="link in links" :key="link.name" :to="link.url" :class="[
					$style.link,
					isActive(link.url) && $style.active,
					!link.isAvailable && $style.disabled,
				]">
					<Icon :name="link.icon" size="12" />{{ link.name }}
				</router-link>
			</div>

			<div :class="$style.right">
				<Tooltip v-if="currentNetwork !== Networks.MAINNET" side="right">
					<div :class="$style.testnet_warning">
						<Icon name="hammer" size="16" />

						<span>Ithaca Network</span>
					</div>

					<template v-slot:content>
						Ithaca in use.
						<span>Switching the network in the footer</span>
					</template>
				</Tooltip>

				<RewardAlert :class="$style.reward_alert" />

				<div :class="$style.buttons">
					<!-- todo: sep component -->
					<div v-if="!pkh" :class="$style.signin_button">
						<div @click="handleLogin" :class="$style.signin">
							Sign in
						</div>
						<div @click="handleCustomLogin" :class="$style.custom_signin">
							<Icon name="settings" size="14" />
						</div>
					</div>

					<Dropdown>
						<template #trigger>
							<div :class="$style.avatar">
								<img v-if="pkh" :src="`https://services.tzkt.io/v1/avatars/${pkh}`" alt="avatar" />
							</div>
						</template>

						<template #dropdown>
							<div @click="handleOpenProfile" :class="$style.profile">
								<Icon name="user" size="16" />

								<div :class="$style.info">
									<div :class="$style.address">
										{{
												`${accountStore.pkh.slice(
													0,
													5,
												)}..${accountStore.pkh.slice(
													accountStore.pkh.length - 3,
													accountStore.pkh.length,
												)}`
										}}
									</div>
									<div :class="$style.balance">
										{{ accountStore.balance }}
										ꜩ
									</div>
								</div>
							</div>

							<DropdownItem @click="handleOpenWithdrawals">
								<div :class="$style.dropdown_icon">
									<Icon name="money" size="16" />
								</div>
								Withdrawals
							</DropdownItem>

							<DropdownDivider />

							<a href="https://github.com/juster-finance/juster-app/releases" target="_blank">
								<DropdownItem>
									<Icon name="merge" size="16" />Releases
								</DropdownItem>
							</a>
							<a href="https://app.juster.fi/docs" target="_blank">
								<DropdownItem>
									<Icon name="book" size="16" />Documentation
								</DropdownItem>
							</a>
							<DropdownItem @click="accountStore.showOnboarding = true">
								<Icon name="help" size="16" />Onboarding
							</DropdownItem>

							<DropdownDivider />

							<DropdownItem @click="handleLogout">
								<Icon name="logout" size="16" />Logout
							</DropdownItem>
						</template>
					</Dropdown>
				</div>
			</div>
		</div>
	</header>

	<ThePendingTransaction v-if="accountStore.pendingTransaction.awaiting" />
</template>

<style module>
.wrapper {
	position: fixed;
	top: 0;
	width: 100%;
	min-height: 80px;

	display: flex;
	align-items: center;
	justify-content: center;

	border-bottom: 1px solid var(--border);
	z-index: 2;
}

@supports (backdrop-filter: blur(5px)) {
	.wrapper {
		backdrop-filter: blur(5px);
	}
}

@supports not (backdrop-filter: blur(5px)) {
	.wrapper {
		background: var(--app-bg);
	}
}

.base {
	display: flex;
	align-items: center;
	justify-content: space-between;

	max-width: 1250px;
	width: 100%;

	margin: 0 32px;
}

.right {