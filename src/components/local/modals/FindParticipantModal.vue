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
 