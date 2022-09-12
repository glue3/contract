import { NearBindgen, NearPromise, near, call, view, bytes } from 'near-sdk-js';
import { PublicKey } from 'near-sdk-js/lib/types'

@NearBindgen({})
class HelloNear {

  @call({})
  test_deploy({ }) {
    let promise = NearPromise.new('abc.dev-1663003785845-27921924996527')

    // possible promise actions, choose and chain what you need:
    promise.createAccount()
    .transfer(10_000_000_000_000_000_000_000_000n)
    .addFullAccessKey(new PublicKey(near.signerAccountPk()))
    .deployContract(includeBytes('../../../../../../Downloads/fungible_token.wasm'))

    return promise
  }
}