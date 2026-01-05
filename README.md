# eslint-plugin-th-rules
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![XO code style](https://shields.io/badge/code_style-5ed9c7?logo=xo&labelColor=gray)](https://github.com/xojs/xo)
[![Snyk Security](../../actions/workflows/snyk-security.yml/badge.svg)](../../actions/workflows/snyk-security.yml)
[![CodeQL](../../actions/workflows/codeql.yml/badge.svg)](../../actions/workflows/codeql.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/tomerh2001/eslint-plugin-th-rules/badge)](https://securityscorecards.dev/viewer/?uri=github.com/tomerh2001/eslint-plugin-th-rules)

This repository contains custom ESLint rules to enhance code quality and consistency across projects.

## Rules
<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
⚛️ Set in the `recommended-react` configuration.\
🟦 Set in the `recommended-typescript` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                             | Description                                                                            | 💼      | 🔧 |
| :--------------------------------------------------------------- | :------------------------------------------------------------------------------------- | :------ | :- |
| [no-comments](docs/rules/no-comments.md)                         | Disallow comments except for specified allowed patterns.                               | ✅ ⚛️ 🟦 | 🔧 |
| [no-default-export](docs/rules/no-default-export.md)             | Convert unnamed default exports to named default exports based on the file name.       | ✅ ⚛️ 🟦 | 🔧 |
| [no-destructuring](docs/rules/no-destructuring.md)               | Disallow destructuring that does not meet certain conditions                           | ✅ ⚛️ 🟦 |    |
| [schemas-in-schemas-file](docs/rules/schemas-in-schemas-file.md) | Require Zod schema declarations to be placed in a .schemas.ts file                     | ✅ ⚛️ 🟦 |    |
| [styles-in-styles-file](docs/rules/styles-in-styles-file.md)     | Require React-Native StyleSheet.create(...) to be placed in a .styles.ts file          | ✅ ⚛️ 🟦 |    |
| [top-level-functions](docs/rules/top-level-functions.md)         | Require all top-level functions to be named/regular functions.                         | ✅ ⚛️ 🟦 | 🔧 |
| [types-in-dts](docs/rules/types-in-dts.md)                       | Require TypeScript type declarations (type/interface/enum) to be placed in .d.ts files | ✅ ⚛️ 🟦 |    |

<!-- end auto-generated rules list -->

