import {
  VersionInfo,
  IMPOSSIBLE,
  FileHelper,
  matches,
} from '@start9labs/start-sdk'
import { storeJson } from '../../fileModels/store.json'
import { storeDefaults } from '../../utils'

const { webtop } = storeDefaults
const { title } = webtop

export const v1_9_21_1 = VersionInfo.of({
  version: '1.9.21:1-alpha.0',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      const config = await FileHelper.yaml(
        {
          volumeId: 'main',
          subpath: '/media/startos/volumes/main/start9/config.yaml',
        },
        matches.object({
          title: matches.string.optional(),
          password: matches.string.optional(),
        }),
      )
        .read()
        .once()

      await storeJson.write(effects, {
        bitcoinNode: null,
        bitcoinRpc: null,
        webtop: {
          title: config?.title || title,
          password: config?.password || null,
          reconnect: true,
        },
      })
    },
    down: IMPOSSIBLE,
  },
})
