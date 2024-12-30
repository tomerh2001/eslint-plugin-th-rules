/* eslint-disable n/no-path-concat */
/* eslint-disable unicorn/prefer-module */

'use strict';
const requireIndex = require('requireindex');

const configs = {
	recommended: {
		plugins: [
			'th-rules',
			'sonarjs',
		],
		extends: [
			'plugin:sonarjs/recommended-legacy',
			'plugin:security/recommended-legacy',
		],
		rules: {
			'th-rules/no-destructuring': 'error',
			'th-rules/no-default-export': 'error',
			'th-rules/no-comments': 'error',
			'unicorn/prefer-module': 'warn',
			'unicorn/filename-case': 'off',
			'unicorn/no-array-callback-reference': 'off',
			'import/extensions': 'off',
			'unicorn/no-static-only-class': 'off',
			'unicorn/no-await-expression-member': 'off',
			'new-cap': 'off',
			'no-await-in-loop': 'off',
			'n/file-extension-in-import': 'off',
			'import/no-cycle': 'off',
			camelcase: 'warn',
			'sonarjs/mouse-events-a11y': 'off',
			'sonarjs/no-unstable-nested-components': 'off',
			'unicorn/prefer-global-this': 'off',
			'unicorn/no-thenable': 'off',
			'sonarjs/no-clear-text-protocols': 'off',
		},
		env: {
			node: true,
			es2024: true,
			jest: true,
		},
	},
};

for (const configName of Object.keys(configs)) {
	configs[`${configName}-typescript`] = {
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
	configs[`${configName}-react`] = {
		...configs[configName],
		extends: [
			'plugin:react/recommended',
			'plugin:react-hooks/recommended',
			...configs[configName].extends,
		],
		rules: {
			...configs[configName].rules,
			'n/prefer-global/process': 'off',
		},
	};
}

module.exports = {
	rules: requireIndex(`${__dirname}/rules`),
	configs,
};
