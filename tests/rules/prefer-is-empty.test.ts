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
	valid: ["import _ from 'lodash'; _.isEmpty(values);", "import _ from 'lodash'; !_.isEmpty(values);", 'Array.isArray(values);', 'values.size > 0;', '!_.isEmpty(items);'],

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
			code: 'if (items.length > 0) {}',
			output: "import _ from 'lodash';\nif (!_.isEmpty(items)) {}",
			errors: [{ messageId: 'useIsEmpty' }],
		},

		{
			code: '0 === items.length;',
			output: "import _ from 'lodash';\n_.isEmpty(items);",
			errors: [{ messageId: 'useIsEmpty' }],
		},

		{
			code: '!items.length;',
			output: "import _ from 'lodash';\n_.isEmpty(items);",
			errors: [{ messageId: 'useIsEmptyUnary' }],
		},

		{
			code: '!(items.length);',
			output: "import _ from 'lodash';\n_.isEmpty(items);",
			errors: [{ messageId: 'useIsEmptyUnary' }],
		},

		{
			code: 'if (!items.length) {}',
			output: "import _ from 'lodash';\nif (_.isEmpty(items)) {}",
			errors: [{ messageId: 'useIsEmptyUnary' }],
		},

		{
			code: "import _ from 'lodash'; values.length === 0;",
			output: "import _ from 'lodash'; _.isEmpty(values);",
			errors: [{ messageId: 'useIsEmpty' }],
		},
	],
});
