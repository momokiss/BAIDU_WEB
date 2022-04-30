<script setup>
import { computed } from "vue"
import { DateTime } from "luxon"

/**
 * UI
 */
import Modal from "@/components/ui/Modal"

/**
 * Services
 */
import { toReadableDuration } from "@/services/utils/date"

const props = defineProps({ show: { type: Boolean }, event: { type: Object } })

c