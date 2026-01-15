import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import {coreReact} from '../core/react.js';
import {recommended} from './recommended.js';

export const recommendedReact = [
	...recommended,

	react.configs.flat.recommended,
	react.configs.flat['jsx-runtime'],
	reactHooks.configs.recommended,

	...coreReact,
];
