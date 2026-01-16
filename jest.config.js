/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

const config = {
	testEnvironment: 'node',
	transform: {
		...tsJestTransformCfg,
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				diagnostics: {
					ignoreCodes: [151_002],
				},
			},
		],
	},
};

export default config;
