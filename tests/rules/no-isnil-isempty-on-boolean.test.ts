/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/no-isnil-isempty-on-boolean';

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

ruleTester.run('no-isnil-isempty-on-boolean', rule, {
	valid: [
		"import _ from 'lodash'; _.isNil(value);",
		"import _ from 'lodash'; _.isEmpty(values);",
		"import _ from 'lodash'; !_.isNil(value);",
		"import _ from 'lodash'; !_.isEmpty(values);",

		'isNil(x);',
		'isEmpty(x);',

		"import _ from 'lodash'; _.isNumber(x);",
		"import _ from 'lodash'; _.isString(x);",
	],

	invalid: [
		{
			code: `
        import _ from 'lodash';
        const b: boolean = true;
        _.isNil(b);
      `,
			errors: [{ messageId: 'noBoolean' }],
		},
		{
			code: `
        import _ from 'lodash';
        const b: boolean = false;
        _.isEmpty(b);
      `,
			errors: [{ messageId: 'noBoolean' }],
		},
		{
			code: `
        import _ from 'lodash';
        const b: boolean | undefined = undefined;
        _.isNil(b);
      `,
			errors: [{ messageId: 'noBoolean' }],
		},
		{
			code: `
        import _ from 'lodash';
        const b: boolean | null = null;
        _.isEmpty(b);
      `,
			errors: [{ messageId: 'noBoolean' }],
		},
		{
			code: `
        import _ from 'lodash';
        const b: boolean | string = 'x';
        _.isNil(b);
      `,
			errors: [{ messageId: 'noBoolean' }],
		},
		{
			code: `
        import _ from 'lodash';
        const b: boolean | 0 | 1 = 1;
        _.isEmpty(b);
      `,
			errors: [{ messageId: 'noBoolean' }],
		},
		{
			code: `
        import _ from 'lodash';
        type Obj = { flag?: boolean };
        declare const o: Obj | undefined;
        _.isNil(o?.flag);
      `,
			errors: [{ messageId: 'noBoolean' }],
		},
		{
			code: `
        import _ from 'lodash';
        declare const flag: boolean | undefined;
        _.isEmpty(!!flag);
      `,
			errors: [{ messageId: 'noBoolean' }],
		},
		{
			code: `
		import _ from 'lodash';
		const x: string | boolean | null = null;
		_.isNil(x);
	  `,
			errors: [{ messageId: 'noBoolean' }],
		},
	],
});
