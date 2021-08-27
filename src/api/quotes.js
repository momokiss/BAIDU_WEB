/**
 * Services
 */
import { juster } from "@/services/sdk"

/**
 * GQL: Queries
 */
import {
  getQuotesByMarket,
  getQuoteByTimestamp,
  getQuoteByRange,
  getTVLByEventId,
} from "@/graphql/queries/quotes"

export const fetchQuotesByMarket = async ({ id, l