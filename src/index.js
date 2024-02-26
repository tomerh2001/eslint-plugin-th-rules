/* eslint-disable n/no-path-concat */
/* eslint-disable unicorn/prefer-module */

/**
 * @fileoverview A List of custom ESLint rules created by Tomer Horowitz
 * @author Tomer Horowitz
 */
'use strict';
const requireIndex = require('requireindex');

/**
 * ESLint rules configuration.
 * @type {Object.<string, string>}
 */
const rules = {
	'th-rules/no-destructuring': 'error',
	'th-rules/no-default-export': 'error',
};

/**
 * Represents a basic configuration object.
 * @typedef {Object} BasicConfig
 * @property {string[]} plugins - The list of plugins.
 * @property {Object} rules - The rules object.
 * @type {BasicConfig}
 */
const basic = {
	plugins: ['th-rules'],
	rules,
};

const recommended = {
	...basic,
};

module.exports = {
	rules: requireIndex(`${__dirname}/rules`),
	configs: {
		basic,
		recommended,
	},
};
