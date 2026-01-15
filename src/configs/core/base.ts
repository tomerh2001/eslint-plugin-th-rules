import globals from 'globals';
import plugin from '../../index.js';

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
		rules: {
			'th-rules/no-destructuring': 'error',
			'th-rules/no-default-export': 'error',
			'th-rules/no-comments': 'error',
			'th-rules/top-level-functions': 'error',
			'th-rules/schemas-in-schemas-file': 'error',
			'th-rules/types-in-dts': 'error',
			'th-rules/no-boolean-coercion': 'error',
			'th-rules/prefer-is-empty': 'error',
		},
	},
];
