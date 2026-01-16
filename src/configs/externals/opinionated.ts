import { type ConfigWithExtends } from 'typescript-eslint';

export const externalsOpinionated: ConfigWithExtends[] = [
	{
		name: 'th-rules/externals-opinionated',
		rules: {
			'lodash/import-scope': ['error', 'full'],
			'lodash/chaining': ['error', 'implicit'],
			camelcase: 'warn',
			'security/detect-unsafe-regex': 'off',
			'sonarjs/no-clear-text-protocols': 'off',
			'import-x/extensions': 'off',
			'unicorn/filename-case': 'off',
			'prettier/prettier': [
				'error',
				{
					useTabs: true,
					tabWidth: 2,
					printWidth: 200,
					singleQuote: true,
					trailingComma: 'all',
				},
			],
		},
	},
];

export default externalsOpinionated;
