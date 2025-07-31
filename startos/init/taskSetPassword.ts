import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { resetWebtopPass } from '../actions/resetWebtopPass'

export const taskSetPassword = sdk.setupOnInit(async (effects) => {
  if (!(await storeJson.read((s) => s.webtop.password).const(effects))) {
    await sdk.action.createOwnTask(effects, resetWebtopPass, 'critical', {
      reason: 'Needed to create a password for Bisq Webtop',
    })
  }
})
