import globals from "globals";
import lodash from "eslint-plugin-lodash";
import n from "eslint-plugin-n";
import sonarjs from "eslint-plugin-sonarjs";
import security from "eslint-plugin-security";

import plugin from "../index.js";

export const recommended = [
  {
    name: "th-rules/recommended",

    plugins: {
      "th-rules": plugin,
      lodash,
      n,
      sonarjs,
      security
    },

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2024,
        ...globals.jest
      }
    },

    rules: {
      "th-rules/no-destructuring": "error",
      "th-rules/no-default-export": "error",
      "th-rules/no-comments": "error",
      "th-rules/top-level-functions": "error",
      "th-rules/schemas-in-schemas-file": "error",
      "th-rules/types-in-dts": "error",
      "th-rules/no-boolean-coercion": "error",
      "th-rules/prefer-is-empty": "error",

      "lodash/import-scope": ["error", "full"],
      "lodash/chaining": ["error", "implicit"],

      camelcase: "warn",
      "security/detect-unsafe-regex": "off",
      "sonarjs/no-clear-text-protocols": "off"
    }
  }
];