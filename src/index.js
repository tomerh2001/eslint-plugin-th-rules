/* eslint-disable n/no-path-concat */
/* eslint-disable unicorn/prefer-module */

'use strict';
const requireIndex = require('requireindex');

const configs = {};
configs.recommended = {
	plugins: [
		'th-rules',
		'sonarjs',
		'no-comments',
	],
	extends: [
		'plugin:sonarjs/recommended-legacy',
		'plugin:security/recommended-legacy',
	],
	rules: {
		'th-rules/no-destructuring': 'error',
		'th-rules/no-default-export': 'error',
		'unicorn/prefer-module': 'warn',
		'unicorn/filename-case': 'off',
		'unicorn/no-array-callback-reference': 'off',
		'import/extensions': 'off',
		'unicorn/no-static-only-class': 'off',
		'unicorn/no-await-expression-member': 'off',
		'new-cap': 'off',
		'no-await-in-loop': 'off',
		camelcase: 'warn',
		'no-comments/disallowComments': [
			'error',
			{
				allow: ['^/\\*\\*(?:[\\s\\S]*?)\\*/$', 'eslint-disable', 'global', 'TODO', 'FIXME', 'NOTE', 'DEBUG'],
			},
		],

	},
	env: {
		node: true,
		es2024: true,
		jest: true,
	},
};

for (const configName of Object.keys(configs)) {
	configs[configName + '-typescript'] = {
		...configs[configName],
		extends: [
			'plugin:@typescript-eslint/strict-type-checked',
			'plugin:@typescript-eslint/stylistic-type-checked',
			...configs[configName].extends,
		],
		rules: {
			...configs[configName].rules,
			'@typescript-eslint/naming-convention': 'warn',
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/no-extraneous-class': 'off',
			'@typescript-eslint/no-duplicate-type-constituents': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
		},
	};
}

module.exports = {
	rules: requireIndex(`${__dirname}/rules`),
	configs,
};
