import { compat, types as T } from "../deps.ts";

export const setConfig: T.ExpectedExports.setConfig = async (effects, input) => {
  return await compat.setConfig(effects, input, {
    bitcoind: []
  });
};
