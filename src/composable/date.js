import { ref, watch, reactive } from "vue"

/**
 * Services
 */
import { countdown } from "@/services/utils/date"

export const useCountdown = target => {
  const countdownText = ref("00:00:00")
  const status = ref("In progress")
  const time = reactive({ d: 0, h: 0, m: 0 })

  let countdownInterval

  const start = () => {
    const { d, h, m, s, distance } = countdown({
      target: target.value,
      now: new Date().getTime(),
    })

    if (distance < 0) {
      status.val