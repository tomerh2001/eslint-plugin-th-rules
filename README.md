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
or
```bash
yarn add -D eslint-plugin-th-rules
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
  ...thRules.configs.recommendedTypescript
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
  ...thRules.configs.recommendedReact
];
```

## Recommended + TypeScript + React
Recommended plus TypeScript and React extensions.

```js
import thRules from "eslint-plugin-th-rules";

export default [
  ...thRules.configs.recommendedTypescriptReact
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
⚛️ Set in the `recommendedReact` configuration.\
🟦 Set in the `recommendedTypescript` configuration.\
🎲 Set in the `recommendedTypescriptReact` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Name                                                       | Description                                                                                                                                      | 💼         | 🔧 | 💡 |
| :--------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :- | :- |
| [noBooleanCoercion](docs/rules/noBooleanCoercion.md)       | Disallow Boolean(value) or !!value. Enforce explicit checks: !_.isNil(value) for scalars and !_.isEmpty(value) for strings, arrays, and objects. | ✅ ⚛️ 🟦 🎲 |    | 💡 |
| [noComments](docs/rules/noComments.md)                     | Disallow comments except for specified allowed patterns.                                                                                         | ✅ ⚛️ 🟦 🎲 | 🔧 |    |
| [noDefaultExport](docs/rules/noDefaultExport.md)           | Convert unnamed default exports to named default exports based on the file name.                                                                 | ✅ ⚛️ 🟦 🎲 | 🔧 |    |
| [noDestructuring](docs/rules/noDestructuring.md)           | Disallow destructuring that does not meet certain conditions.                                                                                    | ✅ ⚛️ 🟦 🎲 |    |    |
| [preferIsEmpty](docs/rules/preferIsEmpty.md)               | Require _.isEmpty instead of length comparisons.                                                                                                 | ✅ ⚛️ 🟦 🎲 |    | 💡 |
| [schemasInSchemasFile](docs/rules/schemasInSchemasFile.md) | Require Zod schema declarations to be placed in a .schemas.ts file.                                                                              | ✅ ⚛️ 🟦 🎲 |    |    |
| [topLevelFunctions](docs/rules/topLevelFunctions.md)       | Require all top-level functions to be named regular functions.                                                                                   | ✅ ⚛️ 🟦 🎲 | 🔧 |    |
| [typesInDts](docs/rules/typesInDts.md)                     | Require TypeScript type declarations (type/interface/enum) to be placed in .d.ts files.                                                          | ✅ ⚛️ 🟦 🎲 |    |    |

<!-- end auto-generated rules list -->

---

# License

MIT