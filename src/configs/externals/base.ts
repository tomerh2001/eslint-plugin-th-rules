import lodash from 'eslint-plugin-lodash';
import n from 'eslint-plugin-n';
import sonarjs from 'eslint-plugin-sonarjs';
import security from 'eslint-plugin-security';
import {type ConfigWithExtends} from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export const externalsBase: ConfigWithExtends[] = [
	{
		name: 'th-rules/externals-base',
		plugins: {
			lodash,
			n,
			sonarjs,
			security,
		},
	},
	prettier,
];

export default externalsBase;
