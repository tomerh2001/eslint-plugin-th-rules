/* eslint-disable n/no-path-concat */
/* eslint-disable unicorn/prefer-module */

'use strict';

const requireIndex = require('requireindex');
const globals = require('globals');
const sonarjs = require('eslint-plugin-sonarjs');
const security = require('eslint-plugin-security');
const reactPlugin = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const tseslint = require('typescript-eslint');

const plugin = {
	rules: requireIndex(`${__dirname}/rules`),
	configs: {},
};

const baseRecommended = {
	plugins: {
		'th-rules': plugin,
		security,
		react: reactPlugin,
		'react-hooks': reactHooks,
	},
	languageOptions: {
		ecmaVersion: 2024,
		globals: {
			...globals.node,
			...globals.es2024,
			...globals.jest,
		},
	},
	settings: {
		react: {version: 'detect'},
	},
	rules: {
		'th-rules/no-destructuring': 'error',
		'th-rules/no-default-export': 'error',
		'th-rules/no-comments': 'error',
		'th-rules/top-level-functions': 'error',
		'th-rules/schemas-in-schemas-file': 'error',
		'th-rules/types-in-dts': 'error',

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
};

/** @type {import('eslint').Linter.Config[]} */
plugin.configs.recommended = [
	sonarjs.configs.recommended,
	security.configs.recommended,
	baseRecommended,
];

plugin.configs['recommended-typescript'] = [
	...plugin.configs.recommended,
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
		},
		rules: {
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
	},
];

plugin.configs['recommended-react'] = [
	...plugin.configs.recommended,
	reactPlugin.configs.flat.recommended,
	reactHooks.configs['recommended-latest'] ?? reactHooks.configs.recommended,
	{
		rules: {
			'n/prefer-global/process': 'off',
		},
	},
];

module.exports = plugin;
