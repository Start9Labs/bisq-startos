import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { bisqProperties } from '../fileModels/bisq.properties'
import { bitcoinPeer } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  bitcoinNode: Value.select({
    name: 'Bitcoin Node',
    description:
      'Choose whether to use your local Bitcoin node or a remote third party node',
    values: {
      local: 'Bitcoin node on StartOS',
      remote: 'Remote 3rd party node',
    },
    default: 'local',
  }),
})

export const setBitcoin = sdk.Action.withInput(
  // id
  'bitcoin',

  // metadata
  async ({ effects }) => ({
    name: 'Bitcoin Node Settings',
    description: 'Decide which Bitcoin node to use',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) =>
    storeJson
      .read((s) => ({
        bitcoinNode: s.bitcoinNode ? ('local' as const) : ('remote' as const),
      }))
      .once(),

  // the execution function
  async ({ effects, input }) => {
    await bisqProperties.merge(effects, { btcNodes: bitcoinPeer })
    await storeJson.merge(effects, {
      bitcoinNode: input.bitcoinNode,
    })
  },
)
