<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { computed, onBeforeUnmount, onMounted, reactive } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import { DateTime } from "luxon"

/**
 * Services
 */
import { juster, switchNetwork, currentNetwork } from "@/services/sdk"
import { capitalizeFirstLetter } from "../../services/utils/global"

/**
 * Constants
 */
// eslint-disable-next-line no-unused-vars
import { Networks } from "@/services/constants"

/**
 * Store
 */
import { useMarketStore } from "@/store/market"
const marketStore = useMarketStore()

/**
 * UI
 */
// import Button from "@/components/ui/Button"
// import Tooltip from "@/components/ui/Tooltip"
// import { Dropdown, DropdownItem, DropdownTitle } from "