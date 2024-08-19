# Disallow destructuring that does not meet certain conditions (`th-rules/no-destructuring`)

💼 This rule is enabled in the following configs: ✅ `recommended`, `recommended-typescript`.

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name                           | Type    |
| :----------------------------- | :------ |
| `maximumDestructuredVariables` | Integer |
| `maximumLineLength`            | Integer |

<!-- end auto-generated rule options list -->

## Description

This rule disallows destructuring that does not meet certain conditions, aiming to prevent overly complex destructuring patterns and ensure code readability.

## Rule Details

This rule checks for:

- Destructuring at a nesting level above 3.
- Destructuring of more than the specified maximum number of variables (default is 2).
- Destructuring on a line exceeding the specified maximum line length (default is 100 characters).

## Usage

```json
{
  "rules": {
    "th-rules/no-destructuring": ["error", { "maximumDestructuredVariables": 2, "maximumLineLength": 100 }]
  }
}
```
