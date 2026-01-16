import globals from 'globals';
import {type Linter} from 'eslint';
import {type ConfigWithExtends} from 'typescript-eslint';
import plugin from '../../plugin.js';

export const coreBase: ConfigWithExtends[] = [
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
		rules: Object.keys(plugin.rules).reduce<Record<string, string>>((acc, ruleName) => {
			acc[`th-rules/${ruleName}`] = 'error';
			return acc;
		}, {}) as Linter.RulesRecord,
	},
];
