
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