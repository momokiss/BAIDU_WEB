import { OpKind } from "@taquito/taquito"

/**
 * Services
 */
import { juster } from "@/services/sdk"
import { contracts } from "@/services/config"

export const withdrawAll = async ({ eventIds, address }) => {
  try {
    const contract = await juster.sdk._tezos.contract.a