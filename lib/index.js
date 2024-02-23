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
	recommended: {
		plugins: ['eslint-th'],
		rules: {
			'eslint-th/no-destructuring': 'error',
			'eslint-th/no-unamed-default-export': 'error',
		},
	},
};
