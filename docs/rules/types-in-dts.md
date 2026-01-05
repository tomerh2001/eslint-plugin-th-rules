<pre>
# Require TypeScript type declarations (type/interface/enum) to be placed in .d.ts files (`th-rules/types-in-dts`)

💼 This rule is enabled in the following configs: ✅ `recommended`, `recommended-react`, `recommended-typescript`.

<!-- end auto-generated rule header -->

💼 This rule is enabled in the following configs: ✅ `recommended`, `recommended-react`, `recommended-typescript`.

&lt;!-- end auto-generated rule header --&gt;

This rule enforces a strict separation between **runtime code** and **type declarations** by requiring all top-level TypeScript type declarations to be defined in `.d.ts` files.

The rule applies to:
- `type` aliases
- `interface` declarations
- `enum` declarations

Any of these constructs declared outside of a `.d.ts` file will be reported, unless explicitly allowed via configuration.

## Rationale

Keeping type declarations in `.d.ts` files provides several benefits:

- Enforces a clean architectural boundary between runtime logic and type definitions
- Improves file readability by reducing noise in implementation files
- Encourages intentional, centralized ownership of public and shared types
- Prevents accidental runtime coupling with type-only constructs
- Aligns well with library-oriented or API-driven codebases

This rule is especially useful in large TypeScript projects, shared packages, or monorepos where type contracts are meant to be consumed independently of implementation.

## Examples

### ❌ Incorrect

```ts
// user.ts
type UserId = string;

interface User {
  id: UserId;
  name: string;
}

enum Role {
  Admin,
  User,
}
```

### ✅ Correct

```ts
// user.d.ts
type UserId = string;

interface User {
  id: UserId;
  name: string;
}

enum Role {
  Admin,
  User,
}
```

```ts
// user.ts
import type { User, UserId, Role } from './user';
```

### Allowed usage

Using types, interfaces, or enums is always allowed in any file:

```ts
function getUser(id: UserId): User {
  // ...
}
```

## Options

&lt;!-- begin auto-generated rule options list --&gt;

| Name           | Type    |
| :------------- | :------ |
| `allowDeclare` | Boolean |
| `allowEnums`   | Boolean |

&lt;!-- end auto-generated rule options list --&gt;

### `allowDeclare`

When set to `true`, the rule allows `declare` type declarations in non-`.d.ts` files.

This is useful when working with ambient declarations, global augmentations, or compatibility shims that must live alongside implementation code.

### `allowEnums`

When set to `true`, the rule allows `enum` declarations in non-`.d.ts` files.

This can be helpful in codebases that rely on runtime enums while still wanting to enforce `.d.ts` placement for interfaces and type aliases.

## Notes

- This rule does not enforce how types are imported or re-exported.
- It does not attempt to auto-fix violations, as moving declarations across files is not safe to do automatically.
- The rule operates purely at the syntax level and does not require type information.
</pre>
