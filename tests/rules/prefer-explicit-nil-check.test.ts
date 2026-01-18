/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/prefer-explicit-nil-check';

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			projectService: { allowDefaultProject: ['*.ts*'] },
			tsconfigRootDir: '/../..',
		},
	},
});

ruleTester.run('prefer-explicit-nil-check', rule, {
	valid: [
		'_.isNil(value);',
		'if (_.isNil(item)) {}',
		'if (!_.isNil(item)) {}',

		'if (value > 0) {}',
		'if (value === "test") {}',
		'if (value !== 123) {}',

		'const x: boolean = true; if (!x) {}',
		'function f(a: boolean) { if (!a) {} }',
		'let b = true; if (!b) {}',
		'declare const bb: boolean; if (!bb) {}',

		'if (!!foo) {}',
		'if (!!someBoolean) {}',

		'if (!_.isNil(a) && !_.isNil(b)) {}',
		'if (_.isNil(a) || _.isNil(b)) {}',

		'const x = _.isNil(a) ? 1 : 2;',
		'if (!!_.isNil(a)) {}',

		'const option = context.options[0] ?? {};',

		'x ?? y',
		'x || y',
		'x && y',

		'const v = x || y;',
		'const v = x && y;',
		'return x || y;',
		'const x = 0; if (!x) {}',

		'declare const bu: boolean | undefined; if (bu) {}',
		'declare const bu: boolean | undefined; if (!bu) {}',
		'declare const bn: boolean | null; if (bn) {}',
		'declare const bn: boolean | null; if (!bn) {}',
		'declare const bnu: boolean | null | undefined; if (bnu) {}',
		'declare const bnu: boolean | null | undefined; if (!bnu) {}',

		'declare const snu: string | null | undefined; if (!_.isEmpty(snu ?? "")) {}',
		'declare const nnu: number | null | undefined; if (nnu) {}',
		'declare const nnu: number | null | undefined; if (!nnu) {}',

		'declare const n: number | null | undefined; if (n) {}',
		'declare const n: number | null; if (n) {}',
		'declare const n: number | undefined; if (n) {}',
		'declare const n: number | null | undefined; if (!n) {}',

		'const x = {y: true}; if (!x.y) {}',
		'interface X { y: boolean } const x: X = { y: true }; if (!x.y) {}',

		'const x = true as any; if (!x) {}',
		'declare const u: unknown; if (u) {}',
		'declare const u: unknown; if (!u) {}',
		'declare const a: any; if (a) {}',
		'declare const a: any; if (!a) {}',
		'declare const au: any | undefined; if (au) {}',
		'declare const au: any | undefined; if (!au) {}',
		'declare const un: unknown | null; if (un) {}',
		'declare const un: unknown | null; if (!un) {}',
	],

	invalid: [
		{
			code: `
declare const dataObject: {} | null | undefined;
if (!dataObject) {}`,
			output: `
import _ from 'lodash';
declare const dataObject: {} | null | undefined;
if (_.isNil(dataObject)) {}`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
declare const user: {} | null | undefined;
if (!user) {}`,
			output: `
import _ from 'lodash';
declare const user: {} | null | undefined;
if (_.isNil(user)) {}`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
declare const user: {} | null | undefined;
if (user) {}`,
			output: `
import _ from 'lodash';
declare const user: {} | null | undefined;
if (!_.isNil(user)) {}`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
import _ from 'lodash';
declare const item: {} | null | undefined;
if (!item) {}`,
			output: `
import _ from 'lodash';
declare const item: {} | null | undefined;
if (_.isNil(item)) {}`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
declare const foo: { bar: {} | null | undefined };
if (!foo.bar) {}`,
			output: `
import _ from 'lodash';
declare const foo: { bar: {} | null | undefined };
if (_.isNil(foo.bar)) {}`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'const obj = {}; if (!obj) {}',
			output: "import _ from 'lodash';\nconst obj = {}; if (_.isNil(obj)) {}",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
function f(a: {} | null | undefined) { if (!a) {} }`,
			output: `
import _ from 'lodash';
function f(a: {} | null | undefined) { if (_.isNil(a)) {} }`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
let x = null as {} | null;
if (!x) {}`,
			output: `
import _ from 'lodash';
let x = null as {} | null;
if (_.isNil(x)) {}`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
declare const a: {} | null | undefined;
declare const b: {} | null | undefined;
if (a && b) {}`,
			output: `
import _ from 'lodash';
declare const a: {} | null | undefined;
declare const b: {} | null | undefined;
if (!_.isNil(a) && !_.isNil(b)) {}`,
			errors: [{ messageId: 'useIsNil' }, { messageId: 'useIsNil' }],
		},

		{
			code: `
declare const a: {} | null | undefined;
declare const b: {} | null | undefined;
if (a || b) {}`,
			output: `
import _ from 'lodash';
declare const a: {} | null | undefined;
declare const b: {} | null | undefined;
if (!_.isNil(a) || !_.isNil(b)) {}`,
			errors: [{ messageId: 'useIsNil' }, { messageId: 'useIsNil' }],
		},

		{
			code: `
declare const a: {} | null | undefined;
declare const b: {} | null | undefined;
if (!a && b) {}`,
			output: `
import _ from 'lodash';
declare const a: {} | null | undefined;
declare const b: {} | null | undefined;
if (_.isNil(a) && !_.isNil(b)) {}`,
			errors: [{ messageId: 'useIsNil' }, { messageId: 'useIsNil' }],
		},

		{
			code: `
declare const a: {} | null | undefined;
declare const b: {} | null | undefined;
if (!a || !b) {}`,
			output: `
import _ from 'lodash';
declare const a: {} | null | undefined;
declare const b: {} | null | undefined;
if (_.isNil(a) || _.isNil(b)) {}`,
			errors: [{ messageId: 'useIsNil' }, { messageId: 'useIsNil' }],
		},

		{
			code: `
declare const x: {} | null | undefined;
declare const y: {} | null | undefined;
declare const z: {} | null | undefined;
if ((x && y) || z) {}`,
			output: `
import _ from 'lodash';
declare const x: {} | null | undefined;
declare const y: {} | null | undefined;
declare const z: {} | null | undefined;
if ((!_.isNil(x) && !_.isNil(y)) || !_.isNil(z)) {}`,
			errors: [{ messageId: 'useIsNil' }, { messageId: 'useIsNil' }, { messageId: 'useIsNil' }],
		},

		{
			code: `
declare const a: {} | null | undefined;
const r = a ? 1 : 2;`,
			output: `
import _ from 'lodash';
declare const a: {} | null | undefined;
const r = !_.isNil(a) ? 1 : 2;`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
declare const a: {} | null | undefined;
declare function doSomething(): void;
a && doSomething();`,
			output: `
import _ from 'lodash';
declare const a: {} | null | undefined;
declare function doSomething(): void;
!_.isNil(a) && doSomething();`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
declare const foo: {} | null | undefined;
declare function bar(): void;
foo || bar();`,
			output: `
import _ from 'lodash';
declare const foo: {} | null | undefined;
declare function bar(): void;
!_.isNil(foo) || bar();`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
declare const x: {} | null | undefined;
declare const y: {} | null | undefined;
if (!x && y) {}`,
			output: `
import _ from 'lodash';
declare const x: {} | null | undefined;
declare const y: {} | null | undefined;
if (_.isNil(x) && !_.isNil(y)) {}`,
			errors: [{ messageId: 'useIsNil' }, { messageId: 'useIsNil' }],
		},

		{
			code: `
declare const y: {} | null | undefined;
const x: boolean = true;
if (!x && y) {}`,
			output: `
import _ from 'lodash';
declare const y: {} | null | undefined;
const x: boolean = true;
if (!x && !_.isNil(y)) {}`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
declare const x: unknown;
declare const y: {} | null | undefined;
declare const z: number;
x ?? (y ? y : z)`,
			output: `
import _ from 'lodash';
declare const x: unknown;
declare const y: {} | null | undefined;
declare const z: number;
x ?? (!_.isNil(y) ? y : z)`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
declare const node: { value?: { params?: {} | null | undefined } | null };
if (node.value?.params) {}`,
			output: `
import _ from 'lodash';
declare const node: { value?: { params?: {} | null | undefined } | null };
if (!_.isNil(node.value?.params)) {}`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
declare const node: { value?: { params?: {} | null | undefined } | null };
if (!node.value?.params) {}`,
			output: `
import _ from 'lodash';
declare const node: { value?: { params?: {} | null | undefined } | null };
if (_.isNil(node.value?.params)) {}`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'const x = ""; if (!x) {}',
			output: 'import _ from \'lodash\';\nconst x = ""; if (_.isEmpty(x)) {}',
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'const x = "anbcde"; if (!x) {}',
			output: 'import _ from \'lodash\';\nconst x = "anbcde"; if (_.isEmpty(x)) {}',
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'declare const s: string | null | undefined; if (s) {}',
			output: "import _ from 'lodash';\ndeclare const s: string | null | undefined; if (!_.isEmpty(s)) {}",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'declare const s: string | null | undefined; if (!s) {}',
			output: "import _ from 'lodash';\ndeclare const s: string | null | undefined; if (_.isEmpty(s)) {}",
			errors: [{ messageId: 'useIsNil' }],
		},
	],
});
