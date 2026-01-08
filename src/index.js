/* eslint-disable import-x/order */
/* eslint-disable n/no-path-concat */
/* eslint-disable unicorn/prefer-module */

'use strict';

const requireIndex = require('requireindex');
const globals = require('globals');
const {FlatCompat} = require('@eslint/eslintrc');
const reactPlugin = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const tseslint = require('typescript-eslint');
const lodashPlugin = require('eslint-plugin-lodash');

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
		n: nPlugin,
		sonarjs: sonarjsPlugin,
		security: securityPlugin,
		lodash: lodashPlugin,

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
		lodash: {version: 4, pragma: '_'},
	},
	rules: {
		'th-rules/no-destructuring': 'error',
		'th-rules/no-default-export': 'error',
		'th-rules/no-comments': 'error',
		'th-rules/top-level-functions': 'error',
		'th-rules/schemas-in-schemas-file': 'error',
		'th-rules/types-in-dts': 'error',

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

		'lodash/import-scope': [2, 'full'],
	},
};

/** @type {import('eslint').Linter.FlatConfig[]} */
plugin.configs.recommended = flatConfigs(
	// Legacy configs -> convert them
	compat.extends('plugin:sonarjs/recommended-legacy', 'plugin:security/recommended-legacy', 'plugin:lodash/recommended'),
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
	compat.extends('plugin:react/recommended'),
	compat.extends('plugin:react/jsx-runtime'),
	compat.extends('plugin:react-hooks/recommended'),
	{
		rules: {
			'n/prefer-global/process': 'off',
			'react-hooks/set-state-in-effect': 'off',
		},
	},
);

module.exports = plugin;
