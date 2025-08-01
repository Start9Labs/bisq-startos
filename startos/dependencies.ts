import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'
import { config as bitcoinConfigAction } from 'bitcoind-startos/startos/actions/config/other'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const wantsBitcoin = await storeJson
    .read((s) => s.bitcoinNode === 'local')
    .const(effects)

  if (!wantsBitcoin) return {}

  // Create configuration task for Bitcoin
  await sdk.action.createTask(
    effects,
    'bitcoin',
    bitcoinConfigAction,
    'critical',
    {
      input: {
        kind: 'partial',
        value: {
          peerbloomfilters: true,
        },
      },
      reason:
        'Bisq requires Bitcoin with bloom filters enabled for SPV wallet functionality',
      when: { condition: 'input-not-matches', once: false },
      replayId: 'enable-peerbloomfilters',
    },
  )

  // Return Bitcoin dependency requirements
  return {
    bitcoind: {
      kind: 'running',
      versionRange: '>=28.1:3-alpha.8',
      healthChecks: ['sync-progress', 'primary'],
      description: 'Local Bitcoin node for Bisq transactions',
    },
  }
})
