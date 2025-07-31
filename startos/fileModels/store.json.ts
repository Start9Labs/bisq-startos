import { matches, FileHelper, T } from '@start9labs/start-sdk'
import { storeDefaults } from '../utils'
const { object, string, boolean, literals } = matches
const { bitcoinNode, bitcoinRpc, webtop } = storeDefaults
const { title, password, reconnect } = webtop

const shape = object({
  bitcoinNode: literals('local', 'remote').nullable().onMismatch(bitcoinNode),
  bitcoinRpc: object({
    username: string,
    password: string,
  })
    .nullable()
    .onMismatch(bitcoinRpc),
  webtop: object({
    title: string.onMismatch(title),
    password: string.nullable().onMismatch(password),
    reconnect: boolean.onMismatch(reconnect),
  }),
})

export const storeJson = FileHelper.json(
  {
    volumeId: 'main',
    subpath: 'store.json',
  },
  shape,
)
