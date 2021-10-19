<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { computed, onBeforeUnmount, onMounted, reactive } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import { DateTime } from "luxon"

/**
 * Services
 */
import { juster, switchNetwork, currentNetwork } from "@/services/sdk"
import { capitalizeFirstLetter } from "../../services/utils/global"

/**
 * Constants
 */
// eslint-disable-next-line no-unused-vars
import { Networks } from "@/services/const