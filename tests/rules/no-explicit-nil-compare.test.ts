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
			errors: [
				{
					messageId: 'useIsNull',
					data: { value: 'x' },
					suggestions: [
						{
							messageId: 'useIsNull',
							output: "import _ from 'lodash';\nif (_.isNull(x)) {}",
						},
					],
				},
			],
		},

		{
			code: 'if (foo !== null) {}',
			errors: [
				{
					messageId: 'useIsNull',
					data: { value: 'foo' },
					suggestions: [
						{
							messageId: 'useIsNull',
							output: "import _ from 'lodash';\nif (!_.isNull(foo)) {}",
						},
					],
				},
			],
		},

		{
			code: 'if (bar === undefined) {}',
			errors: [
				{
					messageId: 'useIsUndefined',
					data: { value: 'bar' },
					suggestions: [
						{
							messageId: 'useIsUndefined',
							output: "import _ from 'lodash';\nif (_.isUndefined(bar)) {}",
						},
					],
				},
			],
		},

		{
			code: 'if (baz != undefined) {}',
			errors: [
				{
					messageId: 'useIsUndefined',
					data: { value: 'baz' },
					suggestions: [
						{
							messageId: 'useIsUndefined',
							output: "import _ from 'lodash';\nif (!_.isUndefined(baz)) {}",
						},
					],
				},
			],
		},

		{
			code: 'if (null === thing) {}',
			errors: [
				{
					messageId: 'useIsNull',
					data: { value: 'thing' },
					suggestions: [
						{
							messageId: 'useIsNull',
							output: "import _ from 'lodash';\nif (_.isNull(thing)) {}",
						},
					],
				},
			],
		},

		{
			code: 'if (undefined !== item) {}',
			errors: [
				{
					messageId: 'useIsUndefined',
					data: { value: 'item' },
					suggestions: [
						{
							messageId: 'useIsUndefined',
							output: "import _ from 'lodash';\nif (!_.isUndefined(item)) {}",
						},
					],
				},
			],
		},

		{
			code: "import _ from 'lodash';\nif (x === null) {}",
			errors: [
				{
					messageId: 'useIsNull',
					data: { value: 'x' },
					suggestions: [
						{
							messageId: 'useIsNull',
							output: "import _ from 'lodash';\nif (_.isNull(x)) {}",
						},
					],
				},
			],
		},
	],
});
