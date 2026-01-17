/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/prefer-explicit-nil-check';

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
	],
});
