import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'bisq',
  title: 'Bisq',
  license: 'GPLv3',
  wrapperRepo: 'https://github.com/Start9Labs/bisq-startos',
  upstreamRepo: 'https://github.com/Start9Labs/bisq-startos',
  supportSite: 'https://github.com/bisq-network/bisq/issues',
  docsUrl: 'https://github.com/Start9Labs/bisq-startos/blob/main/instructions.md',
  marketingSite: 'https://bisq.network/',
  donationUrl: null,
  description: {
    short: 'Buy and sell bitcoin for fiat (or other cryptocurrencies) privately and securely.',
    long: "Bisq is a decentralized bitcoin exchange network that enables secure, private and censorship-resistant exchange of bitcoin for national currencies and other cryptocurrencies over the internet. The Bisq application forms a peer-to-peer network by discovering, connecting to, and working with one another to implement the Bisq trading protocol.",
  },
  volumes: ['main', 'userdir'],
  images: {
     bisq: {
      source: {
        dockerBuild: {},
      },
    },
  },
  hardwareRequirements: {
    arch: ['x86_64'],
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description: 'Used to connect to your Bitcoin node.',
      optional: true,
      s9pk: null,
    },
    electrs: {
      description: 'Used to connect to your Bitcoin node.',
      optional: true,
      s9pk: null,
    },
  },
})
