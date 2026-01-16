import { type ConfigWithExtends } from 'typescript-eslint';

export const coreReact: ConfigWithExtends[] = [
	{
		name: 'th-rules/core-react-overrides',
		rules: {
			'react-hooks/set-state-in-effect': 'off',
		},
	},
];
export default coreReact;
