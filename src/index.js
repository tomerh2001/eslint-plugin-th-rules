/* eslint-disable n/no-path-concat */
/* eslint-disable unicorn/prefer-module */

/**
 * @fileoverview A List of custom ESLint rules created by Tomer Horowitz
 * @author Tomer Horowitz
 */
'use strict';
const requireIndex = require('requireindex');

/**
 * Represents a basic configuration object.
 *
 * @type {Object}
 * @property {string[]} plugins - The list of plugins.
 * @property {string[]} extends - The list of extended configurations.
 * @property {Object} rules - The rules configuration.
 * @property {Object} envs - The environment configuration.
 */
const basic = {
	plugins: ['th-rules'],
	extends: [],
	rules: {
		'th-rules/no-destructuring': 'error',
		'th-rules/no-default-export': 'error',
	},
	envs: {},
};

/**
 * Represents the recommended ESLint configuration.
 * @type {Object}
 */
const recommended = {
	...basic,
	envs: {
		node: true,
		ES2024: true,
		jest: true,
	},
	rules: {
		...basic.rules,
		'unicorn/filename-case': 'off',
		'unicorn/prefer-module': 'warn',
		'import/extensions': 'off',
		camelcase: 'warn',
	},
};

/**
 * Represents an object containing all the configurations.
 * @type {Object}
 */
const all = {
	...recommended,
	plugins: [...recommended.plugins, 'jsdoc'],
	extends: [...recommended.extends, 'plugin:jsdoc/recommended-error'],
};

/**
 * Represents an object containing all React-related configurations.
 * @typedef {Object} allReact
 * @property {Object} envs - The environment configurations.
 * @property {boolean} envs.browser - Indicates if the browser environment is enabled.
 * @property {Object} rules - The rule configurations.
 * @property {string} rules['react/no-array-index-key'] - The configuration for the 'react/no-array-index-key' rule.
 * @property {string[]} extends - The list of extended configurations.
 */
const allReact = {
	...all,
	envs: {...all.envs, node: false, browser: true},
	rules: {...all.rules, 'react/no-array-index-key': 'off'},
	extends: [...all.extends, 'xo-react'],
};

/**
 * Object representing all React Native configurations.
 * @type {Object}
 */
const allReactNative = {
	...allReact,
	extends: [...allReact.extends, 'plugin:react-native/all'],
};

module.exports = {
	rules: requireIndex(`${__dirname}/rules`),
	configs: {
		basic,
		recommended,
		all,
		'all-react': allReact,
		'all-react-native': allReactNative,
	},
};
