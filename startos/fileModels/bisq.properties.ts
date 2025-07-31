import { matches, FileHelper } from '@start9labs/start-sdk'
import { bisqDefaults } from '../utils'
const { object, string, literal } = matches

const {
  useTorForBtc,
  btcNodes,
  bannedSeedNodes,
  bannedBtcNodes,
  bannedPriceRelayNodes,
} = bisqDefaults

const shape = object({
  useTorForBtc: literal(useTorForBtc).onMismatch(useTorForBtc),
  btcNodes: literal(btcNodes).onMismatch(btcNodes),
  bannedSeedNodes: string.onMismatch(bannedSeedNodes),
  bannedBtcNodes: string.onMismatch(bannedBtcNodes),
  bannedPriceRelayNodes: string.onMismatch(bannedPriceRelayNodes),
})

// @TODO might need raw helper to handle lists, maybe not
export const bisqProperties = FileHelper.ini(
  {
    volumeId: 'userdir',
    subpath: '.local/share/Bisq/bisq.properties',
  },
  shape,
)
