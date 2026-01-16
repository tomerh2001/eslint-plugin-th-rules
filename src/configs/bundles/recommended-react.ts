import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import {type Linter} from 'eslint';
import {resolveFlatConfig} from '@leancodepl/resolve-eslint-flat-config';
import {coreReact} from '../core/react.js';
import {recommended} from './recommended.js';

export const recommendedReact: Linter.Config[] = resolveFlatConfig([
	...recommended,
	react.configs.flat.recommended,
	react.configs.flat['jsx-runtime'],
	reactHooks.configs.flat.recommended,
	...coreReact,
] as Linter.Config[]);

export default recommendedReact;
