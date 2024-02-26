/* eslint-disable n/no-path-concat */
/* eslint-disable unicorn/prefer-module */

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
module.exports = {
	rules: requireIndex(`${__dirname}/rules`),
	configs: {
		all: {
			plugins: ['th-rules'],
			rules: {
				'th-rules/no-destructuring': 'error',
				'th-rules/no-default-export': 'error',
			},
		},
	},
};
