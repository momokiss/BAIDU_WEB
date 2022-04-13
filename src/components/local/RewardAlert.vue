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

const accountStore = useAccountStore()

const reward = computed(() => {
  const total = accountStore.wonPositions.reduce(
    (acc, curr) => (acc += curr.value),
    0,
  )

  return f(t