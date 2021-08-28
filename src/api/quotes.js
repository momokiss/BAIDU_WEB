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
        (limit == undefined && "limit")} is required`,
      )
    if (typeof id !== "number") throw new Error("ID must be a 