import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { randomPassword, webtopUsername } from '../utils'

export const resetWebtopPass = sdk.Action.withoutInput(
  // id
  'webtop-pass',

  // metadata
  async ({ effects }) => {
    return {
      name: 'Reset Password',
      description: 'Reset your Bisq Webtop password',
      warning: null,
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  // execution function
  async ({ effects }) => {
    const password = utils.getDefaultString(randomPassword())

    await storeJson.merge(effects, { webtop: { password } })

    return {
      version: '1',
      title: 'Success',
      message:
        'Your credential are below. Write them down or save to a password manager.',
      result: {
        type: 'group',
        value: [
          {
            name: 'Username',
            description: null,
            type: 'single',
            value: webtopUsername,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            name: 'Password',
            description: null,
            type: 'single',
            value: password,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
