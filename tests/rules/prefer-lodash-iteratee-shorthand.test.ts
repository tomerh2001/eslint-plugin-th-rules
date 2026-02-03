/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { RuleTester, type InvalidTestCase } from '@typescript-eslint/rule-tester';
import rule, { PREDICATE_METHOD_NAMES, ITERATEE_METHOD_NAMES, NATIVE_TO_LODASH_METHOD_NAMES } from '../../src/rules/prefer-lodash-iteratee-shorthand';

type MessageId = keyof typeof rule.meta.messages;
type Case = InvalidTestCase<MessageId, []>;

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			projectService: {
				allowDefaultProject: ['*.ts*'],
			},
			tsconfigRootDir: '/../..',
		},
	},
});

function errors(messageId: MessageId): readonly [{ readonly messageId: MessageId }] {
	return [{ messageId }] as const;
}

function buildPredicateLodashCases() {
	const valid: string[] = [];
	const invalid: Case[] = [];

	for (const method of PREDICATE_METHOD_NAMES) {
		valid.push(`import _ from 'lodash'; _.${method}(collection, {Y: z});`, `import _ from 'lodash'; _(collection).${method}({Y: z});`);

		invalid.push({
			code: `import _ from 'lodash'; _.${method}(collection, (x) => x.Y === z && x.A === b);`,
			output: `import _ from 'lodash'; _.${method}(collection, {Y: z, A: b});`,
			errors: errors('useMatchesObject'),
		});

		invalid.push({
			code: `import _ from 'lodash'; _(collection).${method}((x) => x.Y === z && x.A === b);`,
			output: `import _ from 'lodash'; _(collection).${method}({Y: z, A: b});`,
			errors: errors('useMatchesObject'),
		});
	}

	return { valid, invalid };
}

function buildIterateeLodashSingleFunctionCases() {
	const valid: string[] = [];
	const invalid: Case[] = [];

	for (const method of ITERATEE_METHOD_NAMES) {
		valid.push(
			`import _ from 'lodash'; _.${method}(collection, 'field');`,
			`import _ from 'lodash'; _.${method}(collection, field);`,
			`import _ from 'lodash'; _(collection).${method}('field');`,
			`import _ from 'lodash'; _(collection).${method}(field);`,
		);

		invalid.push({
			code: `import _ from 'lodash'; _.${method}(collection, (x) => x.field);`,
			output: `import _ from 'lodash'; _.${method}(collection, 'field');`,
			errors: errors('usePropertyShorthand'),
		});

		invalid.push({
			code: `import _ from 'lodash'; _.${method}(collection, (x) => x[field]);`,
			output: `import _ from 'lodash'; _.${method}(collection, field);`,
			errors: errors('usePropertyShorthand'),
		});

		invalid.push({
			code: `import _ from 'lodash'; _.${method}(collection, (x) => _.get(x, 'a.b.c'));`,
			output: `import _ from 'lodash'; _.${method}(collection, 'a.b.c');`,
			errors: errors('usePropertyShorthand'),
		});

		invalid.push({
			code: `import _ from 'lodash'; _.${method}(collection, (x) => _.get(x, path));`,
			output: `import _ from 'lodash'; _.${method}(collection, path);`,
			errors: errors('usePropertyShorthand'),
		});

		invalid.push({
			code: `import _ from 'lodash'; _(collection).${method}((x) => x[field]);`,
			output: `import _ from 'lodash'; _(collection).${method}(field);`,
			errors: errors('usePropertyShorthand'),
		});
	}

	return { valid, invalid };
}

function buildSortOrderArrayIterateeCases() {
	const valid: string[] = [];
	const invalid: Case[] = [];

	valid.push(`import _ from 'lodash'; _.sortBy(items, ['a', 'b.c']);`, `import _ from 'lodash'; _(items).sortBy(['a', 'b.c']);`);

	invalid.push({
		code: `import _ from 'lodash'; _.sortBy(items, [(x) => x.a, (x) => _.get(x, 'b.c')]);`,
		output: `import _ from 'lodash'; _.sortBy(items, ['a', 'b.c']);`,
		errors: errors('usePropertyShorthand'),
	});

	invalid.push({
		code: `import _ from 'lodash'; _(items).sortBy([(x) => x.a, (x) => _.get(x, 'b.c')]);`,
		output: `import _ from 'lodash'; _(items).sortBy(['a', 'b.c']);`,
		errors: errors('usePropertyShorthand'),
	});

	valid.push(`import _ from 'lodash'; _.orderBy(items, [path, 'c'], ['asc', 'desc']);`, `import _ from 'lodash'; _(items).orderBy([path, 'c'], ['asc', 'desc']);`);

	invalid.push({
		code: `import _ from 'lodash'; _.orderBy(items, [(x) => _.get(x, path), (x) => x.c], ['asc', 'desc']);`,
		output: `import _ from 'lodash'; _.orderBy(items, [path, 'c'], ['asc', 'desc']);`,
		errors: errors('usePropertyShorthand'),
	});

	invalid.push({
		code: `import _ from 'lodash'; _(items).orderBy([(x) => _.get(x, path), (x) => x.c], ['asc', 'desc']);`,
		output: `import _ from 'lodash'; _(items).orderBy([path, 'c'], ['asc', 'desc']);`,
		errors: errors('usePropertyShorthand'),
	});

	return { valid, invalid };
}

function buildNativeCases() {
	const valid: string[] = [];
	const invalid: Case[] = [];

	const nativeMethods = Object.keys(NATIVE_TO_LODASH_METHOD_NAMES) as Array<keyof typeof NATIVE_TO_LODASH_METHOD_NAMES>;

	for (const nativeMethod of nativeMethods) {
		const lodashMethod = NATIVE_TO_LODASH_METHOD_NAMES[nativeMethod];

		if (
			lodashMethod === 'find' ||
			lodashMethod === 'findLast' ||
			lodashMethod === 'findIndex' ||
			lodashMethod === 'findLastIndex' ||
			lodashMethod === 'filter' ||
			lodashMethod === 'some' ||
			lodashMethod === 'every'
		) {
			invalid.push({
				code: `collection.${nativeMethod}((x) => x.Y === z && x.A === b);`,
				output: `import _ from 'lodash';\n_.${lodashMethod}(collection, {Y: z, A: b});`,
				errors: errors('useLodashMethod'),
			});

			invalid.push({
				code: `collection?.${nativeMethod}((x) => x.Y === z && x.A === b);`,
				output: `import _ from 'lodash';\n_.${lodashMethod}(collection, {Y: z, A: b});`,
				errors: errors('useLodashMethod'),
			});

			valid.push(`collection.${nativeMethod}((x) => x.Y !== z);`, `collection.${nativeMethod}((x) => x.Y === z || x.A === b);`);
		}

		if (lodashMethod === 'map' || lodashMethod === 'flatMap') {
			invalid.push({
				code: `collection.${nativeMethod}((x) => x.field);`,
				output: `import _ from 'lodash';\n_.${lodashMethod}(collection, 'field');`,
				errors: errors('useLodashMethod'),
			});

			invalid.push({
				code: `collection.${nativeMethod}((x) => x[field]);`,
				output: `import _ from 'lodash';\n_.${lodashMethod}(collection, field);`,
				errors: errors('useLodashMethod'),
			});

			invalid.push({
				code: `collection.${nativeMethod}((x) => _.get(x, 'a.b.c'));`,
				output: `import _ from 'lodash';\n_.${lodashMethod}(collection, 'a.b.c');`,
				errors: errors('useLodashMethod'),
			});

			invalid.push({
				code: `collection.${nativeMethod}((x) => _.get(x, path));`,
				output: `import _ from 'lodash';\n_.${lodashMethod}(collection, path);`,
				errors: errors('useLodashMethod'),
			});

			valid.push(`collection.${nativeMethod}((x) => foo(x));`);
		}
	}

	return { valid, invalid };
}

const predicateLodashCases = buildPredicateLodashCases();
const iterateeLodashCases = buildIterateeLodashSingleFunctionCases();
const sortOrderCases = buildSortOrderArrayIterateeCases();
const nativeCases = buildNativeCases();

ruleTester.run('prefer-lodash-iteratee-shorthand', rule, {
	valid: [
		...predicateLodashCases.valid,
		...iterateeLodashCases.valid,
		...sortOrderCases.valid,
		...nativeCases.valid,

		"import _ from 'lodash'; _.map(collection, 'a.b.c.d');",
		"import _ from 'lodash'; _.find(collection, {b: {c: 2}});",
	],

	invalid: [
		...nativeCases.invalid,
		...predicateLodashCases.invalid,
		...iterateeLodashCases.invalid,
		...sortOrderCases.invalid,

		{
			code: "import _ from 'lodash'; _.find(collection, (x) => _.get(x, 'a.b.c.d') === z);",
			output: "import _ from 'lodash'; _.find(collection, {a: {b: {c: {d: z}}}});",
			errors: errors('useMatchesObject'),
		},

		{
			code: "import _ from 'lodash'; _.find(collection, (x) => _.get(x, '[0].a.b.c') === z);",
			output: "import _ from 'lodash'; _.find(collection, [{a: {b: {c: z}}}]);",
			errors: errors('useMatchesObject'),
		},

		{
			code: "import _ from 'lodash'; _.map(collection, (x) => x.a.b.c.d);",
			output: "import _ from 'lodash'; _.map(collection, 'a.b.c.d');",
			errors: errors('usePropertyShorthand'),
		},

		{
			code: '[{ a: { b: { c: { d: 1 } } } }].map((x) => x.a.b.c.d);',
			output: "import _ from 'lodash';\n_.map([{ a: { b: { c: { d: 1 } } } }], 'a.b.c.d');",
			errors: errors('useLodashMethod'),
		},

		{
			code: 'collection.find((x) => x.b.c === 2);',
			output: "import _ from 'lodash';\n_.find(collection, {b: {c: 2}});",
			errors: errors('useLodashMethod'),
		},

		{
			code: "import _ from 'lodash'; _.find(collection, (x) => x.b.c === 2);",
			output: "import _ from 'lodash'; _.find(collection, {b: {c: 2}});",
			errors: errors('useMatchesObject'),
		},
	],
});
