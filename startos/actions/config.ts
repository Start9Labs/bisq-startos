import { sdk } from '../sdk'
import { T, utils } from '@start9labs/start-sdk'
import { createDefaultStore, store } from '../fileModels/store.yaml'
import { Variants } from '@start9labs/start-sdk/base/lib/actions/input/builder'

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
  username: Value.text({
    name: 'Username',
    description: 'The username for logging into your Webtop.',
    required: true,
    default: 'webtop',
    placeholder: '',
    masked: false,
    patterns: [utils.Patterns.ascii],
  }),
  password: Value.text({
    name: 'Password',
    description: 'The password for logging into your Webtop.',
    required: true,
    generate: {
      charset: 'a-z,0-9',
      len: 20,
    },
    default: { charset: 'a-z,0-9', len: 20 },
    placeholder: '',
    masked: true,
    minLength: 8,
  }),
  reconnect: Value.toggle({
    name: 'Automatically reconnect',
    description:
      'Automatically reconnect when the connection to the desktop is lost or the browser tab has been idle for too long.',
    default: false,
  }),
  bisq: Value.object(
    {
      name: 'Bisq settings',
      description: 'Bisq settings',
    },
    InputSpec.of({
      managesettings: Value.toggle({
        name: 'Apply settings on startup',
        description:
          'Disable to manage your own server and proxy settings in Bisq',
        default: true,
      }),
      server: Value.dynamicUnion(async ({ effects }) => {
        // determine default server type and disabled options
        const installedPackages = await effects.getInstalledPackages()
        let serverType: 'electrs' | 'bitcoind' | 'public' = 'public'
        let disabled: string[] = []

        if (installedPackages.includes('bitcoind')) {
          serverType = 'bitcoind'
        } else {
          disabled.push('bitcoind')
        }

        if (installedPackages.includes('electrs')) {
          serverType = 'electrs'
        } else {
          disabled.push('electrs')
        }

        return {
          name: 'Server',
          description: 'Bitcoin/Electrum Server',
          default: serverType,
          disabled: disabled,
          variants: Variants.of({
            electrs: {
              name:
                'Electrs (recommended)' +
                (disabled.includes('electrs') ? ' (not installed)' : ''),
              spec: InputSpec.of({}),
            },
            bitcoind: {
              name:
                'Local Bitcoin Node' +
                (disabled.includes('bitcoind') ? ' (not installed)' : ''),
              spec: InputSpec.of({}),
            },
            public: {
              name: 'Public (not recommended)',
              spec: InputSpec.of({}),
            },
          }),
        }
      }),
      proxy: Value.union({
        name: 'Proxy',
        description: 'Proxy settings',
        default: 'tor',
        variants: Variants.of({
          tor: {
            name: 'Tor (recommended)',
            spec: InputSpec.of({}),
          },
          none: {
            name: 'None',
            spec: InputSpec.of({}),
          },
        }),
      }),
    }),
  ),
})

export const config = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: 'Settings',
    description: 'Webtop username/password and connection settings',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => readSettings(effects),

  // the execution function
  ({ effects, input }) => writeSettings(effects, input),
)

type InputSpec = typeof inputSpec._TYPE
type PartialInputSpec = typeof inputSpec._PARTIAL

async function readSettings(effects: T.Effects): Promise<PartialInputSpec> {
  let settings = await store.read().once()
  if (!settings) {
    await createDefaultStore(effects)
    settings = (await store.read().once())!
  }

  return {
    title: settings.title,
    username: settings.username,
    password: settings.password,
    reconnect: settings.reconnect,
    bisq: {
      managesettings: settings.bisq.managesettings,
      server: {
        selection: settings.bisq.server.type,
      },
      proxy: {
        selection: settings.bisq.proxy.type,
      },
    },
  }
}

async function writeSettings(effects: T.Effects, input: InputSpec) {
  if (input.bisq.managesettings && input.bisq.server.selection == 'public') {
    console.log('using public electrum server')

    // @todo this does not work (request config action from config action)
    // await sdk.action.requestOwn(effects, config, 'important', {
    //   reason: 'Change settings to not use a public electrum server',
    // })
  }

  await sdk.action.clearTask(effects, 'reset-rpc-auth')

  if (input.bisq.managesettings && input.bisq.server.selection == 'bitcoind') {
    console.log('using bitcoind server')

    const currentConf = await store.read().once()
    // check if we need to request new credentials
    if (!currentConf?.bisq.server.user || !currentConf?.bisq.server.password) {
      console.log('resetting rpc credentials')

      await sdk.action.run({
        actionId: 'reset-rpc-auth',
        effects,
        input: {},
      })
    } else {
      //await sdk.action.clearRequest(effects, 'reset-rpc-auth')
    }
  } else {
    //await sdk.action.clearRequest(effects, 'reset-rpc-auth')
  }

  await store.merge(effects, {
    title: input.title,
    username: input.username,
    password: input.password,
    reconnect: input.reconnect,
    bisq: {
      managesettings: input.bisq.managesettings,
      server: {
        type: input.bisq.server.selection,
      },
      proxy: {
        type: input.bisq.proxy.selection,
      },
    },
  })
}
