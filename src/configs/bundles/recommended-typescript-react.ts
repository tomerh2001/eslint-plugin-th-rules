import {type Linter} from 'eslint';
import {resolveFlatConfig} from '@leancodepl/resolve-eslint-flat-config';
import {recommendedReact} from './recommended-react.js';
import {recommendedTypescript} from './recommended-typescript.js';
import {recommended} from './recommended.js';

export const recommendedTypescriptReact: Linter.Config[] = resolveFlatConfig([
	...recommended,
	...recommendedTypescript,
	...recommendedReact,
] as Linter.Config[]);

export default recommendedTypescriptReact;
