
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