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

function error(messageId: MessageId) {
	return [{ messageId }] as const;
}

function buildPredicateLodashCases() {
	const valid: string[] = [];
	const invalid: Case[] = [];

	for (const method of PREDICATE_METHOD_NAMES) {
		valid.push(`import _ from 'lodash'; _.${method}(collection, {Y: z});`, `import _ from 'lodash'; _(collection).${method}({Y: z});`);

		invalid.push(
			{
				code: `import _ from 'lodash'; _.${method}(collection, (x) => x.Y === z && x.A === b);`,
				output: `import _ from 'lodash'; _.${method}(collection, {Y: z, A: b});`,
				errors: error('useMatchesObject'),
			},
			{
				code: `import _ from 'lodash'; _(collection).${method}((x) => x.Y === z && x.A === b);`,
				output: `import _ from 'lodash'; _(collection).${method}({Y: z, A: b});`,
				errors: error('useMatchesObject'),
			},
		);
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

		invalid.push(
			{
				code: `import _ from 'lodash'; _.${method}(collection, (x) => x.field);`,
				output: `import _ from 'lodash'; _.${method}(collection, 'field');`,
				errors: error('usePropertyShorthand'),
			},
			{
				code: `import _ from 'lodash'; _.${method}(collection, (x) => x[field]);`,
				output: `import _ from 'lodash'; _.${method}(collection, field);`,
				errors: error('usePropertyShorthand'),
			},
			{
				code: `import _ from 'lodash'; _.${method}(collection, (x) => _.get(x, 'a.b.c'));`,
				output: `import _ from 'lodash'; _.${method}(collection, 'a.b.c');`,
				errors: error('usePropertyShorthand'),
			},
			{
				code: `import _ from 'lodash'; _.${method}(collection, (x) => _.get(x, path));`,
				output: `import _ from 'lodash'; _.${method}(collection, path);`,
				errors: error('usePropertyShorthand'),
			},
			{
				code: `import _ from 'lodash'; _(collection).${method}((x) => x.field);`,
				output: `import _ from 'lodash'; _(collection).${method}('field');`,
				errors: error('usePropertyShorthand'),
			},
			{
				code: `import _ from 'lodash'; _(collection).${method}((x) => x[field]);`,
				output: `import _ from 'lodash'; _(collection).${method}(field);`,
				errors: error('usePropertyShorthand'),
			},
		);
	}

	return { valid, invalid };
}

function buildSortOrderArrayIterateeCases() {
	const valid: string[] = [];
	const invalid: Case[] = [];

	valid.push(`import _ from 'lodash'; _.sortBy(items, ['a', 'b.c']);`, `import _ from 'lodash'; _(items).sortBy(['a', 'b.c']);`);

	invalid.push(
		{
			code: `import _ from 'lodash'; _.sortBy(items, [(x) => x.a, (x) => _.get(x, 'b.c')]);`,
			output: `import _ from 'lodash'; _.sortBy(items, ['a', 'b.c']);`,
			errors: error('usePropertyShorthand'),
		},
		{
			code: `import _ from 'lodash'; _(items).sortBy([(x) => x.a, (x) => _.get(x, 'b.c')]);`,
			output: `import _ from 'lodash'; _(items).sortBy(['a', 'b.c']);`,
			errors: error('usePropertyShorthand'),
		},
	);

	valid.push(`import _ from 'lodash'; _.orderBy(items, [path, 'c'], ['asc', 'desc']);`, `import _ from 'lodash'; _(items).orderBy([path, 'c'], ['asc', 'desc']);`);

	invalid.push(
		{
			code: `import _ from 'lodash'; _.orderBy(items, [(x) => _.get(x, path), (x) => x.c], ['asc', 'desc']);`,
			output: `import _ from 'lodash'; _.orderBy(items, [path, 'c'], ['asc', 'desc']);`,
			errors: error('usePropertyShorthand'),
		},
		{
			code: `import _ from 'lodash'; _(items).orderBy([(x) => _.get(x, path), (x) => x.c], ['asc', 'desc']);`,
			output: `import _ from 'lodash'; _(items).orderBy([path, 'c'], ['asc', 'desc']);`,
			errors: error('usePropertyShorthand'),
		},
	);

	return { valid, invalid };
}

function buildNativeCases() {
	const valid: string[] = [];
	const invalid: Case[] = [];

	const nativeMethodNames = Object.keys(NATIVE_TO_LODASH_METHOD_NAMES) as Array<keyof typeof NATIVE_TO_LODASH_METHOD_NAMES>;

	for (const nativeMethod of nativeMethodNames) {
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
			invalid.push(
				{
					code: `collection.${nativeMethod}((x) => x.Y === z && x.A === b);`,
					output: `import _ from 'lodash';\n_.${lodashMethod}(collection, {Y: z, A: b});`,
					errors: error('useLodashMethod'),
				},
				{
					code: `collection?.${nativeMethod}((x) => x.Y === z && x.A === b);`,
					output: `import _ from 'lodash';\n_.${lodashMethod}(collection, {Y: z, A: b});`,
					errors: error('useLodashMethod'),
				},
			);

			valid.push(`collection.${nativeMethod}((x) => x.Y !== z);`, `collection.${nativeMethod}((x) => x.Y === z || x.A === b);`);
		}

		if (lodashMethod === 'map' || lodashMethod === 'flatMap') {
			invalid.push(
				{
					code: `collection.${nativeMethod}((x) => x.field);`,
					output: `import _ from 'lodash';\n_.${lodashMethod}(collection, 'field');`,
					errors: error('useLodashMethod'),
				},
				{
					code: `collection.${nativeMethod}((x) => x[field]);`,
					output: `import _ from 'lodash';\n_.${lodashMethod}(collection, field);`,
					errors: error('useLodashMethod'),
				},
				{
					code: `collection.${nativeMethod}((x) => _.get(x, 'a.b.c'));`,
					output: `import _ from 'lodash';\n_.${lodashMethod}(collection, 'a.b.c');`,
					errors: error('useLodashMethod'),
				},
				{
					code: `collection.${nativeMethod}((x) => _.get(x, path));`,
					output: `import _ from 'lodash';\n_.${lodashMethod}(collection, path);`,
					errors: error('useLodashMethod'),
				},
			);

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

		"import _ from 'lodash'; _.find(collection, {Y: z, A: b});",
		"import _ from 'lodash'; _.find(collection, {a: {b: {c: z}}});",
		"import _ from 'lodash'; _.groupBy(collection, 'a.b.c');",

		'collection.find((x) => x.Y === x.Z);',
		'_.find(collection, (x) => x.Y === x.Z);',
		'_.find(collection, (x) => x.Y !== z);',
		'_.find(collection, (x) => x.Y === z || x.A === b);',
		'_.find(collection, (x) => _.get(x, path) === z && x.A === b);',

		'_.map(collection, (x) => foo(x));',
		"_.filter(collection, (x) => _.get(x, 'a.b.c') > 1);",
	],

	invalid: [
		...nativeCases.invalid,
		...predicateLodashCases.invalid,
		...iterateeLodashCases.invalid,
		...sortOrderCases.invalid,

		{
			code: "import _ from 'lodash'; _.find(collection, (x) => _.get(x, 'a.b.c.d') === z);",
			output: "import _ from 'lodash'; _.find(collection, {a: {b: {c: {d: z}}}});",
			errors: error('useMatchesObject'),
		},

		{
			code: "import _ from 'lodash'; _.find(collection, (x) => _.get(x, '[0].a.b.c') === z);",
			output: "import _ from 'lodash'; _.find(collection, [{a: {b: {c: z}}}]);",
			errors: error('useMatchesObject'),
		},
	],
});
