import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BISQ_VERSION = '1.9.21'
const BISQ_PGP_KEY = 'B493319106CC3D1F252E19CBF806F422E222AA02' // signing key (Alejandro García)

// the following allows us to build the service for x86 or arm64 specifically
// use: 'make x86' or 'make arm' ('make' will build both)
const BUILD = process.env.BUILD || ''

// @todo we need to define two images and decide which one to use when creating
// the subcontainer (in main.ts), is this correct?

const defaultBuildArgs = {
  BISQ_VERSION: BISQ_VERSION,
  BISQ_DEBFILE: `Bisq-64bit-${BISQ_VERSION}.deb`,
  BISQ_DEB_URL: `https://bisq.network/downloads/v${BISQ_VERSION}/Bisq-64bit-${BISQ_VERSION}.deb`,
  BISQ_ASC_URL: `https://bisq.network/downloads/v${BISQ_VERSION}/Bisq-64bit-${BISQ_VERSION}.deb.asc`,
  BISQ_PGP_KEY: BISQ_PGP_KEY,
}

const main_x64: SDKImageInputSpec = {
  arch: ['x86_64'],
  source: {
    dockerBuild: {
      workdir: '.',
      dockerfile: 'Dockerfile.x86',
      buildArgs: {
        ...defaultBuildArgs,
        PLATFORM: 'amd64',
      },
    },
  },
  emulateMissingAs: null,
}

const main_aarch64: SDKImageInputSpec = {
  arch: ['aarch64'],
  source: {
    dockerBuild: {
      workdir: '.',
      dockerfile: 'Dockerfile.arm',
      buildArgs: {
        ...defaultBuildArgs,
        PLATFORM: 'arm64',
      },
    },
  },
  emulateMissingAs: null,
}

// @todo name of images cannot contain capital letters, underscores, numbers?
const images: Record<string, SDKImageInputSpec> =
  BUILD === 'x86'
    ? { main: main_x64 }
    : BUILD === 'arm'
      ? { 'main-aarch': main_aarch64 }
      : { main: main_x64, 'main-aarch': main_aarch64 }

export const manifest = setupManifest({
  id: 'bisq',
  title: 'Bisq',
  license: 'GPLv3',
  wrapperRepo: 'https://github.com/Start9Labs/bisq-startos',
  upstreamRepo: 'https://github.com/Start9Labs/bisq-startos',
  supportSite: 'https://github.com/bisq-network/bisq/issues',
  docsUrl:
    'https://github.com/Start9Labs/bisq-startos/blob/main/instructions.md',
  marketingSite: 'https://bisq.network/',
  donationUrl: null,
  description: {
    short:
      'Buy and sell bitcoin for fiat (or other cryptocurrencies) privately and securely.',
    long: 'Bisq is a decentralized bitcoin exchange network that enables secure, private and censorship-resistant exchange of bitcoin for national currencies and other cryptocurrencies over the internet. The Bisq application forms a peer-to-peer network by discovering, connecting to, and working with one another to implement the Bisq trading protocol.',
  },
  volumes: ['main', 'userdir'],
  images: images,
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
  },
})
