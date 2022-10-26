<script setup>
import { reactive, onMounted } from "vue"
import { useMeta } from "vue-meta"

/**
 * Local
 */
import Market from "./Market"

/**
 * UI
 */
import Breadcrumbs from "@/components/ui/Breadcrumbs"

/**
 * Store
 */
import { useMarketStore } f