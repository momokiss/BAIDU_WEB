
import { reactive } from "vue"
import { DateTime } from "luxon"

/**
 * Services
 */
import { supportedMarkets } from "@/services/config"
import { juster } from "@/services/sdk"

/**
 * API
 */
import { fetchMarkets } from "@/api/markets"
import { fetchQuotesByMarket, fetchQuoteByTimestamp } from "@/api/quotes"
import { fetchUserPositionsForWithdraw } from "@/api/positions"
import { fetchUserWithdrawals } from "@/api/users"

/**
 * Store
 */
import { useMarketStore } from "@/store/market"
import { useAccountStore } from "@/store/account"

/**
 * gql
 */
import { position } from "@/graphql/models"

export const useMarket = () => {
  const marketStore = useMarketStore()
  const accountStore = useAccountStore()

  const markets = reactive([])

  const setupUser = async () => {
    /** All positions for withdraw */
    const userPositions = await fetchUserPositionsForWithdraw({
      address: accountStore.pkh,
    })
    if (userPositions.length) {
      accountStore.positionsForWithdrawal = userPositions
      accountStore.isPositionsLoading = false
    }

    /** Withdrawals */
    accountStore.withdrawals = await fetchUserWithdrawals({
      address: accountStore.pkh,
    })

    /**
     * Subscriptions
     */

    /** New Positions */
    juster.gql
      .subscription({
        position: [
          {
            where: {
              userId: {
                _eq: accountStore.pkh,
              },
              withdrawn: { _eq: false },
              value: { _neq: 0 },
              event: { status: { _eq: "FINISHED" } },
            },
          },
          {
            ...position,
          },
        ],
      })
      .subscribe({
        next: data => {
          const newPositions = data.position

          newPositions.forEach(newPosition => {
            if (
              accountStore.positionsForWithdrawal.some(
                position => position.id == newPosition.id,
              )
            )
              return

            accountStore.positionsForWithdrawal.push(newPosition)
          })
        },
        error: console.error,
      })

    /** Newly withdrawn positions */
    juster.gql
      .subscription({
        position: [
          {
            where: {
              userId: { _eq: accountStore.pkh },
              withdrawn: { _eq: true },
              event: { status: { _eq: "FINISHED" } },
            },
          },
          {
            ...position,
          },
        ],
      })
      .subscribe({
        next: data => {
          const { position: withdrawnPositions } = data

          const positionsIdsForWithdrawal = accountStore.positionsForWithdrawal.map(
            pos => pos.id,
          )
          withdrawnPositions.forEach(withdrawnPosition => {
            if (
              positionsIdsForWithdrawal.includes(
                withdrawnPosition.id,
              )
            ) {
              accountStore.removePosition(withdrawnPosition.id)
            }
          })
        },
        error: console.error,
      })
  }

  const updateWithdrawals = async () => {
    accountStore.withdrawals = await fetchUserWithdrawals({
      address: accountStore.pkh,
    })
  }

  const setupMarket = async () => {
    const allMarkets = await fetchMarkets()

    /** only available */
    markets.value = allMarkets.filter(
      market => supportedMarkets[market.symbol],
    )

    markets.value.forEach(market => {
      marketStore.setMarket({ target: market.symbol, symbol: market })
    })
    marketStore.isMarketsLoaded = true

    /** quotes */