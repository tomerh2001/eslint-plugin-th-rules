import noBooleanCoercion from './rules/no-boolean-coercion.js';
import noComments from './rules/no-comments.js';
import noDefaultExport from './rules/no-default-export.js';
import noDestructuring from './rules/no-destructuring.js';
import preferIsEmpty from './rules/prefer-is-empty.js';
import schemasInSchemasFile from './rules/schemas-in-schemas-file.js';
import topLevelFunctions from './rules/top-level-functions.js';
import typesInDts from './rules/types-in-dts.js';

export const rules = {
	noBooleanCoercion,
	noComments,
	noDefaultExport,
	noDestructuring,
	preferIsEmpty,
	schemasInSchemasFile,
	topLevelFunctions,
	typesInDts,
};

const plugin = { rules };
export default plugin;
