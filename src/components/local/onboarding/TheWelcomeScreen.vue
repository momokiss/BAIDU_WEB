
<script>
import { defineComponent, reactive, ref } from "vue"
import { useRouter } from "vue-router"

/**
 * Local
 */
import GuideCard from "./GuideCard"

/**
 * UI
 */
import Button from "@/components/ui/Button"

/**
 * Store
 */
import { useAccountStore } from "@/store/account"

export default defineComponent({
  name: "TheWelcomeScreen",

  setup(props, context) {
    const router = useRouter()

    const accountStore = useAccountStore()

    const guides = [
      {
        type: "Basic",
        title: "Connect wallet",
        color: "blue",
        link: "/docs/wallets",
      },
      {
        type: "Basic",
        title: "Explore markets",
        color: "orange",
        link: "/docs/explore-markets",
      },
      {
        type: "Basic",
        title: "Placing bets",
        color: "green",
        link: "/docs/how-to-bet",
      },
      {
        type: "Advanced",
        title: "Providing liquidity",
        color: "yellow",
        link: "/docs/adding-liquidity",
      },
    ]

    const steps = reactive([
      {
        num: 1,
        name: "Explore markets",
        readed: false,
      },
      {
        num: 2,
        name: "Сhoose an Event",
        readed: false,
      },
      {
        num: 3,
        name: "Connect your wallet",