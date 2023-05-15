<script>
import { defineComponent } from "vue"

/**
 * Base
 */
import Page from "@/components/base/Page"

/**
 * Module
 */
import LeaderboardBase from "@/components/modules/leaderboard/LeaderboardBase"

export default defineComponent({
	name: "LeaderboardPage",

	components: { Page, LeaderboardBase },
})
</script>

<templ