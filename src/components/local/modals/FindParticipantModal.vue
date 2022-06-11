<script>
import { computed, defineComponent, ref, toRefs, watch } from "vue"

/**
 * UI
 */
import Modal from "@/components/ui/Modal"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"

/**
 * Tezos
 */
import { validateAddress } from "@taquito/utils"

export default defineComponent({
  name: "FindParticipantModal",
  props: { show: Boolean },
  emits: ["onAdd"],

  setup(props, context) {
    const { show } = toRefs(props)

    const address = ref("")

    const buttonState = computed(() => {
      switch (validateAddress(address.value)) {
        case 0:
          return { text: "Invalid address format", disabled: true }

        case 1:
          return { text: "Invalid checksum", disabled: true }

        case 2:
   