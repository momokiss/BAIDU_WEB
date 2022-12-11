import { ref, watch, reactive } from "vue"

/**
 * Services
 */
import { countdown } from "@/services/utils/date"

export const useCountdown = target => {
  const countdownText = ref("00:00:00")
  const status = ref("In progress")
  const t