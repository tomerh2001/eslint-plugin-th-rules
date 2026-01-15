export const externalsOpinionated = [
	{
		name: 'th-rules/externals-opinionated',
		rules: {
			'lodash/import-scope': ['error', 'full'],
			'lodash/chaining': ['error', 'implicit'],
			camelcase: 'warn',
			'security/detect-unsafe-regex': 'off',
			'sonarjs/no-clear-text-protocols': 'off',
		},
	},
];
