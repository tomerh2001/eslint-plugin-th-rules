import _ from 'lodash';
import noBooleanCoercion from './rules/no-boolean-coercion.js';
import noComments from './rules/no-comments.js';
import noDefaultExport from './rules/no-default-export.js';
import noDestructuring from './rules/no-destructuring.js';
import noExplicitNilCompare from './rules/no-explicit-nil-compare.js';
import preferExplicitNilCheck from './rules/prefer-explicit-nil-check.js';
import preferIsEmpty from './rules/prefer-is-empty.js';
import schemasInSchemasFile from './rules/schemas-in-schemas-file.js';
import topLevelFunctions from './rules/top-level-functions.js';
import typesInDts from './rules/types-in-dts.js';

export const rules = {
	'no-boolean-coercion': noBooleanCoercion,
	'no-comments': noComments,
	'no-default-export': noDefaultExport,
	'no-destructuring': noDestructuring,
	'no-explicit-nil-compare': noExplicitNilCompare,
	'prefer-explicit-nil-check': preferExplicitNilCheck,
	'prefer-is-empty': preferIsEmpty,
	'schemas-in-schemas-file': schemasInSchemasFile,
	'top-level-functions': topLevelFunctions,
	'types-in-dts': typesInDts,
};

const plugin = { rules };
export default plugin;
