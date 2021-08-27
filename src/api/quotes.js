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

export const fetchQuotesByMarket = async ({ id, limit, offset }) => {
  try {
    if (!id || !limit)
      throw new Error(
        `${(id == undefined && "ID") ||
        (li