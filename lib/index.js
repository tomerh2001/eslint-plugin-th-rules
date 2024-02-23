/**
 * @fileoverview Prevent object destructions from going out of hand
 * @author Tomer Horowitz
 */

import * as noUnnamedDefaultExport from './rules/no-unamed-default-export.js';
import * as noDestruction from './rules/no-destruction.js';

export const rules = {
	...noUnnamedDefaultExport,
	...noDestruction,
};
