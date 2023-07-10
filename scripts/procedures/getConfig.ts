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
  "auto_login": {
    "name": "Automatic Login",
    "description": "⚠️ Enabling Automatic Login provides convenient access to Bisq via your secure device. Be aware of the security implications before proceeding. Ensure you have taken necessary measures to protect your Bisq v3 onion address and device security.",
    "type": "boolean",
    "default": true
  },
  "password": {
    "type": "string",
    "name": "Password",
    "description": "The password for logging into your Bisq as abc user",
    "nullable": false,
    "masked": true,
    "default": "cba"
  }
})
