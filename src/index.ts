import noDestructuring from "./rules/no-destructuring.js";
import noDefaultExport from "./rules/no-default-export.js";
import noComments from "./rules/no-comments.js";
import topLevelFunctions from "./rules/top-level-functions.js";
import schemasInSchemasFile from "./rules/schemas-in-schemas-file.js";
import typesInDts from "./rules/types-in-dts.js";
import noBooleanCoercion from "./rules/no-boolean-coercion.js";
import preferIsEmpty from "./rules/prefer-is-empty.js";

import { recommended } from "./configs/recommended.js";
import { recommendedReact } from "./configs/recommended-react.js";
import { recommendedTypescript } from "./configs/recommended-typescript.js";

export const rules = {
  "no-destructuring": noDestructuring,
  "no-default-export": noDefaultExport,
  "no-comments": noComments,
  "top-level-functions": topLevelFunctions,
  "schemas-in-schemas-file": schemasInSchemasFile,
  "types-in-dts": typesInDts,
  "no-boolean-coercion": noBooleanCoercion,
  "prefer-is-empty": preferIsEmpty
};

export const configs = {
  recommended,
  "recommended-react": recommendedReact,
  "recommended-typescript": recommendedTypescript
};

export default {
  rules,
  configs
};