
<script setup>
import {
	onMounted,
	onBeforeUnmount,
	onUnmounted,
	ref,
	reactive,
	computed,
} from "vue"
import { DateTime } from "luxon"

/**
 * UI
 */
import {
	Dropdown,
	DropdownItem,
	DropdownDivider,
} from "@/components/ui/Dropdown"
import Badge from "@/components/ui/Badge"
import Tooltip from "@/components/ui/Tooltip"

/**
 * Local
 */
import ParticipantsModal from "@/components/local/modals/ParticipantsModal"
import LiquidityModal from "@/components/local/modals/position/LiquidityModal"
import BetModal from "@/components/local/modals/position/BetModal"
import EventActions from "@/components/local/EventActions"

/**
 * Services
 */
import {
	toClipboard,
	getCurrencyIcon,
	capitalizeFirstLetter,
	pluralize,
} from "@/services/utils/global"
import { juster, analytics, currentNetwork } from "@/services/sdk"
import { abbreviateNumber } from "@/services/utils/amounts"
import { supportedMarkets, verifiedMakers } from "@/services/config"
import { toReadableDuration } from "@/services/utils/date"

/**
 * Composable
 */
import { useCountdown } from "@/composable/date"
import { useMarket } from "@/composable/market"

/**
 * Store
 */