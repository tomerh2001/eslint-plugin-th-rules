# Require all top-level functions to be named/regular functions (`th-rules/top-level-functions`)

💼 This rule is enabled in the following configs: ✅ `recommended`, `recommended-react`, `recommended-typescript`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Description

This rule requires all top-level functions to be named/regular functions, preventing the use of arrow functions at the top level. This rule aims to improve code readability and maintainability by enforcing consistent function declaration styles.

## Rule Details

This rule checks for arrow functions at the top level and reports them as errors.

Examples of **incorrect** code for this rule:

```js
const myFunction = () => {
  // Function body
};
```

Examples of **correct** code for this rule:

```js
function myFunction() {
  // Function body
}
```

## Usage

```json
{
  "rules": {
    "th-rules/top-level-functions": "error"
  }
}
```

## Options

This rule has no options.

## When Not To Use It

If you do not want to enforce consistent function declaration styles, you can disable this rule.
