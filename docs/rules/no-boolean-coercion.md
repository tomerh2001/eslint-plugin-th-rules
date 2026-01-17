# th-rules/no-boolean-coercion

📝 Disallow Boolean(value) or !!value. Enforce explicit checks: !_.isNil(value) for scalars and !_.isEmpty(value) for strings, arrays, and objects. If the value is already boolean, remove coercion.

💼 This rule is enabled in the following configs: ✅ `recommended`, ⚛️ `recommendedReact`, 🟦 `recommendedTypescript`, 🎲 `recommendedTypescriptReact`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->
