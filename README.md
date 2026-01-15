# eslint-plugin-th-rules
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![XO code style](https://shields.io/badge/code_style-5ed9c7?logo=xo&labelColor=gray)](https://github.com/xojs/xo)
[![Snyk Security](../../actions/workflows/snyk-security.yml/badge.svg)](../../actions/workflows/snyk-security.yml)
[![CodeQL](../../actions/workflows/codeql.yml/badge.svg)](../../actions/workflows/codeql.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/tomerh2001/eslint-plugin-th-rules/badge)](https://securityscorecards.dev/viewer/?uri=github.com/tomerh2001/eslint-plugin-th-rules)

A set of custom ESLint rules designed to improve code quality, enforce consistency, and introduce development conventions across TypeScript, React, and JavaScript projects.

This plugin provides:

- Custom rules unique to this repository  
- Recommended flat configs that bundle th-rules with popular third-party plugins  
- Advanced composable config layers for consumers who want fine-grained control  

---

# Installation

```bash
npm install --save-dev eslint-plugin-th-rules
```

This plugin requires ESLint Flat Config (ESLint 8.21+).

---

# Usage

The plugin exposes three public recommended configurations.

These are the presets most users should consume.

## Recommended (Full Opinionated)

Includes:

- All th-rules
- External plugins (lodash, n, sonarjs, security)
- Opinionated rule settings for externals

```js
// eslint.config.js
import thRules from "eslint-plugin-th-rules";

export default [
  ...thRules.configs.recommended
];
```

## Recommended + TypeScript

Recommended plus full strict/stylistic TypeScript configurations.

```js
import thRules from "eslint-plugin-th-rules";

export default [
  ...thRules.configs["recommended-typescript"]
];
```

## Recommended + React

Recommended plus:

- eslint-plugin-react
- eslint-plugin-react-hooks
- JSX Runtime rules

```js
import thRules from "eslint-plugin-th-rules";

export default [
  ...thRules.configs["recommended-react"]
];
```

---

# Advanced Composition (Optional)

If you want total control, you may import internal composition layers.

These layers are intentionally not included in `configs`, because they are not presets but building blocks.

```js
import {
  coreBase,
  externalsBase,
  externalsOpinionated,
  coreTypescript,
  coreReact
} from "eslint-plugin-th-rules";
```

### Only use th-rules

```js
export default [
  ...coreBase
];
```

### Add external plugins (unstyled)

```js
export default [
  ...coreBase,
  ...externalsBase
];
```

### Add external plugins + th-rules opinions

```js
export default [
  ...coreBase,
  ...externalsBase,
  ...externalsOpinionated
];
```

### Add TypeScript or React extensions

```js
export default [
  ...coreBase,
  ...externalsBase,
  ...externalsOpinionated,
  ...coreTypescript,
  ...coreReact
];
```

---

# Auto-Generated Rule Documentation

The following section is generated via `eslint-doc-generator`.  
Do not edit below this line.

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
⚛️ Set in the `recommended-react` configuration.\
🟦 Set in the `recommended-typescript` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Name                                                             | Description                                                                                                                                      | 💼      | 🔧 | 💡 |
| :--------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :------ | :- | :- |
| [no-boolean-coercion](docs/rules/no-boolean-coercion.md)         | Disallow Boolean(value) or !!value. Enforce explicit checks: !_.isNil(value) for scalars and !_.isEmpty(value) for strings, arrays, and objects. | ✅ ⚛️ 🟦 |    | 💡 |
| [no-comments](docs/rules/no-comments.md)                         | Disallow comments except for specified allowed patterns.                                                                                         | ✅ ⚛️ 🟦 | 🔧 |    |
| [no-default-export](docs/rules/no-default-export.md)             | Convert unnamed default exports to named default exports based on the file name.                                                                 | ✅ ⚛️ 🟦 | 🔧 |    |
| [no-destructuring](docs/rules/no-destructuring.md)               | Disallow destructuring that does not meet certain conditions.                                                                                    | ✅ ⚛️ 🟦 |    |    |
| [prefer-is-empty](docs/rules/prefer-is-empty.md)                 | Require _.isEmpty instead of length comparisons.                                                                                                 | ✅ ⚛️ 🟦 |    | 💡 |
| [schemas-in-schemas-file](docs/rules/schemas-in-schemas-file.md) | Require Zod schema declarations to be placed in a .schemas.ts file.                                                                              | ✅ ⚛️ 🟦 |    |    |
| [top-level-functions](docs/rules/top-level-functions.md)         | Require all top-level functions to be named regular functions.                                                                                   | ✅ ⚛️ 🟦 | 🔧 |    |
| [types-in-dts](docs/rules/types-in-dts.md)                       | Require TypeScript type declarations (type/interface/enum) to be placed in .d.ts files.                                                          | ✅ ⚛️ 🟦 |    |    |

<!-- end auto-generated rules list -->

---

# Updating Documentation

Auto-generate rule docs:

```bash
npm run update:eslint-docs
```

Recommended command:

```json
"update:eslint-docs": "eslint-doc-generator \
  --config-emoji \"recommended,✅\" \
  --config-emoji \"recommended-react,⚛️\" \
  --config-emoji \"recommended-typescript,🟦\""
```

Internal layers (`core-*`, `externals-*`) are not included because they are not presets.

---

# License

MIT