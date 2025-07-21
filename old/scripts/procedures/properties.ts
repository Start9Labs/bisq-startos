import { matches, types as T, util, YAML } from "../deps.ts";

const { shape, string } = matches;

const noPropertiesFound: T.ResultType<T.Properties> = {
  result: {
    version: 2,
    data: {
      "Not Ready": {
        type: "string",
        value: "Could not find properties. The service might still be starting",
        qr: false,
        copyable: false,
        masked: false,
        description: "Fallback Message When Properties could not be found",
      },
    },
  },
} as const;

const configMatcher = shape({
  "password": string,
});

export const properties: T.ExpectedExports.properties = async ( effects: T.Effects ) => {
  if (
    await util.exists(effects, {
      volumeId: "main",
      path: "start9/config.yaml",
    }) === false
  ) {
    return noPropertiesFound;
  }
  const config = configMatcher.unsafeCast(YAML.parse(
    await effects.readFile({
      path: "start9/config.yaml",
      volumeId: "main",
    }),
  ));
  const properties: T.ResultType<T.Properties> = {
    result: {
      version: 2,
      data: {
        "Username": {
          type: "string",
          value: "abc",
          description: "Default username for Bisq XRDP session.",
          copyable: true,
          qr: false,
          masked: false,
        },
        "Password": {
          type: "string",
          value: config["password"],
          description: "This is the password for Bisq XRDP session.",
          copyable: true,
          qr: false,
          masked: true,
        },
      }
    }
  } as const;
  return properties;
};
