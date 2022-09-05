
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