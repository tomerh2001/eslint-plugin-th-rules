const MAX_TAB_COUNT = 3;

/**
 * Represents the metadata for the "no-destructuring" ESLint rule.
 *
 * @type {Object}
 * @property {string} type - The type of the rule.
 * @property {Object} docs - The documentation for the rule.
 * @property {string} docs.description - The description of the rule.
 * @property {string} docs.category - The category of the rule.
 * @property {boolean} docs.recommended - Indicates if the rule is recommended.
 * @property {Object[]} schema - The schema for the rule options.
 * @property {Object} schema[].properties - The properties of the rule options.
 * @property {number} schema[].properties.maximumDestructuredVariables - The maximum number of destructured variables allowed.
 * @property {number} schema[].properties.maximumLineLength - The maximum line length allowed.
 */
const meta = {
	type: 'problem',
	docs: {
		description: 'Disallow destructuring that does not meet certain conditions',
		category: 'Possible Errors',
		recommended: true,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/no-destructuring.md'
	},
	schema: [
		{
			type: 'object',
			properties: {
				maximumDestructuredVariables: {
					type: 'integer',
					minimum: 0,
				},
				maximumLineLength: {
					type: 'integer',
					minimum: 0,
				},
			},
			additionalProperties: false,
		},
	],
};

/**
 * Creates an ESLint rule that checks for excessive destructuring in variable declarations.
 * @param {Object} context - The ESLint rule context.
 * @returns {Object} - The ESLint rule object.
 */
function create(context) {
	const MAX_VARIABLES = context?.options[0]?.maximumDestructuredVariables || 2;
	const MAX_LINE_LENGTH = context?.options[0]?.maximumLineLength || 100;

	return {
		VariableDeclarator(node) {
			const sourceCode = context.getSourceCode();
			const line = sourceCode.lines[node.loc.start.line - 1];
			const lineLength = line.length;
			const tabCount = line.search(/\S|$/);

			if (node?.id?.type !== 'ObjectPattern') {
				return;
			}

			// Check for the number of destructured variables and the nesting level
			if (tabCount > MAX_TAB_COUNT) {
				context.report({
					node,
					message: `destructuring at a nesting level above ${MAX_TAB_COUNT} is not allowed, instead saw ${tabCount} levels of nesting`,
				});
			}

			// Check for the number of destructured variables
			if (node?.id?.properties?.length > MAX_VARIABLES) {
				context.report({
					node,
					message: `destructuring of more than ${MAX_VARIABLES} variables is not allowed`,
				});
			}

			// Check for the line length
			if (lineLength > MAX_LINE_LENGTH) {
				context.report({
					node,
					message: `destructuring on a line exceeding ${MAX_LINE_LENGTH} characters is not allowed`,
				});
			}
		},
	};
}

const rule = {
	meta,
	create,
};

module.exports = rule;
