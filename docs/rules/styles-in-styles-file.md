# th-rules/styles-in-styles-file

📝 Require React-Native StyleSheet.create(...) to be placed in a .styles.ts file.

💼 This rule is enabled in the following configs: ✅ `recommended`, ⚛️ `recommended-react`, 🟦 `recommended-typescript`.

<!-- end auto-generated rule header -->

This rule enforces that React-Native stylesheet declarations created via `StyleSheet.create(...)` live in a dedicated styles file, typically ending with `.styles.ts`.

In practice, this prevents implementation/component files from containing large style objects, and encourages consistent separation of concerns.

## Rationale

Keeping styles in dedicated files:
- improves readability of component files by reducing visual noise,
- encourages reuse and consistency across components,
- makes style changes easier to review (diffs focus only on styles),
- standardizes project structure and naming conventions.

## What the rule reports

The rule reports any `StyleSheet.create(...)` call in files whose names do **not** match one of the allowed suffixes (by default, `.styles.ts`).

Optionally, it can also report `StyleSheet.compose(...)` calls.

## Examples

### ❌ Incorrect

```ts
// ArticleCard.tsx
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
	container: {padding: 12},
});
```

```ts
// AnyOtherFile.ts
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	row: {flexDirection: 'row'},
});
```

### ✅ Correct

```ts
// ArticleCard.styles.ts
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
	container: {padding: 12},
});
```

```ts
// ArticleCard.tsx
import React from 'react';
import {View} from 'react-native';
import {styles} from './ArticleCard.styles';

export function ArticleCard() {
	return <View style={styles.container} />;
}
```

### `includeCompose` example

When `includeCompose: true`, the following becomes invalid outside a `.styles.ts(x)` file:

```ts
// ArticleCard.tsx
import {StyleSheet} from 'react-native';

const combined = StyleSheet.compose(
	{padding: 12},
	{margin: 8},
);
```

With the same code moved to `ArticleCard.styles.ts`, it becomes valid.

## Options

<!-- begin auto-generated rule options list -->

| Name              | Type     |
| :---------------- | :------- |
| `allowedSuffixes` | String[] |
| `includeCompose`  | Boolean  |

<!-- end auto-generated rule options list -->

### `allowedSuffixes`

An array of filename suffixes that are allowed to contain `StyleSheet.create(...)`.

Default:
- `.styles.ts`

Example:

```json
{
  "rules": {
    "th-rules/styles-in-styles-file": ["error", {
      "allowedSuffixes": [".styles.ts", ".native-styles.ts"]
    }]
  }
}
```

### `includeCompose`

When set to `true`, the rule also enforces the file restriction for `StyleSheet.compose(...)`.

Default: `false`

Example:

```json
{
  "rules": {
    "th-rules/styles-in-styles-file": ["error", {
      "includeCompose": true
    }]
  }
}
```

## Notes

- This rule only targets `StyleSheet.create(...)` (and optionally `StyleSheet.compose(...)`). It does not restrict:
  - plain object styles (e.g., `const styles = { ... }`),
  - other styling systems (e.g., styled-components, Tamagui, Emotion),
  - calls to other `StyleSheet.*` helpers (e.g., `flatten`, `hairlineWidth`).
- The rule is filename-based. If ESLint is invoked with `<input>` (stdin), the rule will treat it as not being an allowed styles file.
