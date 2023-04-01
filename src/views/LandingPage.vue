<script>
/**
 * Base
 */
import Page from "@/components/base/Page"

/**
 * UI
 */
import Button from "@/components/ui/Button"

export default {
  name: "LandingPage",

  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Page, Button },
}
</script>

<template>
  <Page :class="$style.wrapper">
    <div :class="$style.header">
      <!-- <a
                href="https://verbose-krill-7ef.notion.site/Juster-Roadmap-786c58fbd0a8435994d2890202c0ddbf"
                target="_blank"
                :class="$style.roadmap"
            >
                <Icon name="map" size="16" />

                <div :class="$style.roadmap_name">
                    First Step — <span>MVP</span>
                </div>

                <div :class="$style.dot" />

                <div :class="$style.roadmap_link">View our Roadmap</div>
            </a>-->

      <h1>Decentralized Betting Protocol</h1>
      <div :class="$style.description">
        <span>Juster</span> is an on-chain smart contract platform
        allowing users to take part in an automated betting market by
        creating events, providing liquidity to them, and making bets.
      </div>

      <div :class="$style.buttons">
        <router-link to="/">
          <Button type="primary" size="medium">
            <Icon name="spark" size="16" />Launch Juster app
          </Button>
        </router-link>
        <router-link to="/docs">
          <Button type="secondary" size="medium">
            <Icon name="book" size="16" />Read the docs
          </Button>
        </router-link>
      </div>

      <div :class="$style.promo">
        <div :class="$style.promo_video">
          <iframe width="560" height="315"
            src="https://www.youtube.com/embed/rOYu2Qpbpdw?controls=0&modestbranding=1&rel=0" title="Juster promo"
            frameborder="0" allow allowfullscreen></iframe>
        </div>
      </div>

      <!-- <img
                src="@/assets/landing/app.png"
                width="1100"
                height="734"
                :class="$style.app_img"
            />-->

      <div :class="$style.hint">
        <Icon name="help" size="14" />Juster is built on
        <span>Tezos</span> blockchain and uses
        <span>Harbinger</span> oracle price feed
      </div>
    </div>

    <!-- <div :class="$style.block">
            <div :class="$style.benefits">
                <div :class="$style.benefit">
                    <img src="@/assets/landing/benefit_1.svg" />

                    <div :class="