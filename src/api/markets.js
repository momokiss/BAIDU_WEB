/**
 * Services
 */
import { juster } from "@/services/sdk"

/**
 * GQL: Queries
 */
import { getMarkets } from "@/graphql/queries/markets"

export const fetchMarkets = async () => {
  try {
    const { data } = await juster.apollo.query({ query: getMarkets })
    return data.currencyPair
  } catch (error) {
    