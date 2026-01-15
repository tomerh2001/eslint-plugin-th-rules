/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {RuleTester} from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/no-comments';

const ruleTester = new RuleTester({});

ruleTester.run('no-comments', rule, {
	valid: [
		// Default allowed patterns
		'// TODO: refactor this',
		'// todo: refactor this',
		'// WARNING: this is important',
		'// ERROR: something failed',
		'// INFO: just for reference',

		// ESLint directives (must actually be used)
		'/* eslint-env node */',

		// JSDoc is always allowed
		'/**\n * JSDoc comment\n */\nfunction test() {}',

		// User allow
		{
			code: '// my custom comment',
			options: [{allow: ['custom']}],
		},

		// Allow wins over disallow (current behavior)
		{
			code: '// custom comment',
			options: [{allow: ['custom'], disallow: ['custom']}],
		},
	],

	invalid: [
		// Simple line comment
		{
			code: '// this is not allowed',
			errors: [{messageId: 'commentNotAllowed'}],
			output: '',
		},

		// Block comment
		{
			code: '/* not allowed */',
			errors: [{messageId: 'commentNotAllowed'}],
			output: '',
		},

		// Inline comment
		{
			code: 'const x = 1; // not allowed',
			errors: [{messageId: 'commentNotAllowed'}],
			output: 'const x = 1; ',
		},

		// SAFE comment is not allowed by default
		{
			code: '// SAFE COMMENT',
			errors: [{messageId: 'commentNotAllowed'}],
			output: '',
		},

		// Multiple comments – only invalid removed
		{
			code: `
				// TODO: allowed
				// forbidden
				const x = 1;
			`,
			errors: [{messageId: 'commentNotAllowed'}],
			output: `
				// TODO: allowed
				
				const x = 1;
			`,
		},

		// Non-JSDoc block comment
		{
			code: `
				/*
				 * regular block comment
				 */
				const y = 2;
			`,
			errors: [{messageId: 'commentNotAllowed'}],
			output: `
				
				const y = 2;
			`,
		},
	],
});
