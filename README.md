# eslint-plugin-th-rules
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![XO code style](https://shields.io/badge/code_style-5ed9c7?logo=xo&labelColor=gray)](https://github.com/xojs/xo)
[![Snyk Security](../../actions/workflows/snyk-security.yml/badge.svg)](../../actions/workflows/snyk-security.yml)
[![CodeQL](../../actions/workflows/codeql.yml/badge.svg)](../../actions/workflows/codeql.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/tomerh2001/eslint-plugin-th-rules/badge)](https://securityscorecards.dev/viewer/?uri=github.com/tomerh2001/eslint-plugin-th-rules)

This repository contains custom ESLint rules to enhance code quality and consistency across projects.

# Custom ESLint Rules

This repository contains custom ESLint rules to enhance code quality and consistency across projects, created by Tomer Horowitz.

## Rules
<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                 | Description                                                                      | 💼                                  | 🔧 |
| :--------------------------------------------------- | :------------------------------------------------------------------------------- | :---------------------------------- | :- |
| [no-comments](docs/rules/no-comments.md)             | Disallow comments except for specified allowed patterns.                         | ✅ ![badge-recommended-typescript][] | 🔧 |
| [no-default-export](docs/rules/no-default-export.md) | Convert unnamed default exports to named default exports based on the file name. | ✅ ![badge-recommended-typescript][] | 🔧 |
| [no-destructuring](docs/rules/no-destructuring.md)   | Disallow destructuring that does not meet certain conditions                     | ✅ ![badge-recommended-typescript][] |    |

<!-- end auto-generated rules list -->

### 1. No-destructuring Rule

**Rule ID:** `th-rules/no-destructuring`

#### Description

This rule disallows destructuring that does not meet certain conditions, aiming to prevent overly complex destructuring patterns and ensure code readability.

#### Rule Details

This rule checks for:

- Destructuring at a nesting level above 3.
- Destructuring of more than the specified maximum number of variables (default is 2).
- Destructuring on a line exceeding the specified maximum line length (default is 100 characters).

#### Configuration

```json
{
  "rules": {
    "th-rules/no-destructuring": ["error", { "maximumDestructuredVariables": 2, "maximumLineLength": 100 }]
  }
}
```

### 2. Name-Export Rule

**Rule ID:** `th-rules/no-default-export`

#### Description

Converts unnamed default exports to named default exports based on the file name. This rule helps maintain consistency in export names and facilitates easier identification of components or modules.

#### Rule Details

This rule targets unnamed default exports and automatically generates a named export based on the file name.

#### Configuration
```json
{
  "rules": {
    "no-default-export": "error"
  }
}
```
### 3. No-Comments Rule

**Rule ID:** `th-rules/no-comments`

#### Description

This rule disallows comments unless they match specified allowed patterns. It ensures that only relevant and permitted comments are present in the codebase, such as TODOs, warnings, JSDoc comments, ESLint directives, etc.

#### Rule Details

By default, the following comments are allowed:

- TODO, WARNING, ERROR, INFO (case-insensitive).
- ESLint directives like `/* eslint-disable */`.
- JSDoc comments (any comment starting with `/**`).

You can also configure additional patterns to allow or disallow specific types of comments.

#### Configuration

```json
{
  "rules": {
    "th-rules/no-comments": [
      "error",
      {
        "allow": ["keep", "important"],
        "disallow": ["deprecated", "hack"]
      }
    ]
  }
}