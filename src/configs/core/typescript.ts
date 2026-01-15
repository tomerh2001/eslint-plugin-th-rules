import {configs as ts, type ConfigWithExtends} from 'typescript-eslint';

export const coreTypescript: ConfigWithExtends[] = [
	...ts.strictTypeChecked,
	...ts.stylisticTypeChecked,
	{
		name: 'th-rules/core-typescript-overrides',
		rules: {
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/no-extraneous-class': 'off',
			'@typescript-eslint/no-duplicate-type-constituents': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
		},
	},
];
