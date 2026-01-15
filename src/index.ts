import noDestructuring from './rules/no-destructuring.js';
import noDefaultExport from './rules/no-default-export.js';
import noComments from './rules/no-comments.js';
import topLevelFunctions from './rules/top-level-functions.js';
import schemasInSchemasFile from './rules/schemas-in-schemas-file.js';
import typesInDts from './rules/types-in-dts.js';
import noBooleanCoercion from './rules/no-boolean-coercion.js';
import preferIsEmpty from './rules/prefer-is-empty.js';

// Public bundles
import {recommended} from './configs/bundles/recommended.js';
import {recommendedReact} from './configs/bundles/recommended-react.js';
import {recommendedTypescript} from './configs/bundles/recommended-typescript.js';

// Internal composition layers
export {coreBase} from './configs/core/base.js';
export {coreTypescript} from './configs/core/typescript.js';
export {coreReact} from './configs/core/react.js';
export {externalsBase} from './configs/externals/base.js';
export {externalsOpinionated} from './configs/externals/opinionated.js';

export const rules = {
	'no-destructuring': noDestructuring,
	'no-default-export': noDefaultExport,
	'no-comments': noComments,
	'top-level-functions': topLevelFunctions,
	'schemas-in-schemas-file': schemasInSchemasFile,
	'types-in-dts': typesInDts,
	'no-boolean-coercion': noBooleanCoercion,
	'prefer-is-empty': preferIsEmpty,
};

export const configs = {
	recommended,
	'recommended-react': recommendedReact,
	'recommended-typescript': recommendedTypescript,
};

export default {
	rules,
	configs,
};
