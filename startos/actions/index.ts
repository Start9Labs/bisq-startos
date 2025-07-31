import { sdk } from '../sdk'
import { resetWebtopPass } from './resetWebtopPass'
import { setBitcoin } from './setBitcoin'
import { webtop } from './webtop'

export const actions = sdk.Actions.of()
  .addAction(setBitcoin)
  .addAction(webtop)
  .addAction(resetWebtopPass)
