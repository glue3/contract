import { NearBindgen, NearPromise, near, call, view, bytes, assert } from 'near-sdk-js';
import { PublicKey } from 'near-sdk-js/lib/types'

const GLUE_ID = 'dev-1663003785845-27921924996527'
const SUFFIX = 7

@NearBindgen({})
class HelloNear {

  @call({payableFunction: true})
  deploy({ }) {
    assert(near.attachedDeposit() >= BigInt('20000000000000000000000000'), "not enough deposit")
    let signer = near.signerAccountId()
    let subaccount = signer.substring(0, signer.length - SUFFIX) + GLUE_ID
    let promise = NearPromise.new(subaccount)

    // possible promise actions, choose and chain what you need:
    promise.createAccount()
      .transfer(20_000_000_000_000_000_000_000_000n)
      .addFullAccessKey(new PublicKey(near.signerAccountPk()))
      .deployContract(includeBytes('../../../../../../Downloads/fungible_token.wasm'))
    return promise
  }

  @call({})
  createToken({ tokenName, supply, decimals, canMint, canBurn, symbol }) {
    let signer = near.signerAccountId()
    let subaccount = signer.substring(0, signer.length - SUFFIX) + GLUE_ID
    let promise = NearPromise.new(subaccount)

    promise.functionCall('new', JSON.stringify({
      total_supply: supply,
      metadata: {
        spec: "ft-1.0.0",
        name: tokenName,
        symbol: symbol,
        decimals: decimals,
      },
      can_mint: canMint,
      can_burn: canBurn,
      glue_id: GLUE_ID,
    }), '0', '5000000000000')
    return promise
  }

  @call({})
  ft_transfer({ receiver_id, amount }) {
    let signer = near.signerAccountId()
    let subaccount = signer.substring(0, signer.length - SUFFIX) + GLUE_ID
    let promise = NearPromise.new(subaccount)

    promise.functionCall('ft_transfer', JSON.stringify({
      receiver_id: receiver_id,
      amount: amount,
    }), '0', '5000000000000')

    return promise
  }
}
