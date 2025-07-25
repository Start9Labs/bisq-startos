import { store } from './fileModels/store.yaml'
import { sdk } from './sdk'
import { config as bitcoinConfigAction } from 'bitcoind-startos/startos/actions/config/other'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const conf = await store.read().const(effects)

  // Only check dependencies if managing Bisq settings and using bitcoind
  if (!conf?.bisq.managesettings) {
    return {}
  }

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
    bitcoin: {
      kind: 'exists',
      versionRange: '>=28.1:3-alpha.7',
      healthChecks: ['sync-progress', 'primary'],
      description: 'Local Bitcoin node for Bisq transactions',
    },
  }
})
