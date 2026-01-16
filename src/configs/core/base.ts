import globals from 'globals';
import { type Linter } from 'eslint';
import { type ConfigWithExtends } from 'typescript-eslint';
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
		rules: (() => {
			const rules: Record<string, string> = {};
			for (const ruleName of Object.keys(plugin.rules)) {
				rules[`th-rules/${ruleName}`] = 'error';
			}

			return rules as Linter.RulesRecord;
		})(),
	},
];

export default coreBase;
