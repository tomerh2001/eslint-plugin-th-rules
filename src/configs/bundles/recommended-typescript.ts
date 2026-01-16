import {resolveFlatConfig} from '@leancodepl/resolve-eslint-flat-config';
import {type Linter} from 'eslint';
import {coreTypescript} from '../core/typescript.js';
import {recommended} from './recommended.js';

export const recommendedTypescript: Linter.Config[] = resolveFlatConfig([
	...recommended,
	...coreTypescript,
] as Linter.Config[]);

export default recommendedTypescript;
