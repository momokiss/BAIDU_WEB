<script>
import { defineComponent, toRefs, computed, useCssModule } from "vue"

export default defineComponent({
  name: "Button",
  props: {
    size: {
      type: String,
      default: "medium",
    },
    type: {
      type: String,
      default: "primary",
    },
    block: {
 