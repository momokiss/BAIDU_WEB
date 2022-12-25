import { ref, isRef, watch } from "vue"

const events = ["mousedown", "touchstart"]

export function useOnOutsidePress(el, onOutsidePressCallback) {
  const element = isRef(el) ? el : ref(el)

  const handler