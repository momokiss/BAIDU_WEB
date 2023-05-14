
<script setup>
/**
 * Base
 */
import Page from "@/components/base/Page"

/**
 * UI
 */
import Button from "@/components/ui/Button"
import Banner from "@/components/ui/Banner"

/**
 * Services
 */
import { juster, switchNetwork } from "@/services/sdk"

const handleSwitch = () => {
	juster.sdk._provider.client.clearActiveAccount().then(async () => {
		switchNetwork("mainnet")
	})
}
</script>

<template>
	<Page :class="$style.wrapper">
		<img src="@/assets/landing/ga_bg.png" alt="bg" :class="$style.background_grad" />

		<div :class="$style.header">
			<Icon name="logo_symbol" size="40" />

			<h1>Juster is now available on the Mainnet</h1>

			<div :class="$style.when">17 February 2022</div>
		</div>

		<div :class="$style.content">
			<p>