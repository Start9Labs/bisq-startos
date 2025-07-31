import { sdk } from '../sdk'
import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  title: Value.text({
    name: 'Webtop Title',
    description:
      'This value will be displayed as the title of your browser tab.',
    required: true,
    default: 'Bisq on StartOS',
    placeholder: 'Bisq on StartOS',
    patterns: [utils.Patterns.ascii],
  }),
  reconnect: Value.toggle({
    name: 'Automatically reconnect',
    description:
      'Automatically reconnect when the connection to the desktop is lost or the browser tab has been idle for too long.',
    default: false,
  }),
})

export const webtop = sdk.Action.withInput(
  // id
  'webtop',

  // metadata
  async ({ effects }) => ({
    name: 'Webtop Settings',
    description: 'Customize your Bisq Webtop experience',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => storeJson.read((s) => s.webtop).once(),

  // the execution function
  ({ effects, input }) => storeJson.merge(effects, { webtop: input }),
)
