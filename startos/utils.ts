// uiPort
export const uiPort = 3000

export const webtopUsername = 'bisq'
export const bitcoinPeer = 'bitcoind.startos:8333'

export const storeDefaults = {
  bitcoinNode: null,
  bitcoinRpc: null,
  webtop: {
    title: 'Bisq on StartOS',
    password: '',
    reconnect: false,
  },
}

export const bisqDefaults = {
  useTorForBtc: false,
  btcNodes: '',
  bannedSeedNodes: '',
  bannedBtcNodes: 'btc1.dnsalias.net:8333',
  bannedPriceRelayNodes: '',
}

export function randomPassword() {
  return {
    charset: 'a-z,A-Z,1-9',
    len: 22,
  }
}
