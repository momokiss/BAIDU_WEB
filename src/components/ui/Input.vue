
<script>
export default {
  name: "Input",
  props: {
    type: {
      type: String,
    },
    label: {
      type: String,
    },
    subtext: {
      type: String,
    },
    placeholder: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number],
    },
    disabled: {
      type: Boolean,
    },
    limit: {
      type: Number,
    },
  },

  data() {
    return {
      isFocused: false,

      text: this.modelValue ? this.modelValue : "",
    }
  },

  watch: {
    modelValue() {
      this.text = this.modelValue
    },
  },
  computed: {
    getInputType() {
      if (!!this.type) return this.type
      return "text"
    },