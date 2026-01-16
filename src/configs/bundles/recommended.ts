import {resolveFlatConfig} from '@leancodepl/resolve-eslint-flat-config';
import {type Linter} from 'eslint';
import {coreBase} from '../core/base.js';
import {externalsBase} from '../externals/base.js';
import {externalsOpinionated} from '../externals/opinionated.js';

export const recommended = resolveFlatConfig([
	...coreBase,
	...externalsBase,
	...externalsOpinionated,
] as Linter.Config[]);
