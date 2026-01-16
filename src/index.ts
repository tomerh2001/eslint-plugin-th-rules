import {rules} from './plugin.js';

// Public bundles
import {recommended} from './configs/bundles/recommended.js';
import {recommendedReact} from './configs/bundles/recommended-react.js';
import {recommendedTypescript} from './configs/bundles/recommended-typescript.js';
import { recommendedTypescriptReact } from './configs/bundles/recommended-typescript-react.js';

// Internal layers (named exports only)
export {rules} from './plugin.js';
export {coreBase} from './configs/core/base.js';
export {coreTypescript} from './configs/core/typescript.js';
export {coreReact} from './configs/core/react.js';
export {externalsBase} from './configs/externals/base.js';
export {externalsOpinionated} from './configs/externals/opinionated.js';

export const configs = {
	recommended,
	recommendedReact,
	recommendedTypescript,
	recommendedTypescriptReact,
};

export default { rules, configs };
