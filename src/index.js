/* eslint-disable n/no-path-concat */
/* eslint-disable unicorn/prefer-module */

'use strict';
const requireIndex = require('requireindex');

const base = {
	plugins: ['th-rules'],
	rules: {
		'th-rules/no-destructuring': 'error',
		'th-rules/no-default-export': 'error',
		'unicorn/filename-case': 'off',
		'unicorn/prefer-module': 'warn',
		'import/extensions': 'off',
		camelcase: 'warn',
	},
	env: {
		node: true,
		es2024: true,
		jest: true,
	},
};

module.exports = {
	rules: requireIndex(`${__dirname}/rules`),
	configs: {
		base,
	},
};
