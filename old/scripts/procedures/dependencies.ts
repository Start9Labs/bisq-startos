import { matches, types as T } from "../deps.ts";

const { shape, boolean } = matches;

const matchBitcoindConfig = shape({
  advanced: shape({
    bloomfilters: shape({
      peerbloomfilters: boolean,
    }),
  }),
});

export const dependencies: T.ExpectedExports.dependencies = {
  bitcoind: {
    async check(effects, configInput) {
      effects.info("check bitcoind");
      const config = matchBitcoindConfig.unsafeCast(configInput);

      if (!config.advanced.bloomfilters.peerbloomfilters) {
        return { error: "Must have Bloom Filters enabled" };
      }

      return { result: null };
    },

    async autoConfigure(effects, configInput) {
      effects.info("autoconfigure bitcoind");
      const config = matchBitcoindConfig.unsafeCast(configInput);
      config.advanced.bloomfilters.peerbloomfilters = true;

      return { result: config };
    },
  },
};
