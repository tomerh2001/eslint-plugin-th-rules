# th-rules/no-comments

📝 Disallow comments except for specified allowed patterns.

💼 This rule is enabled in the following configs: ✅ `recommended`, ⚛️ `recommended-react`, 🟦 `recommended-typescript`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name       | Description                                  | Type     |
| :--------- | :------------------------------------------- | :------- |
| `allow`    | Additional patterns to allow in comments.    | String[] |
| `disallow` | Additional patterns to disallow in comments. | String[] |

<!-- end auto-generated rule options list -->

## Description

This rule disallows comments unless they match specified allowed patterns. It ensures that only relevant and permitted comments are present in the codebase, such as TODOs, warnings, JSDoc comments, ESLint directives, etc.

## Rule Details

By default, the following comments are allowed:

- TODO, WARNING, ERROR, INFO (case-insensitive).
- ESLint directives like `/* eslint-disable */`.
- JSDoc comments (any comment starting with `/**`).

You can also configure additional patterns to allow or disallow specific types of comments.

## Usage

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
```
