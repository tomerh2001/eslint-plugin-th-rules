import { configs as ts } from "typescript-eslint";
import { recommended } from "./recommended.js";

export const recommendedTypescript = [
  ...recommended,
  ...ts.strictTypeChecked,
  ...ts.stylisticTypeChecked,

  {
    name: "th-rules/typescript-overrides",
    rules: {
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-duplicate-type-constituents": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off"
    }
  }
];