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
		<di