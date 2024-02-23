/**
 * @fileoverview A List of custom ESLint rules created by Tomer Horowitz
 * @author Tomer Horowitz
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require('requireindex');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + '/rules');
module.exports.configs = {
	all: {
		plugins: ['eslint-plugin-th-rules'],
		rules: {
			'eslint-plugin-th-rules/no-destructuring': 'error',
			'eslint-plugin-th-rules/no-unamed-default-export': 'error',
		},
	},
};
