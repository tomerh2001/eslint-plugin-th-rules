# th-rules/schemas-in-schemas-file

📝 Require Zod schema declarations to be placed in a .schemas.ts file.

💼 This rule is enabled in the following configs: ✅ `recommended`, ⚛️ `recommended-react`, 🟦 `recommended-typescript`.

<!-- end auto-generated rule header -->

💼 This rule is enabled in the following configs: ✅ `recommended`, `recommended-react`, `recommended-typescript`.

&lt;!-- end auto-generated rule header --&gt;

This rule enforces that Zod schema **declarations** are defined in dedicated schema files (by default: `.schemas.ts` / `.schemas.tsx`), rather than inside implementation/component files.

The intent is to keep business logic and UI code focused, while consolidating validation/contract definitions into a predictable location.

## Rationale

Keeping Zod schemas in dedicated files:
- reduces noise in implementation files (especially components and services),
- encourages reuse of validation contracts across the codebase,
- improves review quality by keeping diffs focused (schema changes vs logic changes),
- standardizes file layout in larger projects and monorepos.

## What the rule reports

The rule reports Zod “schema builder” calls (e.g. `z.object(...)`, `z.string()`, `z.enum(...)`, `z.coerce.number()`, etc.) in files that do **not** match one of the allowed suffixes.

By default, it identifies Zod usage by tracking imports from `'zod'` (e.g. `import { z } from 'zod'`, `import { z as zod } from 'zod'`, `import * as zod from 'zod'`).

## Examples

### ❌ Incorrect

```ts
// ArticleCard.tsx
import {z} from 'zod';

const articleSchema = z.object({
	id: z.string(),
	title: z.string().min(1),
});
```

```ts
// user.ts
import {z as zod} from 'zod';

export const userSchema = zod.object({
	email: zod.string().email(),
});
```

### ✅ Correct

```ts
// ArticleCard.schemas.ts
import {z} from 'zod';

export const articleSchema = z.object({
	id: z.string(),
	title: z.string().min(1),
});
```

```ts
// ArticleCard.tsx
import {articleSchema} from './ArticleCard.schemas';

export function ArticleCard() {
	// articleSchema is used here (validation, inference, etc.)
	return null;
}
```

### Allowed usage (always allowed)

Using schemas and type inference is allowed anywhere:

```ts
import type {z} from 'zod';
import {articleSchema} from './ArticleCard.schemas';

export type Article = z.infer&lt;typeof articleSchema&gt;;
```

## Options

&lt;!-- begin auto-generated rule options list --&gt;

| Name               | Type     |
| :----------------- | :------- |
| `allowedSuffixes`  | String[] |
| `allowInTests`     | Boolean  |
| `onlyWhenAssigned` | Boolean  |

&lt;!-- end auto-generated rule options list --&gt;

### `allowedSuffixes`

An array of filename suffixes that are allowed to contain Zod schema declarations.

Default:
- `.schemas.ts`
- `.schemas.tsx`

Example:

```json
{
  "rules": {
    "th-rules/schemas-in-schemas-file": ["error", {
      "allowedSuffixes": [".schemas.ts", ".schemas.tsx", ".validation.ts"]
    }]
  }
}
```

### `allowInTests`

When set to `true`, the rule allows Zod schema declarations in common test file patterns (e.g. `*.test.ts`, `*.spec.ts`, `*.test.tsx`, `*.spec.tsx`).

Default: `false`

Example:

```json
{
  "rules": {
    "th-rules/schemas-in-schemas-file": ["error", {
      "allowInTests": true
    }]
  }
}
```

### `onlyWhenAssigned`

When set to `true`, the rule reports only Zod schema builder calls that are assigned to a variable (or assigned via `=`), for example:

```ts
const userSchema = z.object({ ... });
userSchema = z.object({ ... });
```

If set to `false` (default), the rule reports any Zod schema builder call found in a non-allowed file, including inline schemas:

```ts
foo(z.object({ ... }));
```

Default: `false`

Example:

```json
{
  "rules": {
    "th-rules/schemas-in-schemas-file": ["error", {
      "onlyWhenAssigned": true
    }]
  }
}
```

## Notes

- This rule is filename-based; it enforces a convention rather than performing semantic analysis.
- The rule does not auto-fix, as moving schemas across files safely (and updating imports) is not generally safe to automate.
- If you define Zod builders through wrappers (e.g. `createSchema(...)` that internally calls Zod), this rule will not detect those unless extended to match your helper patterns.
