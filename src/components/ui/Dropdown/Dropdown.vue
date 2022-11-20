<script>
import { defineComponent, ref, reactive, watch, nextTick, toRefs } from "vue"

/**
 * Composable
 */
import { useOnOutsidePress } from "@/composable/onOutside"

export default defineComponent({
  name: "Dropdown",
  props: {
    forceOpen: Boolean,
    side: {
      type: String,
      default: "bot