import { store } from './fileModels/store.yaml'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const conf = await store.read().const(effects)

  // no dependencies if we are not managing bisq settings
  if (!conf?.bisq.managesettings) {
    return {}
  }

  var serverType = conf.bisq.server.type

  if (serverType == 'bitcoind') {
    return {
      bitcoind: {
        kind: 'exists',
        // @todo update version range
        versionRange: '>=28.1:3-alpha.4',
      },
    }
  }

  return {}
})
