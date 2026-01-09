/* eslint-disable import-x/order */
/* eslint-disable n/no-path-concat */
/* eslint-disable unicorn/prefer-module */

'use strict';

import requireIndex from 'requireindex';
import {node, es2024, jest} from 'globals';
import {FlatCompat} from '@eslint/eslintrc';
import {toArray} from 'lodash';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import {configs as _configs} from 'typescript-eslint';
import lodashPlugin from 'eslint-plugin-lodash';

import nPlugin from 'eslint-plugin-n';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import securityPlugin from 'eslint-plugin-security';

const plugin = {
	rules: requireIndex(`${__dirname}/rules`),
	configs: {},
};

function flatConfigs(...items) {
	return items.flatMap(element => toArray(element));
}

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const baseRecommended = {
	plugins: {
		'th-rules': plugin,

		n: nPlugin,
		sonarjs: sonarjsPlugin,
		security: securityPlugin,
		lodash: lodashPlugin,

		react: reactPlugin,
		'react-hooks': reactHooks,
	},
	languageOptions: {
		ecmaVersion: 2024,
		sourceType: 'module',
		globals: {
			...node,
			...es2024,
			...jest,
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
		'n/prefer-global/buffer': 'off',
		'import/no-cycle': 'off',
		camelcase: 'warn',

		'sonarjs/mouse-events-a11y': 'off',
		'sonarjs/no-unstable-nested-components': 'off',
		'unicorn/prefer-global-this': 'off',
		'unicorn/no-thenable': 'off',
		'sonarjs/no-clear-text-protocols': 'off',
		'security/detect-unsafe-regex': 'off',
		'lodash/import-scope': [2, 'full'],
	},
};

/** @type {import('eslint').Linter.FlatConfig[]} */
export const recommended = plugin.configs.recommended = flatConfigs(
	compat.extends('plugin:sonarjs/recommended-legacy', 'plugin:security/recommended-legacy', 'plugin:lodash/recommended'),
	baseRecommended,
);

export const recommendedTypescript = plugin.configs['recommended-typescript'] = flatConfigs(
	plugin.configs.recommended,

	_configs.strictTypeChecked,
	_configs.stylisticTypeChecked,

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

export const recommendedReact = plugin.configs['recommended-react'] = flatConfigs(
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

export default plugin;
