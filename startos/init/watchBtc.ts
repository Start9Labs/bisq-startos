import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { randomPassword } from '../utils'
import { storeJson } from '../fileModels/store.json'
import { generateRpcUserDependent } from 'bitcoind-startos/startos/actions/generateRpcUserDependent'
import { bitcoinConfFile } from 'bitcoind-startos/startos/fileModels/bitcoin.conf'
import { Effects } from '@start9labs/start-sdk/base/lib/Effects'
import { setBitcoin } from '../actions/setBitcoin'

export const watchBtc = sdk.setupOnInit(async (effects, kind) => {
  const s = await storeJson.read((s) => s).const(effects)

  if (!s) return

  if (!s.bitcoinNode) {
    await sdk.action.createOwnTask(effects, setBitcoin, 'critical', {
      reason: 'Choose which Bitcoin node to use',
    })
    return
  }

  if (s.bitcoinNode === 'local') {
    const rpc = s.bitcoinRpc
    if (!rpc || !rpc.username || !rpc.password) {
      const username = `bisq_${utils.getDefaultString({ charset: 'a-z,A-Z', len: 8 })}`
      const password = utils.getDefaultString(randomPassword())

      await storeJson.merge(
        effects,
        {
          bitcoinRpc: {
            username,
            password,
          },
        },
        { allowWriteAfterConst: true },
      )
    } else {
      let rpcAuth = await bitcoinConfFile.read((c) => c.rpcauth).const(effects)

      if (typeof rpcAuth === 'string') {
        rpcAuth = [rpcAuth]
      }

      if (!rpcAuth || !rpcAuth.some((a) => a.includes(rpc.username))) {
        await taskBitcoin(effects, rpc.username, rpc.password)
      }
    }
  }
})

async function taskBitcoin(
  effects: Effects,
  username: string,
  password: string,
) {
  await sdk.action.createTask(
    effects,
    'bitcoind',
    generateRpcUserDependent,
    'critical',
    {
      replayId: 'request-rpc-credentials',
      reason: 'Create RPC credentials for Bisq',
      input: {
        kind: 'partial',
        value: {
          username,
          password,
        },
      },
    },
  )
}
