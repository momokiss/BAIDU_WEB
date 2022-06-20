
<script>
import { defineComponent, ref, reactive, computed, toRefs, watch, nextTick } from 'vue'
import BigNumber from 'bignumber.js'
import { estimateFeeMultiplier } from '@juster-finance/sdk'
import { DateTime } from 'luxon'

/**
 * Services
 */
import { juster, analytics, currentNetwork } from '@/services/sdk'
import { verifiedMakers } from '@/services/config'

/**
 * Local