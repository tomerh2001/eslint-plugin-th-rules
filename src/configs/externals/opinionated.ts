import { ConfigWithExtends } from "typescript-eslint";

export const externalsOpinionated: ConfigWithExtends[] = [
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
