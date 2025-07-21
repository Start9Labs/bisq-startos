import { store } from './fileModels/store.yaml'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const conf = await store.read().const(effects)

  // no dependencies if we are not managing  settings
  if (!conf?..managesettings) {
    return {}
  }

  var serverType = conf..server.type

  if (serverType == 'electrs') {
    return {
      electrs: {
        kind: 'exists',
        // @todo update version range
        versionRange: '>=0.10.9:1-alpha.1',
      },
    }
  }

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
