import {coreBase} from '../core/base.js';
import {externalsBase} from '../externals/base.js';
import {externalsOpinionated} from '../externals/opinionated.js';

export const recommended = [
	...coreBase,
	...externalsBase,
	...externalsOpinionated,
];
