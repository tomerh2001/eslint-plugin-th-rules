/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/no-comments';

const ruleTester = new RuleTester({});

ruleTester.run('no-comments', rule, {
	valid: [
		'// TODO: refactor this',
		'// todo: refactor this',
		'// WARNING: this is important',
		'// ERROR: something failed',
		'// INFO: just for reference',

		'/* eslint-env node */',

		'/**\n * JSDoc comment\n */\nfunction test() {}',

		{
			code: '// my custom comment',
			options: [{ allow: ['custom'] }],
		},

		{
			code: '// custom comment',
			options: [{ allow: ['custom'], disallow: ['custom'] }],
		},
	],

	invalid: [
		{
			code: '// this is not allowed',
			errors: [{ messageId: 'commentNotAllowed' }],
			output: '',
		},

		{
			code: '/* not allowed */',
			errors: [{ messageId: 'commentNotAllowed' }],
			output: '',
		},

		{
			code: 'const x = 1; // not allowed',
			errors: [{ messageId: 'commentNotAllowed' }],
			output: 'const x = 1; ',
		},

		{
			code: '// SAFE COMMENT',
			errors: [{ messageId: 'commentNotAllowed' }],
			output: '',
		},

		{
			code: `
				// TODO: allowed
				// forbidden
				const x = 1;
			`,
			errors: [{ messageId: 'commentNotAllowed' }],
			output: `
				// TODO: allowed
				
				const x = 1;
			`,
		},

		{
			code: `
				/*
				 * regular block comment
				 */
				const y = 2;
			`,
			errors: [{ messageId: 'commentNotAllowed' }],
			output: `
				
				const y = 2;
			`,
		},
	],
});
