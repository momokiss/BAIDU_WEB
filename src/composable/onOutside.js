import { ref, isRef, watch } from "vue"

const events = ["mousedown", "touchstart"]

export function useOnOutsidePress(el, onOutsidePressCallback) {
  const element = isRef(el) ? el : ref(el)

  const handler = e =>
    element.value &&
    !element.value.contains(e.target) &&
    onOutsidePressCallback(e)

  const event = events.find(x => `on${x}`)
  return useEvent(document, event, handler, { passive: true })
}

export function useEvent(el, name, listener, options) {
  let rem