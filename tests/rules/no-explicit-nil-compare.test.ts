/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/no-explicit-nil-compare';

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

ruleTester.run('no-explicit-nil-compare', rule, {
	valid: ['_.isNull(value);', '_.isUndefined(value);', 'if (value > 0) {}', 'if (flag === true) {}', 'if (value === "test") {}', 'if (value !== 123) {}'],

	invalid: [
		{
			code: 'if (x === null) {}',
			output: "import _ from 'lodash';\nif (_.isNull(x)) {}",
			errors: [{ messageId: 'useIsNull', data: { value: 'x' } }],
		},

		{
			code: 'if (foo !== null) {}',
			output: "import _ from 'lodash';\nif (!_.isNull(foo)) {}",
			errors: [{ messageId: 'useIsNull', data: { value: 'foo' } }],
		},

		{
			code: 'if (bar === undefined) {}',
			output: "import _ from 'lodash';\nif (_.isUndefined(bar)) {}",
			errors: [{ messageId: 'useIsUndefined', data: { value: 'bar' } }],
		},

		{
			code: 'if (baz != undefined) {}',
			output: "import _ from 'lodash';\nif (!_.isUndefined(baz)) {}",
			errors: [{ messageId: 'useIsUndefined', data: { value: 'baz' } }],
		},

		{
			code: 'if (null === thing) {}',
			output: "import _ from 'lodash';\nif (_.isNull(thing)) {}",
			errors: [{ messageId: 'useIsNull', data: { value: 'thing' } }],
		},

		{
			code: 'if (undefined !== item) {}',
			output: "import _ from 'lodash';\nif (!_.isUndefined(item)) {}",
			errors: [{ messageId: 'useIsUndefined', data: { value: 'item' } }],
		},

		{
			code: "import _ from 'lodash';\nif (x === null) {}",
			output: "import _ from 'lodash';\nif (_.isNull(x)) {}",
			errors: [{ messageId: 'useIsNull', data: { value: 'x' } }],
		},
	],
});
