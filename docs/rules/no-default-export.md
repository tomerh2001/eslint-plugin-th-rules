# th-rules/no-default-export

📝 Convert unnamed default exports to named default exports based on the file name.

💼 This rule is enabled in the following configs: ✅ `recommended`, ⚛️ `recommended-react`, 🟦 `recommended-typescript`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Description

Converts unnamed default exports to named default exports based on the file name. This rule helps maintain consistency in export names and facilitates easier identification of components or modules.

## Rule Details

This rule targets unnamed default exports and automatically generates a named export based on the file name.

## Usage
```json
{
  "rules": {
    "no-default-export": "error"
  }
}
```