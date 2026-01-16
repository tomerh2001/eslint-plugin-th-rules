/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/prefer-explicit-check';

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

ruleTester.run('prefer-explicit-check', rule, {
	valid: [
		'if (flag) {}',
		'if (!flag) {}',
		'const flag = true; if (flag) {}',

		'if (!_.isNil(x)) {}',
		'if (_.isNil(x)) {}',
		'if (_.isEmpty(list)) {}',

		'if (value > 0) {}',
		'if (value === "test") {}',
		'if (value !== 123) {}',

		'if (fn()) {}',
		'if (!fn()) {}',
	],

	invalid: [
		{
			code: 'if (value) {}',
			output: "import _ from 'lodash';\nif (!_.isNil(value)) {}",
			errors: [{ messageId: 'preferNotIsNil', data: { value: 'value' } }],
		},
		{
			code: 'if (!value) {}',
			output: "import _ from 'lodash';\nif (_.isNil(value)) {}",
			errors: [{ messageId: 'preferIsNil', data: { value: 'value' } }],
		},

		{
			code: "import _ from 'lodash';\nif (foo) {}",
			output: "import _ from 'lodash';\nif (!_.isNil(foo)) {}",
			errors: [{ messageId: 'preferNotIsNil', data: { value: 'foo' } }],
		},

		{
			code: 'if ([]) {}',
			output: "import _ from 'lodash';\nif (!_.isEmpty([])) {}",
			errors: [{ messageId: 'preferNotIsEmpty', data: { value: '[]' } }],
		},
		{
			code: 'if (![1,2,3]) {}',
			output: "import _ from 'lodash';\nif (_.isEmpty([1,2,3])) {}",
			errors: [{ messageId: 'preferIsEmpty', data: { value: '[1,2,3]' } }],
		},

		{
			code: 'if ({}) {}',
			output: "import _ from 'lodash';\nif (!_.isEmpty({})) {}",
			errors: [{ messageId: 'preferNotIsEmpty', data: { value: '{}' } }],
		},
		{
			code: 'if (!{a:1}) {}',
			output: "import _ from 'lodash';\nif (_.isEmpty({a:1})) {}",
			errors: [{ messageId: 'preferIsEmpty', data: { value: '{a:1}' } }],
		},

		{
			code: 'const list: string[] = []; if (list) {}',
			output: "import _ from 'lodash';\nconst list: string[] = []; if (!_.isEmpty(list)) {}",
			errors: [{ messageId: 'preferNotIsEmpty', data: { value: 'list' } }],
		},
		{
			code: 'const list: string[] = []; if (!list) {}',
			output: "import _ from 'lodash';\nconst list: string[] = []; if (_.isEmpty(list)) {}",
			errors: [{ messageId: 'preferIsEmpty', data: { value: 'list' } }],
		},

		{
			code: 'let x: number | null; if (x) {}',
			output: "import _ from 'lodash';\nlet x: number | null; if (!_.isNil(x)) {}",
			errors: [{ messageId: 'preferNotIsNil', data: { value: 'x' } }],
		},

		{
			code: 'if (obj.prop) {}',
			output: "import _ from 'lodash';\nif (!_.isNil(obj.prop)) {}",
			errors: [{ messageId: 'preferNotIsNil', data: { value: 'obj.prop' } }],
		},
		{
			code: 'if (!obj.prop) {}',
			output: "import _ from 'lodash';\nif (_.isNil(obj.prop)) {}",
			errors: [{ messageId: 'preferIsNil', data: { value: 'obj.prop' } }],
		},
	],
});
