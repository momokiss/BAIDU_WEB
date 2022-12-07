<script>
import { defineComponent } from "vue"

export default defineComponent({
	name: "Stat",
	props: { name: String },
})
</script>

<template>
	<div :class="$style.wrapper">
		<div :class="$style.key">{{ name }}</div>
		<div :class="$style.value">
			<slot />
		</div>
	</div>
</template>

<style module>
.wrapper {
	display: flex;
	align-