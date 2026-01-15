import globals from 'globals';
import plugin from '../../plugin.js';

export const coreBase = [
	{
		name: 'th-rules/core-base',
		plugins: {
			'th-rules': plugin,
		},
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.es2024,
				...globals.jest,
			},
		},
		rules: Object.keys(plugin.rules).reduce((acc, ruleName) => {
			acc[`th-rules/${ruleName}`] = 'error';
			return acc;
		}, {} as Record<string, string>),
	},
];
