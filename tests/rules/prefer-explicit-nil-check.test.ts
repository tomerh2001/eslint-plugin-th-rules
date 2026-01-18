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
	],

	invalid: [
		{
			code: 'if (!dataObject) {}',
			output: "import _ from 'lodash';\nif (_.isNil(dataObject)) {}",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'if (!user) {}',
			output: "import _ from 'lodash';\nif (_.isNil(user)) {}",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'if (user) {}',
			output: "import _ from 'lodash';\nif (!_.isNil(user)) {}",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: "import _ from 'lodash';\nif (!item) {}",
			output: "import _ from 'lodash';\nif (_.isNil(item)) {}",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'if (!foo.bar) {}',
			output: "import _ from 'lodash';\nif (_.isNil(foo.bar)) {}",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'const obj = {}; if (!obj) {}',
			output: "import _ from 'lodash';\nconst obj = {}; if (_.isNil(obj)) {}",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'function f(a) { if (!a) {} }',
			output: "import _ from 'lodash';\nfunction f(a) { if (_.isNil(a)) {} }",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'let x = null as any; if (!x) {}',
			output: "import _ from 'lodash';\nlet x = null as any; if (_.isNil(x)) {}",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'if (a && b) {}',
			output: "import _ from 'lodash';\nif (!_.isNil(a) && !_.isNil(b)) {}",
			errors: [{ messageId: 'useIsNil' }, { messageId: 'useIsNil' }],
		},

		{
			code: 'if (a || b) {}',
			output: "import _ from 'lodash';\nif (!_.isNil(a) || !_.isNil(b)) {}",
			errors: [{ messageId: 'useIsNil' }, { messageId: 'useIsNil' }],
		},

		{
			code: 'if (!a && b) {}',
			output: "import _ from 'lodash';\nif (_.isNil(a) && !_.isNil(b)) {}",
			errors: [{ messageId: 'useIsNil' }, { messageId: 'useIsNil' }],
		},

		{
			code: 'if (!a || !b) {}',
			output: "import _ from 'lodash';\nif (_.isNil(a) || _.isNil(b)) {}",
			errors: [{ messageId: 'useIsNil' }, { messageId: 'useIsNil' }],
		},

		{
			code: 'if ((x && y) || z) {}',
			output: "import _ from 'lodash';\nif ((!_.isNil(x) && !_.isNil(y)) || !_.isNil(z)) {}",
			errors: [{ messageId: 'useIsNil' }, { messageId: 'useIsNil' }, { messageId: 'useIsNil' }],
		},

		{
			code: 'const r = a ? 1 : 2;',
			output: "import _ from 'lodash';\nconst r = !_.isNil(a) ? 1 : 2;",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'a && doSomething();',
			output: "import _ from 'lodash';\n!_.isNil(a) && doSomething();",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'foo || bar();',
			output: "import _ from 'lodash';\n!_.isNil(foo) || bar();",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'if (!x && y) {}',
			output: "import _ from 'lodash';\nif (_.isNil(x) && !_.isNil(y)) {}",
			errors: [{ messageId: 'useIsNil' }, { messageId: 'useIsNil' }],
		},

		{
			code: 'const x: boolean = true; if (!x && y) {}',
			output: "import _ from 'lodash';\nconst x: boolean = true; if (!x && !_.isNil(y)) {}",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'x ?? (y ? y : z)',
			output: "import _ from 'lodash';\nx ?? (!_.isNil(y) ? y : z)",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'if (node.value?.params) {}',
			output: "import _ from 'lodash';\nif (!_.isNil(node.value?.params)) {}",
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'if (!node.value?.params) {}',
			output: "import _ from 'lodash';\nif (_.isNil(node.value?.params)) {}",
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
