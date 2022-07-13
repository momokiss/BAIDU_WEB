<script setup>
import { computed } from "vue"
import { DateTime, Duration } from "luxon"

/**
 * UI
 */
import Badge from "@/components/ui/Badge"

/**
 * Services
 */
import { supportedMarkets } from "@/services/conf