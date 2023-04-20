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

                    <div :class="$style.benefit_name">
                        Transparent platform
                    </div>
                    <div :class="$style.benefit_description">
                        A platform based on a smart contract and aimed not at
                        profit, but at users
                    </div>
                </div>
                <div :class="$style.benefit">
                    <img src="@/assets/landing/benefit_2.svg" />

                    <div :class="$style.benefit_name">
                        Built for speed
                    </div>
                    <div :class="$style.benefit_description">
                        No waiting or spinners, use the app on the fly from your
                        PC or phone
                    </div>
                </div>
                <div :class="$style.benefit">
                    <img src="@/assets/landing/benefit_3.svg" />

                    <div :class="$style.benefit_name">
                        Lowest commission
                    </div>
                    <div :class="$style.benefit_description">
                        Our commissions range 0% - 0.9% and will never grow
                        higher
                    </div>
                </div>
            </div>
        </div>

        <div :class="$style.block">
            <h2>Three easy steps</h2>
            <p>
                Immediately after logging into your account, you can use the
                <span>Explore page</span>. Choose among the top events or on the
                currency pair page.
            </p>

            <div :class="$style.hint">
                <Icon name="help" size="14" />Please note that the closer the
                event starts, the higher the commission
            </div>

            <div :class="$style.steps">
                <div :class="$style.step">
                    <div :class="$style.step_img">
                        <img src="@/assets/landing/step_1.svg" />
                    </div>

                    <div :class="$style.step_base">
                        <div :class="$style.step_name">
                            1 <span>Choose an event</span>
                        </div>

                        <div :class="$style.step_description">
                            Based on the analysis or your preferences, choose an
                            event for a specific currency pair
                        </div>
                    </div>
                </div>
                <div :class="$style.step">
                    <div :class="$style.step_img">
                        <img src="@/assets/landing/step_2.svg" />
                    </div>

                    <div :class="$style.step_base">
                        <div :class="$style.step_name">
                            2 <span>Make a bet</span>
                        </div>

                        <div :class="$style.step_description">
                            Choose the amount (about <span>5%</span> of the
                            balance) and place a bet on the desired event
                        </div>
                    </div>
                </div>
                <div :class="$style.step">
                    <div :class="$style.step_img">
                        <img src="@/assets/landing/step_3.svg" />
                    </div>

                    <div :class="$style.step_base">
                        <div :class="$style.step_name">
                            3 <span>Win & Withdraw</span>
                        </div>

                        <div :class="$style.step_description">
                            For the won event, get a reward and make an instant
                            withdrawal without expectations
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div :class="$style.block">
            <h2>The right approach to betting</h2>
            <p>
                Immediately after logging into your account, you can use the
                <span>Explore page</span>. Choose among the top events or on the
                currency pair page.
            </p>
            <p>
                Immediately after logging into your account, you can use the
                <span>Explore page</span>. Choose among the top events or on the
                currency pair page.
            </p>

            <div :class="$style.stats">
                <div :class="$style.stat">
                    <div :class="$style.line">
                        <div :class="$style.highlight" />
                    </div>

                    <div :class="$style.stat_value">12+</div>
                    <div :class="$style.stat_description">
                        currency pairs currently available for betting
                    </div>
                </div>
                <div :class="$style.stat">
                    <div :class="$style.line">
                        <div :class="$style.highlight" />
                    </div>

                    <div :class="$style.stat_value">0 <span>—</span> 0.9%</div>
                    <div :class="$style.stat_description">
                        low commissions throughout the event
                    </div>
                </div>
                <div :class="$style.stat">
                    <div :class="$style.line">
                        <div :class="$style.highlight" />
                    </div>

                    <div :class="$style.stat_value"><span>~</span>15 sec</div>
                    <div :class="$style.stat_description">
                        minimum amount of time to accept your bet
                    </div>
                </div>
                <div :class="$style.stat">
                    <div :class="$style.line">
                        <div :class="$style.highlight" />
                    </div>

                    <div :class="$style.stat_value">3</div>
                    <div :class="$style.stat_description">
                        time periods available for events (1h, 6h, 24h)
                    </div>
                </div>
            </div>

            <div :class="$style.hint">
                <Icon name="help" size="14" />Please note that the closer the
                event starts, the higher the commission
            </div>
        </div>

        <div :class="$style.block">
            <h2>Key features</h2>
            <p>
                Immediately after logging into your account, you can use the
                Explore page. Choose among the top events or on the currency
                pair page.
            </p>

            <div :class="$style.features">
                <div :class="[$style.feat, $style.small]">
                    <div :class="$style.feat_subtitle">Monitoring</div>
                    <div :class="$style.feat_title">
                        Watch event changes in real time.
                        <span
                            >We will show you all the information you need to
    