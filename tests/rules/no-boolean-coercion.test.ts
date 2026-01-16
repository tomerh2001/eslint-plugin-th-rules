/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/no-boolean-coercion';

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

ruleTester.run('no-boolean-coercion', rule, {
	valid: [
		'_.isNil(value);',
		'_.isEmpty(list);',
		'if (value != null) {}',
		'if (list.length > 0) {}',
		'Boolean;',
		'const BooleanValue = true;',
		'const fn = Boolean;',
		'import _ from "lodash"; const x = !_.isNil(value);',

		'const isReady: boolean = true; if (isReady) {}',
		'let flag: boolean; flag = flag;',
	],

	invalid: [
		{
			code: 'Boolean(foo);',
			output: `import _ from 'lodash';\n!_.isNil(foo);`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'const x = Boolean(bar);',
			output: `import _ from 'lodash';\nconst x = !_.isNil(bar);`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: '!!value;',
			output: `import _ from 'lodash';\n!_.isNil(value);`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: 'Boolean([]);',
			output: `import _ from 'lodash';\n!_.isEmpty([]);`,
			errors: [{ messageId: 'useIsEmpty' }],
		},

		{
			code: `import _ from 'lodash'; const x = Boolean(foo);`,
			output: `import _ from 'lodash'; const x = !_.isNil(foo);`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `import lodash from 'lodash'; const x = Boolean(foo);`,
			output: `import lodash from 'lodash'; const x = !_.isNil(foo);`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
				const isReady: boolean = true;
				if (Boolean(isReady)) {}
			`,
			output: `
				const isReady: boolean = true;
				if (isReady) {}
			`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
				let isValid: boolean;
				!!isValid;
			`,
			output: `
				let isValid: boolean;
				isValid;
			`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
				let flag: boolean;
				const x: boolean = Boolean(flag);
			`,
			output: `
				let flag: boolean;
				const x: boolean = flag;
			`,
			errors: [{ messageId: 'useIsNil' }],
		},

		{
			code: `
				function isReadyFn(): boolean { return true; }
				Boolean(isReadyFn());
			`,
			output: `
				function isReadyFn(): boolean { return true; }
				isReadyFn();
			`,
			errors: [{ messageId: 'useIsNil' }],
		},
	],
});
