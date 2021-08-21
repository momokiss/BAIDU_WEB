
<script>
import { defineComponent, onBeforeMount, ref } from "vue"

/**
 * Base
 */
import Header from "./components/base/Header"
import Footer from "@/components/base/Footer"

/** Local */
import TheWelcomeScreen from "@/components/local/onboarding/TheWelcomeScreen"

/**
 * UI
 */
import Notifications from "@/components/local/Notifications"

/**
 * Services
 */
import { juster } from "@/services/sdk"

/**
 * Store
 */
import { useAccountStore } from "@/store/account"

/**
 * Composable
 */
import { useMarket } from "@/composable/market"

export default defineComponent({
	setup() {
		const { setupMarket, setupUser } = useMarket()

		/** Favicon */
		const favicon = document.getElementById("favicon")
		const isDark = window.matchMedia("(prefers-color-scheme: dark)")

		if (isDark.matches) favicon.href = "/favicon_dark.svg"
		else favicon.href = "/favicon_light.svg"

		/**
				/**
				 * Setup account & user
				 */
		const accountStore = useAccountStore()

		onBeforeMount(() => {
			juster.sdk._provider.client
				.getActiveAccount()
				.then(async (account) => {
					if (!account) return

					accountStore.setPkh(account.address)
					accountStore.updateBalance()

					setupUser()
				})
		})

		/**
		 * Setup Market (Markets & Quotes & Subscriptinos)
		 */
		setupMarket()

		/** Onboarding */
		const showWelcomeScreen = ref(false)
		accountStore.$subscribe((mutation, state) => {
			/** forced display */
			if (state.showOnboarding) {
				showWelcomeScreen.value = true
			}

			if (state.pkh && !localStorage.isOnboardingShown) {
				localStorage.isOnboardingShown = true
				showWelcomeScreen.value = true
			}
		})

		return { showWelcomeScreen }
	},

	// eslint-disable-next-line vue/no-reserved-component-names
	components: { Header, Notifications, Footer, TheWelcomeScreen },
})
</script>

<template>
	<div id="modal" />
	<Notifications />

	<transition name="popup">
		<TheWelcomeScreen v-if="showWelcomeScreen" @skip="showWelcomeScreen = false" />
	</transition>

	<div v-if="!showWelcomeScreen" class="app_wrapper">
		<Header />
		<router-view />
		<Footer class="footer" />
	</div>
</template>

<style>
html {
	font-family: "Inter", sans-serif;
	word-spacing: 1px;
	text-rendering: optimizelegibility;
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;
	-moz-osx-font-smoothing: grayscale;
	-webkit-font-smoothing: antialiased;
	box-sizing: border-box;

	background: var(--app-bg);
}

.popup-enter-active,
.popup-leave-active {
	transition: all 0.07s ease-out;
}

.popup-enter-from,
.popup-leave-to {
	opacity: 0;
	transform: scale(0.95);
}