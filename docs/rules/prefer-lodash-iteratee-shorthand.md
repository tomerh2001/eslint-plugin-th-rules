# th-rules/prefer-lodash-iteratee-shorthand

📝 Prefer Lodash iteratee shorthands. Example: _.find(collection, (x) => x.Y === z) -> _.find(collection, {Y: z}). Also prefers property shorthands like _.map(collection, (x) => _.get(x, path)) -> _.map(collection, path).

💼 This rule is enabled in the following configs: ✅ `recommended`, ⚛️ `recommendedReact`, 🟦 `recommendedTypescript`, 🎲 `recommendedTypescriptReact`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->
