
<script>
import icons from "./icons.json"

export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: "Icon",
	props: {
		name: { type: String, required: true },
		size: String,
		color: String,
	},
	computed: {
		calcSize() {
			return {
				minWidth: `${this.size}px`,
				minHeight: `${this.size}px`,
			}
		},
	},
	methods: {
		getPath() {
			return icons[this.name.charAt(0).toLowerCase() + this.name.slice(1)]
		},
		isSplitted() {
			return (
				typeof icons[
				this.name.charAt(0).toLowerCase() + this.name.slice(1)
				] == "object"
			)
		},
	},