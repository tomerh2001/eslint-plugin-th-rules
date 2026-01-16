/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/prefer-is-empty';

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

ruleTester.run('prefer-is-empty', rule, {
	valid: [
		"import _ from 'lodash'; _.isEmpty(values);",
		"import _ from 'lodash'; !_.isEmpty(values);",

		'values.length === 4;',
		'values.length > 5;',
		'values?.length === 4;',
		'values?.length > 5;',
		'const n = values.length;',
		'const n = values?.length;',
		'const n = values?.length ?? 0;',
		'values.length + 1;',
		'Math.min(values.length, 10);',

		'Array.isArray(values);',
		'values.size > 0;',
	],

	invalid: [
		{
			code: 'values.length === 0;',
			output: "import _ from 'lodash';\n_.isEmpty(values);",
			errors: [{ messageId: 'useIsEmpty' }],
		},
		{
			code: 'values.length < 1;',
			output: "import _ from 'lodash';\n_.isEmpty(values);",
			errors: [{ messageId: 'useIsEmpty' }],
		},
		{
			code: 'values.length <= 0;',
			output: "import _ from 'lodash';\n_.isEmpty(values);",
			errors: [{ messageId: 'useIsEmpty' }],
		},
		{
			code: 'values.length > 0;',
			output: "import _ from 'lodash';\n!_.isEmpty(values);",
			errors: [{ messageId: 'useIsEmpty' }],
		},
		{
			code: 'values.length >= 1;',
			output: "import _ from 'lodash';\n!_.isEmpty(values);",
			errors: [{ messageId: 'useIsEmpty' }],
		},
		{
			code: 'values.length !== 0;',
			output: "import _ from 'lodash';\n!_.isEmpty(values);",
			errors: [{ messageId: 'useIsEmpty' }],
		},

		{
			code: '0 === items.length;',
			output: "import _ from 'lodash';\n_.isEmpty(items);",
			errors: [{ messageId: 'useIsEmpty' }],
		},

		{
			code: 'if (items.length) {}',
			output: "import _ from 'lodash';\nif (!_.isEmpty(items)) {}",
			errors: [{ messageId: 'useIsEmptyBoolean' }],
		},
		{
			code: '!items.length;',
			output: "import _ from 'lodash';\n_.isEmpty(items);",
			errors: [{ messageId: 'useIsEmptyUnary' }],
		},
		{
			code: '!!items.length;',
			output: "import _ from 'lodash';\n!_.isEmpty(items);",
			errors: [{ messageId: 'useIsEmptyBoolean' }],
		},
		{
			code: 'items.length && foo();',
			output: "import _ from 'lodash';\n!_.isEmpty(items) && foo();",
			errors: [{ messageId: 'useIsEmptyBoolean' }],
		},
		{
			code: 'items.length || foo();',
			output: "import _ from 'lodash';\n!_.isEmpty(items) || foo();",
			errors: [{ messageId: 'useIsEmptyBoolean' }],
		},
		{
			code: 'items.length ? a : b;',
			output: "import _ from 'lodash';\n!_.isEmpty(items) ? a : b;",
			errors: [{ messageId: 'useIsEmptyBoolean' }],
		},
		{
			code: 'items?.length === 0;',
			output: "import _ from 'lodash';\n_.isEmpty(items);",
			errors: [{ messageId: 'useIsEmpty' }],
		},
		{
			code: 'items?.length > 0;',
			output: "import _ from 'lodash';\n!_.isEmpty(items);",
			errors: [{ messageId: 'useIsEmpty' }],
		},
		{
			code: 'if (items?.length) {}',
			output: "import _ from 'lodash';\nif (!_.isEmpty(items)) {}",
			errors: [{ messageId: 'useIsEmptyBoolean' }],
		},
		{
			code: '!items?.length;',
			output: "import _ from 'lodash';\n_.isEmpty(items);",
			errors: [{ messageId: 'useIsEmptyUnary' }],
		},
		{
			code: 'items?.length ? a : b;',
			output: "import _ from 'lodash';\n!_.isEmpty(items) ? a : b;",
			errors: [{ messageId: 'useIsEmptyBoolean' }],
		},
	],
});
