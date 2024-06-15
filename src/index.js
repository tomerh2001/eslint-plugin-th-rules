/* eslint-disable n/no-path-concat */
/* eslint-disable unicorn/prefer-module */

'use strict';
const requireIndex = require('requireindex');

const recommended = {
	plugins: ['th-rules', 'github', 'sonarjs'],
	extends: ['plugin:github/recommended', 'plugin:sonarjs/recommended-legacy'],
	rules: {
		'th-rules/no-destructuring': 'error',
		'th-rules/no-default-export': 'error',
		'unicorn/prefer-module': 'warn',
		'@typescript-eslint/naming-convention': 'warn',
		'unicorn/filename-case': 'off',
		'unicorn/no-array-callback-reference': 'off',
		'import/extensions': 'off',
		'@typescript-eslint/consistent-type-definitions': 'off',
		'unicorn/no-static-only-class': 'off',
		'@typescript-eslint/no-extraneous-class': 'off',
		'unicorn/no-await-expression-member': 'off',
		'@typescript-eslint/no-duplicate-type-constituents': 'off',
		'new-cap': 'off',
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
		recommended,
	},
};
