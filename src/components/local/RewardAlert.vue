<script setup>
import { computed } from "vue"

/**
 * Utils
 */
import { f } from "@/services/utils/amounts"

/**
 * Store
 */
import { useAccountStore } from "@/store/account"

/**
 * UI
 */
import Tooltip from "@/components/ui/Tooltip"

const accountStore = useAccoun