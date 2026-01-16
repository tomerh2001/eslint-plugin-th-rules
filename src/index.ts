/* eslint-disable import-x/order */

import {type Linter, type Rule} from 'eslint';

import {recommended} from './configs/bundles/recommended.js';
import {recommendedReact} from './configs/bundles/recommended-react.js';
import {recommendedTypescript} from './configs/bundles/recommended-typescript.js';
import {recommendedTypescriptReact} from './configs/bundles/recommended-typescript-react.js';
import {rules} from './plugin.js';

export const configs = {
	recommended,
	recommendedReact,
	recommendedTypescript,
	recommendedTypescriptReact,
};

export {coreBase} from './configs/core/base.js';
export {coreTypescript} from './configs/core/typescript.js';
export {coreReact} from './configs/core/react.js';
export {externalsBase} from './configs/externals/base.js';
export {externalsOpinionated} from './configs/externals/opinionated.js';

const index = {rules, configs} as unknown as {rules: Record<string, Rule.RuleModule>; configs: Record<string, Linter.Config[]>};
export default index;
