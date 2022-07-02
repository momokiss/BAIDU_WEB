
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
        readed: false,
      },
      {
        num: 4,
        name: "Place a Bet",
        readed: false,
      },
      {
        num: 5,
        name: "Track the price",
        readed: false,
      },
      {
        num: 6,
        name: "Withdraw profit 🤑",
        readed: false,
      },
    ])
    const currentStep = ref(0)
    const selectStep = (num) => {
      if (num == currentStep.value) return

      const prevStep = currentStep.value
      currentStep.value = num

      steps.forEach((step, index) => {
        if (index == prevStep) {
          step.readed = true
        }
      })
    }

    const handleOpenDocs = () => {
      accountStore.showOnboarding = false

      router.push("/docs")
      context.emit("skip")
    }

    const handleSkip = () => {
      accountStore.showOnboarding = false

      context.emit("skip")
    }

    return {
      guides,
      steps,
      currentStep,
      selectStep,
      handleOpenDocs,
      handleSkip,
    }
  },

  // eslint-disable-next-line vue/no-reserved-component-names
  components: { GuideCard, Button },
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.base">
      <div @click="handleSkip()" :class="$style.skip_btn">
        Skip onboarding
        <Icon name="logout" size="14" />
      </div>

      <img src="@/assets/logo.png" :class="$style.logo" alt="logo" />

      <div :class="$style.title">Hi, welcome to Juster ✌️</div>

      <div :class="$style.description">
        Let us guide you through the main application pages and use case
        scenarios
      </div>

      <div :class="$style.block">
        <div :class="$style.block_title">Basic Workflow</div>

        <div :class="$style.block_description">
          A step-by-step tutorial explaining how to work with Juster
        </div>

        <div :class="$style.flow_steps">
          <div v-for="(step, index) in steps" :key="step.num" @click="selectStep(index)" :class="[
            $style.flow_step,
            index == currentStep && $style.active,
          ]">
            <span v-if="!step.readed">{{ step.num }}</span>
            <Icon v-else name="checkcircle" size="14" />
            {{ step.name }}
          </div>
        </div>

        <!-- Explore Markets -->
        <div v-if="currentStep == 0" :class="$style.step">
          <div :class="$style.step_title">Explore Markets</div>
          <div :class="$style.step_description">
            Currently Juster allows to bet on cryptocurrencies price
            dynamics (in the future we will add more interesting
            feeds) and at this point you can choose between
            <i>XTZ/USD</i>, <i>ETH/USD</i>, and
            <i>BTC/USD</i> depending on your goal (hedge existing
            position, use the leverage, catch the trend, or other).
          </div>

          <div :class="$style.step_actions">
            <Button @click="selectStep(1)" type="secondary" size="small">Next step
              <Icon name="arrowright" size="16" />
            </Button>
          </div>
        </div>

        <!-- Choose Event -->
        <div v-if="currentStep == 1" :class="$style.step">
          <div :class="$style.step_title">Choose an Event</div>
          <div :class="$style.step_description">
            Events are the core entities in Juster — they contain
            the specification of two possible outcomes you can bet
            on. They differ in the period of price measurement (e.g.
            1 hour or 1 day) and the time left to the end of
            accepting bets. <br />New events are created every time
            the previous ones stop accepting bets, so there's always
            at least one event available for betting.
          </div>
