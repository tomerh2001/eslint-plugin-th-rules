import {resolveFlatConfig} from '@leancodepl/resolve-eslint-flat-config';
import { Linter } from 'eslint';
import {coreTypescript} from '../core/typescript.js';
import {recommended} from './recommended.js';

export const recommendedTypescript = resolveFlatConfig([
	...recommended,
	...coreTypescript,
] as Linter.Config[]);
