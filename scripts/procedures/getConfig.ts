import { compat } from "../deps.ts";

export const getConfig = compat.getConfig({
  "title": {
    "type": "string",
    "nullable": false,
    "name": "Bisq Title",
    "description": "This value will be displayed as the title of your browser tab.",
    "default": "Start9 Bisq",
    "pattern": "^[^\\n\"]*$",
    "pattern-description": "Must not contain newline or quote characters.",
    "masked": false,
    "copyable": true
  },
  "password": {
    "type": "string",
    "name": "Password",
    "description": "The password for logging into your Bisq as abc user",
    "nullable": false,
    "masked": true,
    "default": {
      charset: "a-z,1-9",
      len: 10,
    },
    "pattern": "^[^\\n\"]*$",
    "pattern-description": "Must not contain newline or quote characters.",
    "copyable": true
  }
})
