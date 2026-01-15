import lodash from 'eslint-plugin-lodash';
import n from 'eslint-plugin-n';
import sonarjs from 'eslint-plugin-sonarjs';
import security from 'eslint-plugin-security';

export const externalsBase = [
	{
		name: 'th-rules/externals-base',
		plugins: {
			lodash,
			n,
			sonarjs,
			security,
		},
		rules: {},
	},
];
