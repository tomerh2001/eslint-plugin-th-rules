/* eslint-disable import-x/order */
/* eslint-disable import-x/no-extraneous-dependencies */
/* eslint-disable n/no-path-concat */
/* eslint-disable unicorn/prefer-module */

'use strict';

const requireIndex = require('requireindex');
const globals = require('globals');
const {FlatCompat} = require('@eslint/eslintrc');
const reactPlugin = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const tseslint = require('typescript-eslint');

// Plugins referenced by rule names in this config
const unicornPlugin = require('eslint-plugin-unicorn');
const importPlugin = require('eslint-plugin-import');
const nPlugin = require('eslint-plugin-n');
const sonarjsPlugin = require('eslint-plugin-sonarjs');
const securityPlugin = require('eslint-plugin-security');

const plugin = {
	rules: requireIndex(`${__dirname}/rules`),
	configs: {},
};

// Flattens configs so we never embed arrays inside arrays (avoids "Unexpected key '0'")
const asArray = value => (Array.isArray(value) ? value : [value]);
const flatConfigs = (...items) => items.flatMap(element => asArray(element));

// Converts legacy "extends"/eslintrc configs into flat config objects
const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const baseRecommended = {
	plugins: {
		// Local rules
		'th-rules': plugin,

		// Third-party plugins used by rule names below
		unicorn: unicornPlugin,
		import: importPlugin,
		n: nPlugin,
		sonarjs: sonarjsPlugin,
		security: securityPlugin,

		// Included so consumers can use react/react-hooks rules as well
		react: reactPlugin,
		'react-hooks': reactHooks,
	},
	languageOptions: {
		ecmaVersion: 2024,
		sourceType: 'module',
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

/** @type {import('eslint').Linter.FlatConfig[]} */
plugin.configs.recommended = flatConfigs(
	// Legacy configs -> convert them
	compat.extends('plugin:sonarjs/recommended-legacy', 'plugin:security/recommended-legacy'),
	baseRecommended,
);

plugin.configs['recommended-typescript'] = flatConfigs(
	plugin.configs.recommended,

	// Typescript-eslint exports flat configs (arrays of flat config objects)
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
);

plugin.configs['recommended-react'] = flatConfigs(
	plugin.configs.recommended,

	// IMPORTANT: Always use compat here so we never accidentally inject eslintrc-style
	// { plugins: ["react"] } into flat config (which causes the exact error you hit).
	compat.extends('plugin:react/recommended'),
	compat.extends('plugin:react-hooks/recommended'),

	{
		rules: {
			'n/prefer-global/process': 'off',
		},
	},
);

module.exports = plugin;
